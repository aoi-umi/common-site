import { Injectable } from '@nestjs/common';
import * as os from 'os';
import { InjectModel } from '@nestjs/sequelize';
import { ModelAttributeColumnOptions } from 'sequelize/types';
import { isDefined } from 'class-validator';
import { Model, ModelStatic } from 'sequelize-typescript';
import { Router } from 'express';

import { UtilsService } from '@/processors/utils/utils.service';
import { ConfigService } from '@/processors/config/config.service';
import { DbUtilsService } from '@/processors/utils/db-utils.service';

import { SysMenuService } from '../sys-menu/sys-menu.service';
import { SysMenu } from '../sys-menu/entities/sys-menu.entity';
import { SysRole } from '../sys-role/entities/sys-role.entity';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysRoleAuthority } from '../sys-role/entities/sys-role-authority.entity';
import { SysApi } from '../sys-api/entities/sys-api.entity';

import { SysGenerateScriptDto } from './dto/sys.dto';
import { SysPage } from './entities/sys-page.entity';
import { SysMenuTree } from '../sys-menu/entities/sys-menu-tree.entity';
import { SysMenuAuthority } from '../sys-menu/entities/sys-menu-authority.entity';
import { SignInAdminUser } from '../admin-user/admin-user.service';

@Injectable()
export class SysService {
  constructor(
    private utilsSer: UtilsService,
    private configSer: ConfigService,
    private dbUtilsSer: DbUtilsService,
    private sysMenuSer: SysMenuService,
    @InjectModel(SysPage)
    private sysPageRepo: typeof SysPage,
    @InjectModel(SysMenu)
    private sysMenuRepo: typeof SysMenu,
    @InjectModel(SysMenuTree)
    private sysMenuTreeRepo: typeof SysMenuTree,
    @InjectModel(SysMenuAuthority)
    private sysMenuAuthRepo: typeof SysMenuAuthority,
    @InjectModel(SysApi)
    private sysApiRepo: typeof SysApi,
    @InjectModel(SysAuthority)
    private sysAuthRepo: typeof SysAuthority,
    @InjectModel(SysRole)
    private sysRoleRepo: typeof SysRole,
    @InjectModel(SysRoleAuthority)
    private sysRoleAuthRepo: typeof SysRoleAuthority,
  ) {}
  async generateScript(dto: SysGenerateScriptDto) {
    let opt = {
      data: [],
    };

    let d = await this.getSysSql(dto);
    if (d.script.length) {
      opt.data.push(d);
    }
    d = await this.getMenuSql();
    if (d.script.length) {
      opt.data.push(d);
    }
    return this._generateScript(opt);
  }

