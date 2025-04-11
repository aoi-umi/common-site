import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isDefined } from 'class-validator';
import { InferAttributes, Op, QueryTypes } from 'sequelize';

import { CommonException } from '@/processors/exception/common-exception';
import { DbUtilsService } from '@/processors/utils/db-utils.service';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysPage } from '../sys/entities/sys-page.entity';
import {
  SysMenuUpdateDto,
  SysMenuQueryDto,
  SysMenuCreateDto,
  SysMenuDeleteDto,
  SysMenuMoveDto,
} from './dto/sys-menu.dto';
import { SysMenuAuthority } from './entities/sys-menu-authority.entity';
import { SysMenuTree } from './entities/sys-menu-tree.entity';
import { SysMenu } from './entities/sys-menu.entity';
import { AdminUserAuthMap } from '../admin-user/entities/admin-user.entity';

type MenuTreeItem = Partial<
  SysMenu & {
    path: string;
    children: MenuTreeItem[];
  }
>;

const RootMenuId = 'ROOT';
@Injectable()
export class SysMenuService {
  constructor(
    @InjectModel(SysMenu)
    private sysMenuRepo: typeof SysMenu,
    @InjectModel(SysPage)
    private sysPageRepo: typeof SysPage,
    @InjectModel(SysMenuTree)
    private sysMenuTreeRepo: typeof SysMenuTree,
    @InjectModel(SysMenuAuthority)
    private sysMenuAuthRepo: typeof SysMenuAuthority,
    @InjectModel(SysAuthority)
    private sysAuthRepo: typeof SysAuthority,
    private dbUtilsSer: DbUtilsService,
  ) {}
  async findOne(id: string) {
    let data = await this.sysMenuRepo.findByPk(id);
    if (data) {
      await this.setData({ menu: data });
    }
    return data;
  }
  async findAll(data: SysMenuQueryDto) {
    let pages = await this.sysPageRepo.findAll();
    let menuTree = await this.getMenuTree();
    return {
      pages,
      menuTree,
    };
  }

  async getMenuTree(opt?: { forMain?: boolean; auth?: AdminUserAuthMap }) {
    opt = {
      ...opt,
    };
    let menuWhere: any = {};
    let auth: string[] = null;
    if (opt.forMain) {
      menuWhere.status = true;
      if (opt.auth) {
        auth = Object.keys(opt.auth);
      }
    }
    let menuInsts = await this.sysMenuTreeRepo.findAll({
      include: [
        {
          model: SysMenu,
          required: true,
          include: [{ model: SysPage }],
          where: menuWhere,
        },
      ],
      where: { distance: 1 },
      order: [['priority', 'ASC']],
    });
    let treeOpt: any = { menu: menuInsts.map((ele) => ele.menu), auth };
    if (opt.forMain) {
      treeOpt.noDisabledAuth = true;
    }
    await this.setData(treeOpt);
    let menuData = menuInsts
      .filter((ele) => {
        if (auth) {
          return ele.menu.authorityList.find((menuAuth) =>
            auth.includes(menuAuth.name),
          );
        }
        return true;
      })
      .map((ele) => ele.toJSON());
    let menuTree = this.genMenuTree(RootMenuId, menuData);
    return menuTree;
  }

  private async setData(opt: {
    menu: SysMenu | SysMenu[];
    noDisabledAuth?: boolean;
  }) {
    let menus = opt.menu instanceof Array ? opt.menu : [opt.menu];
    if (!menus.length) return;
    let ids = menus.map((ele) => ele.id);
    let sqlStr = [
      `select auth.*, menuAuth.menuId from ${this.sysAuthRepo.tableName} auth`,
      `inner join ${this.sysMenuAuthRepo.tableName} menuAuth`,
      `on menuAuth.menuId in (${ids.map(
        (ele) => `'${ele}'`,
      )}) and menuAuth.authorityId = auth.id`,
    ].join('\r\n');
    let [data] = await this.dbUtilsSer.sequelize.query(sqlStr);
    if (opt.noDisabledAuth) {
      data = data.filter((ele: any) => ele.status);
    }
    menus.forEach((menu) => {
      menu.authorityList = data
        .filter((auth: any) => auth.menuId === menu.id)
        .map((ele) => new this.sysAuthRepo(ele));
    });
  }

  private genMenuTree(parentId, data: SysMenuTree[]) {
    let menuTree: MenuTreeItem[] = [];
    data.forEach((ele) => {
      if (ele.ancestor === parentId) {
        let children = this.genMenuTree(ele.descendant, data);
        let { page, ...rest } = ele.menu;
        menuTree.push({
          ...rest,
          path: page?.path || '',
          children,
        });
      }
    });
    return menuTree;
  }

