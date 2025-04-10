import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isDefined } from 'class-validator';
import { Op } from 'sequelize';

import { CommonException } from '@/processors/exception/common-exception';
import {
  DbUtilsService,
  FindManyOptions,
} from '@/processors/utils/db-utils.service';
import { UtilsService } from '@/processors/utils/utils.service';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import {
  SysRoleCreateDto,
  SysRoleDeleteDto,
  SysRoleUpdateDto,
} from './dto/sys-role.dto';
import { SysRoleAuthority } from './entities/sys-role-authority.entity';
import { SysRole } from './entities/sys-role.entity';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectModel(SysRole)
    private sysRoleRepo: typeof SysRole,
    @InjectModel(SysAuthority)
    private sysAuthRepo: typeof SysAuthority,
    @InjectModel(SysRoleAuthority)
    private sysRoleAuthRepo: typeof SysRoleAuthority,
    private dbUtilsSer: DbUtilsService,
    private utilsSer: UtilsService,
  ) {}

  async findAll(opt?: FindManyOptions<SysRole>) {
    opt = {
      ...opt,
    };
    if (!opt.order) {
      opt.order = [['name', 'ASC']];
    }
    let rs = await this.dbUtilsSer.findAndCount({
      resp: this.sysRoleRepo,
      findOpt: opt,
    });
    await this.setData({ role: rs.rows });
    return rs;
  }

  async findOne(id: string) {
    let rs = await this.sysRoleRepo.findByPk(id);
    if (rs) {
      await this.setData({ role: rs });
    }
    return rs;
  }

  private async setData(opt: { role: SysRole | SysRole[] }) {
    let roles = opt.role instanceof Array ? opt.role : [opt.role];
    if (!roles.length) return;
    let roleIds = roles.map((ele) => ele.id);
    let [data] = await this.dbUtilsSer.sequelize.query(
      [
        `select auth.*, roleAuth.roleId from ${this.sysAuthRepo.tableName} auth`,
        `inner join ${this.sysRoleAuthRepo.tableName} roleAuth`,
        `on roleAuth.roleId in (${roleIds.map(
          (ele) => `'${ele}'`,
        )}) and roleAuth.authorityId = auth.id`,
      ].join('\r\n'),
    );
    roles.forEach((role) => {
      role.authorityList = data
        .filter((auth: any) => auth.roleId === role.id)
        .map((ele) => new this.sysAuthRepo(ele));
    });
  }

  async create(dto: SysRoleCreateDto) {
    let data = await this.save(dto, { update: false });
    return data;
  }

  async update(dto: SysRoleUpdateDto) {
    let data = await this.save(dto, { update: true });
    return data;
  }

  private async save(
    dto: SysRoleCreateDto | SysRoleUpdateDto,
    opt: { update: boolean },
  ) {
    await this.checkSaveData(dto, { update: opt.update });
    let data: SysRole;
    let updateData;
    let authorityList = dto.authorityList || [];
    if (!opt.update) {
      data = new this.sysRoleRepo(dto);
    } else {
      let updateDto = dto as SysRoleUpdateDto;
      data = await this.sysRoleRepo.findOne({ where: { id: updateDto.id } });
      if (!data)
        throw new CommonException({
          status: HttpStatus.NOT_FOUND,
        });
      this.checkOperate(data);
      updateData = new this.sysRoleRepo(dto).get();
    }
    let authSaveData = authorityList.map((ele) => {
      return {
        authorityId: ele.id,
        roleId: '',
      };
    });
    await this.dbUtilsSer.transaction(async (transaction) => {
      if (!opt.update) {
        await data.save({ transaction });
      } else {
        await data.update(updateData, { transaction });
        await this.sysRoleAuthRepo.destroy({
          where: { roleId: data.id },
          transaction,
        });
      }
      authSaveData.forEach((ele) => {
        ele.roleId = data.id;
      });
      await this.sysRoleAuthRepo.bulkCreate(authSaveData, {
        transaction,
      });
    });
    return this.findOne(data.id);
  }

  async checkSaveData(
    dto: SysRoleCreateDto | SysRoleUpdateDto,
    opt?: { update: boolean },
  ) {
    opt = { ...opt };
    let currId = '';
    if (opt.update) {
      let d = dto as SysRoleUpdateDto;
      currId = d.id;
    } else {
      delete dto['id'];
    }
    if (dto.name) {
      let data = await this.sysRoleRepo.findOne({
        where: { name: dto.name, id: { [Op.ne]: currId } },
      });
      if (data) throw new CommonException(`[${dto.name}]已存在`);
    }
  }

  checkOperate(role: SysRole) {
    if (!role.canOperate) throw new CommonException(`禁止操作[${role.name}]`);
  }

  async remove(dto: SysRoleDeleteDto) {
    let role = await this.sysRoleRepo.findByPk(dto.id);
    if (!role) return;
    this.checkOperate(role);
    await this.dbUtilsSer.transaction(async (transaction) => {
      await role.destroy({ transaction });
      await this.sysRoleAuthRepo.destroy({
        where: { roleId: role.id },
        transaction,
      });
    });
  }
}