  private async getSysSql(dto: SysGenerateScriptDto) {
    let scripts: any[] = [];
    if (dto.pages?.length) {
      let sql = dto.pages.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele,
          resp: this.sysPageRepo,
          matchKey: 'name',
        });
      });
      scripts.push(`-- sysPage`);
      scripts.push(sql);
    }

    let authorityList = await this.sysAuthRepo.findAll({
      order: [['name', 'ASC']],
    });
    if (authorityList.length) {
      let sql = authorityList.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele.toJSON(),
          resp: this.sysAuthRepo,
          matchKey: 'id',
        });
      });
      scripts.push(`-- sysAuthority`);
      scripts.push(sql);
    }

    let roleList = await this.sysRoleRepo.findAll({
      order: [['name', 'ASC']],
    });
    if (roleList.length) {
      let sql = roleList.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele.toJSON(),
          resp: this.sysRoleRepo,
          matchKey: 'id',
        });
      });
      scripts.push(`-- sysRole`);
      scripts.push(sql);
    }

    let roleAuthList = await this.sysRoleAuthRepo.findAll({
      order: [
        ['roleId', 'ASC'],
        ['authorityId', 'ASC'],
      ],
    });
    if (roleAuthList.length) {
      let sql = roleAuthList.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele.toJSON(),
          resp: this.sysRoleAuthRepo,
          matchKey: ['roleId', 'authorityId'],
          noUpdate: true,
        });
      });
      scripts.push(`-- sysRoleAuthority`);
      scripts.push(sql);
    }

    let apiList = await this.sysApiRepo.findAll({
      order: [['path', 'ASC']],
    });
    if (apiList.length) {
      let sql = apiList.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele.toJSON(),
          resp: this.sysApiRepo,
          matchKey: 'id',
        });
      });
      scripts.push(`-- sysApi`);
      scripts.push(sql);
    }

    return {
      name: 'sys.sql',
      script: scripts,
    };
  }

  private async getMenuSql() {
    let scripts: any[] = [];
    let menu = await this.sysMenuRepo.findAll();
    if (menu.length) {
      let sql = menu.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele.get(),
          resp: this.sysMenuRepo,
          noUpdate: true,
          matchKey: 'id',
        });
      });
      scripts.push(`-- sysMenu`);
      scripts.push(`delete from ${this.sysMenuRepo.tableName};`);
      scripts.push(sql);
    }

    let menuTree = await this.sysMenuTreeRepo.findAll();
    if (menuTree.length) {
      let sql = menuTree.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele.get(),
          resp: this.sysMenuTreeRepo,
          noUpdate: true,
          matchKey: 'id',
        });
      });
      scripts.push(`-- sysMenuTree`);
      scripts.push(`delete from ${this.sysMenuTreeRepo.tableName};`);
      scripts.push(sql);
    }

    let menuAuth = await this.sysMenuAuthRepo.findAll();
    if (menuAuth.length) {
      let sql = menuAuth.map((ele) => {
        return this.getInsertOrUpdateScript({
          data: ele.get(),
          resp: this.sysMenuAuthRepo,
          noUpdate: true,
          matchKey: 'id',
        });
      });
      scripts.push(`-- sysMenuAuthority`);
      scripts.push(`delete from ${this.sysMenuAuthRepo.tableName};`);
      scripts.push(sql);
    }
    return {
      name: 'menu.sql',
      script: scripts,
    };
  }

  private _generateScript(opt: {
    data: {
      script: string | any[];
      name: string;
    }[];
  }) {
    let date = this.utilsSer.dateFormat(new Date(), 'YYYY_MM_DD-HH_mm_ss');
    let allRs = [];
    for (let ele of opt.data) {
      let scripts = ele.script instanceof Array ? ele.script : [ele.script];
      scripts = scripts.flat();
      let script = scripts.join(os.EOL);
      let name = ele.name;
      let rs = this.utilsSer.writeFile({
        filepath: [this.configSer.env.dataDir, date, `${name}`],
        data: script,
      });
      rs = this.utilsSer.writeFile({
        filepath: [this.configSer.env.dataDir, `${name}`],
        data: script,
      });
      allRs.push({
        filepath: rs.filepath,
      });
    }
    return allRs;
  }

  private getInsertOrUpdateScript(opt: {
    resp: typeof Model & ModelStatic<Model>;
    matchKey: string | string[];
    data;
    noUpdate?: boolean;
  }) {
    let { resp } = opt;
    let attrs = this.dbUtilsSer.getAttributes({
      resp,
      noVirtual: true,
    });
    let tableName = resp.tableName;
    let data = new (resp as any)(opt.data);
    data.createdAt = new Date();
    data.updatedAt = new Date();
    let pk = resp.primaryKeyAttribute;
    let attrList = Object.values(attrs);
    const getValue = (attr: ModelAttributeColumnOptions) => {
      let v = data[attr.field];

      if (v instanceof Date) v = this.utilsSer.dateFormat(v);
      if (!isDefined(v)) v = 'NULL';
      else if (typeof v === 'string') v = `'${v}'`;
      else if (typeof v === 'boolean') {
        v = v ? 1 : 0;
      }
      return v;
    };
    let matchKey =
      opt.matchKey instanceof Array ? opt.matchKey : [opt.matchKey];
    const getWhere = () => {
      return matchKey
        .map((ele) => `\`${ele}\` = ${getValue(attrs[ele])}`)
        .join(' AND ');
    };
    let sql = [
      `SET @id = NULL;`,
      `SELECT @id := ${pk} from ${tableName} WHERE ${getWhere()};`,

      `INSERT INTO ${tableName}(${attrList
        .map((attr) => `\`${attr.field}\``)
        .join(',')})`,
      `SELECT ${attrList.map((field) => `${getValue(field)}`).join(',')}`,
      `WHERE @id IS NULL;`,
    ];
    if (!opt.noUpdate) {
      sql = [
        ...sql,
        '',
        `SELECT @id := ${pk} from ${tableName} WHERE ${getWhere()};`,
        `UPDATE ${tableName}`,
        `SET`,
        attrList
          .filter(
            (attr) => ![pk, 'createdAt', 'updatedAt'].includes(attr.field),
          )
          .map((attr) => `\`${attr.field}\`=${getValue(attr)}`)
          .join(`,${os.EOL}`),
        `WHERE ${pk} = @id;`,
      ];
    }
    sql.push('');
    return sql.join(os.EOL);
  }

  async getData(user: SignInAdminUser) {
    let menuTree = await this.sysMenuSer.getMenuTree({
      forMain: true,
      auth: user?.isSysAdmin ? null : user?.authority || [],
    });
    return { menuTree };
  }

  async syncData(opt: { router: Router }) {
    let apis = opt.router.stack
      .map((layer) => {
        if (layer.route) {
          const path = layer.route.path;
          const method = layer.route.stack[0].method;
          return {
            method: method.toUpperCase(),
            path,
          };
        }
      })
      .filter((item) => item);
    let dbApis = await this.sysApiRepo.findAll();
    let syncApis = apis.filter((api) => {
      let match = dbApis.find(
        (dbApi) =>
          this.utilsSer.strComp(dbApi.method, api.method) === 0 &&
          this.utilsSer.strComp(dbApi.path, api.path) === 0,
      );
      return !match;
    });
    await this.sysApiRepo.bulkCreate(syncApis);
  }
}