  async create(dto: SysMenuCreateDto) {
    let trees: any[] = [];
    let parent: SysMenu;
    if (dto.parentId) {
      parent = await this.sysMenuRepo.findOne({ where: { id: dto.parentId } });
      if (!parent)
        throw new CommonException(`can not find parent [${dto.parentId}]`);
    }
    let priority = 0;
    let last = await this.sysMenuTreeRepo.findOne({
      where: { ancestor: dto.parentId || RootMenuId, distance: 1 },
      order: [['priority', 'desc']],
    });
    if (last) priority = last.priority + 1;

    if (parent) {
      let parentTree = await this.sysMenuTreeRepo.findAll({
        where: {
          descendant: dto.parentId,
        },
      });
      trees = parentTree.map((ele) => {
        return {
          ancestor: ele.ancestor,
          distance: ele.distance + 1,
          priority: ele.ancestor === dto.parentId ? priority : 0,
        };
      });
    } else {
      trees.push({
        ancestor: RootMenuId,
        distance: 1,
        priority,
      });
    }
    return await this.save(dto, { trees });
  }

  async update(dto: SysMenuUpdateDto) {
    let data = await this.save(dto, { update: true });
    return data;
  }

  private async save(
    dto: SysMenuCreateDto | SysMenuUpdateDto,
    opt: { update?: boolean; trees?: any[] },
  ) {
    let data: SysMenu;
    let { trees } = opt;
    await this.checkSaveData(dto, { update: opt.update });
    if (!opt.update) {
      data = new this.sysMenuRepo(dto);
    } else {
      let updateDto = dto as SysMenuUpdateDto;
      data = await this.sysMenuRepo.findOne({ where: { id: updateDto.id } });
      if (!data)
        throw new CommonException({
          status: HttpStatus.NOT_FOUND,
        });
    }
    let authorityList = dto.authorityList || [];
    let authSaveData = authorityList.map((ele) => {
      return {
        authorityId: ele.id,
        menuId: '',
      };
    });
    let updateData = new this.sysMenuRepo(dto).get();
    await this.dbUtilsSer.transaction(async (transaction) => {
      if (!opt.update) {
        await data.save({ transaction });
        let menuId = data.id;
        // 树结构
        if (trees.length) {
          trees.forEach((ele) => {
            ele.descendant = menuId;
          });
          trees.push({
            ancestor: menuId,
            descendant: menuId,
            distance: 0,
          });
          await this.sysMenuTreeRepo.bulkCreate(trees, { transaction });
        }
      } else {
        await data.update(updateData, { transaction });
        await this.sysMenuAuthRepo.destroy({
          where: { menuId: data.id },
          transaction,
        });
      }
      authSaveData.forEach((ele) => {
        ele.menuId = data.id;
      });
      await this.sysMenuAuthRepo.bulkCreate(authSaveData, {
        transaction,
      });
    });
    return this.findOne(data.id);
  }

  async checkSaveData(
    dto: SysMenuCreateDto | SysMenuUpdateDto,
    opt?: { update: boolean },
  ) {
    opt = { ...opt };
    let currId = '';
    if (opt.update) {
      let d = dto as SysMenuUpdateDto;
      currId = d.id;
    } else {
      let d = dto as SysMenuCreateDto;
      delete dto['id'];
    }
    if (dto.name) {
      let data = await this.sysMenuRepo.findOne({
        where: {
          name: dto.name,
          id: { [Op.ne]: currId },
        },
      });
      if (data) throw new CommonException(`[${dto.name}]已存在`);
    }
  }

  async move(dto: SysMenuMoveDto) {
    let data = await this.sysMenuRepo.findByPk(dto.id);
    if (!data) throw new CommonException('Not Found');
    let trees = await this.dbUtilsSer.sequelize.query<any>(
      `select * from ${this.sysMenuTreeRepo.tableName} where ancestor in (
        select ancestor from ${this.sysMenuTreeRepo.tableName} 
        where descendant = '${data.id}' and distance = 1
      ) and distance = 1
      order by priority asc 
    `,
      { type: QueryTypes.SELECT },
    );
    let idx = trees.findIndex((ele) => ele.descendant === data.id);
    let changeIdx = -1;
    if (dto.op === 'moveUp') {
      changeIdx = idx - 1;
    } else if (dto.op === 'moveDown') {
      changeIdx = idx + 1;
    } else {
      throw new CommonException(`unknown operation [${dto.op}]`);
    }
    let currTree = trees[idx];
    let changeTree = trees[changeIdx];
    let update = false;
    if (changeIdx >= 0 && changeTree) {
      update = true;
      await this.dbUtilsSer.transaction(async (transaction) => {
        await this.sysMenuTreeRepo.update(
          { priority: changeTree.priority },
          { where: { id: currTree.id }, transaction },
        );
        await this.sysMenuTreeRepo.update(
          { priority: currTree.priority },
          { where: { id: changeTree.id }, transaction },
        );
      });
    }
    return {
      update,
    };
  }

  async delete(dto: SysMenuDeleteDto) {
    await this.dbUtilsSer.transaction(async (transaction) => {
      // 菜单和子菜单id
      let rs = await SysMenuTree.findAll({
        where: { ancestor: dto.id },
        attributes: ['descendant'],
        group: ['descendant'],
      });
      let ids = rs.map((ele) => ele.descendant);
      await SysMenu.destroy({ where: { id: { [Op.in]: ids } }, transaction });
      await SysMenuTree.destroy({
        where: { descendant: { [Op.in]: ids } },
        transaction,
      });
    });
  }
}
