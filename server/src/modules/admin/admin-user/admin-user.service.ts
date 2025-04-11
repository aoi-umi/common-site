import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InferAttributes, FindOptions } from 'sequelize/types';
import { Op } from 'sequelize';

import { CacheService } from '@/processors/cache/cache.service';
import { ConfigService } from '@/processors/config/config.service';
import { CommonException } from '@/processors/exception/common-exception';
import { DbUtilsService } from '@/processors/utils/db-utils.service';
import { UtilsService } from '@/processors/utils/utils.service';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';

import { SysRole } from '../sys-role/entities/sys-role.entity';
import { SysRoleService } from '../sys-role/sys-role.service';
import {
  AdminUserMgtCreateDto,
  AdminUserSignInDto,
  AdminUserMgtUpdateDto,
  AdminUserUpdateDto,
} from './dto/admin-user.dto';
import { AdminUserAuthority } from './entities/admin-user-authority.entity';
import { AdminUserRole } from './entities/admin-user-role.entity';
import { AdminUser } from './entities/admin-user.entity';
import { isDefined } from 'class-validator';

export type SignInAdminUser = Partial<
  InferAttributes<AdminUser> & {
    authToken: string;
  }
>;
type CacheUser = {
  signInReq: AdminUserSignInDto;
  user: SignInAdminUser;
  ttl: number;
  // 登录时间
  signInAt: Date;
};

@Injectable()
export class AdminUserService {
  constructor(
    @InjectModel(AdminUser)
    private adminUserRepo: typeof AdminUser,
    @InjectModel(SysRole)
    private sysRoleRepo: typeof SysRole,
    @InjectModel(AdminUserRole)
    private adminUserRoleRepo: typeof AdminUserRole,
    @InjectModel(SysAuthority)
    private sysAuthRepo: typeof SysAuthority,
    @InjectModel(AdminUserAuthority)
    private adminUserAuthRepo: typeof AdminUserAuthority,
    private utilsSer: UtilsService,
    private dbUtilsSer: DbUtilsService,
    private cacheSer: CacheService,
    private configSer: ConfigService,
    private roleSer: SysRoleService,
  ) {}

  async findAll(opt?: FindOptions<AdminUser>) {
    let rs = await this.dbUtilsSer.findAndCount({
      resp: this.adminUserRepo,
      findOpt: opt,
    });
    await this.setData({ user: rs.rows });
    return rs;
  }

  async findOne(id, opt?: { isMe?: boolean; isMgt?: boolean }) {
    opt = {
      ...opt,
    };
    let user = await this.adminUserRepo.findByPk(id);
    if (user && (opt.isMe || opt.isMgt)) {
      await this.setData({ user });
    }
    return user;
  }

  private async setData(opt: { user: AdminUser | AdminUser[] }) {
    let users = opt.user instanceof Array ? opt.user : [opt.user];
    if (!users.length) return;
    let userIds = users.map((ele) => ele.id);

    let [roles] = await this.dbUtilsSer.sequelize.query(
      [
        `select role.*, userRole.userId from ${this.sysRoleRepo.tableName} role`,
        `inner join ${this.adminUserRoleRepo.tableName} userRole`,
        `on userRole.userId in (${userIds.map(
          (ele) => `'${ele}'`,
        )}) and userRole.roleId = role.id`,
      ].join('\r\n'),
    );
    let [auths] = await this.dbUtilsSer.sequelize.query(
      [
        `select auth.*, userAuth.userId from ${this.sysAuthRepo.tableName} auth`,
        `inner join ${this.adminUserAuthRepo.tableName} userAuth`,
        `on userAuth.userId in (${userIds.map(
          (ele) => `'${ele}'`,
        )}) and userAuth.authorityId = auth.id`,
      ].join('\r\n'),
    );
    let roleList = [];
    if (roles.length) {
      let roleRs = await this.roleSer.findAll({
        where: { id: { [Op.in]: roles.map((ele: any) => ele.id) } },
      });
      roleList = roleRs.rows;
    }
    users.forEach((user) => {
      let roleIds = roles
        .filter((role: any) => role.userId === user.id)
        .map((ele: any) => ele.id);
      user.roleList = roleList.filter((role) => {
        return roleIds.includes(role.id);
      });
      let authority = {};
      user.roleList.forEach((role) => {
        role.authorityList.forEach((auth) => {
          authority[auth.name] = auth;
        });
      });
      user.allAuthorityList = Object.values(authority);
      user.authority = {};
      user.allAuthorityList.forEach((auth) => {
        if (auth.status) user.authority[auth.name] = true;
      });
    });
  }

  async mgtCreate(dto: AdminUserMgtCreateDto) {
    let data = await this.mgtSave(dto, { update: false });
    return data;
  }

  async mgtUpdate(dto: AdminUserMgtUpdateDto) {
    let data = await this.mgtSave(dto, { update: true });
    return data;
  }

  private async mgtSave(
    dto: AdminUserMgtCreateDto | AdminUserMgtUpdateDto,
    opt: { update: boolean },
  ) {
    await this.checkSaveData(dto, opt);
    let data: AdminUser;
    let updateData;
    let roleList = dto.roleList || [];
    if (!opt.update) {
      data = new this.adminUserRepo(dto);
      data.password = this.encodePassword('123456');
    } else {
      let updateDto = dto as AdminUserMgtUpdateDto;
      data = await this.adminUserRepo.findOne({ where: { id: updateDto.id } });
      if (!data)
        throw new CommonException({
          status: HttpStatus.NOT_FOUND,
        });
      let update = new this.adminUserRepo(dto).get();
      updateData = {};
      [].forEach((key) => {
        if (isDefined(update[key])) updateData[key] = update[key];
      });
    }
    let roleSaveData = roleList.map((ele) => {
      return {
        roleId: ele.id,
        userId: '',
      };
    });
    await this.dbUtilsSer.transaction(async (transaction) => {
      if (!opt.update) {
        await data.save({ transaction });
      } else {
        if (Object.keys(updateData).length)
          await data.update(updateData, { transaction });
        await this.adminUserAuthRepo.destroy({
          where: { userId: data.id },
          transaction,
        });
        await this.adminUserRoleRepo.destroy({
          where: { userId: data.id },
          transaction,
        });
      }
      roleSaveData.forEach((ele) => {
        ele.userId = data.id;
      });
      await this.adminUserRoleRepo.bulkCreate(roleSaveData, {
        transaction,
      });
    });
    return this.findOne(data.id, { isMgt: true });
  }

  async checkSaveData(
    dto: AdminUserMgtCreateDto | AdminUserMgtUpdateDto,
    opt?: { update: boolean },
  ) {
    opt = { ...opt };
    let currId = '';
    if (opt.update) {
      let d = dto as AdminUserMgtUpdateDto;
      currId = d.id;
    } else {
      delete dto['id'];
    }
    if (dto.account) {
      let data = await this.adminUserRepo.findOne({
        where: { account: dto.account, id: { [Op.ne]: currId } },
      });
      if (data) throw new CommonException(`账号[${dto.account}]已存在`);
    }
  }

  async signIn(data: AdminUserSignInDto) {
    let { token, ...restData } = data;
    let rs = await this.findAll({
      where: { account: data.account },
    });
    let user = rs.rows[0];
    if (!user) {
      throw new CommonException(`user ${data.account} not found`);
    }

    if (
      !this.signInValid(token, {
        ...restData,
        password: user.password,
      })
    ) {
      throw new CommonException(`token invalid`);
    }

    let authToken = this.utilsSer.getGuid();
    let userData: SignInAdminUser = {
      authToken,
      ...user.toJSON(),
    };

    let ttl = this.configSer.env.cache.adminUser.ttl;
    await this.cacheSer.cacheSetByConfig<CacheUser>(
      {
        // req 用于自动登录
        signInReq: data,
        user: userData,
        ttl,
        signInAt: new Date(),
      },
      {
        ...this.configSer.env.cache.adminUser,
        key: authToken,
      },
    );
    return {
      user: userData,
      ttl,
    };
  }

  signInValid(
    token: string,
    data: {
      // hash password
      password: string;
    },
  ) {
    return (
      token ===
      this.utilsSer.createToken({
        ...data,
        password: data.password,
      })
    );
  }

  async getCacheUser(authToken) {
    let rs = await this.cacheSer.cacheGetByConfig<CacheUser>({
      ...this.configSer.env.cache.adminUser,
      key: authToken,
    });
    return rs;
  }

  async signOut(authToken) {
    if (authToken) {
      await this.cacheSer.cacheDelByConfig({
        ...this.configSer.env.cache.adminUser,
        key: authToken,
      });
    }
  }

  private encodePassword(pwd) {
    return this.utilsSer.hash(pwd);
  }

  async update(id, dto: AdminUserUpdateDto) {
    let data = await this.adminUserRepo.findByPk(id);
    let updateData: Partial<InferAttributes<AdminUser>> = {};
    ['nickname'].forEach((key) => {
      if (isDefined(dto[key])) updateData[key] = dto[key];
    });
    if (dto.password) {
      if (!dto.oldPassword) throw new CommonException('缺少旧密码');
      let pwd = this.encodePassword(dto.oldPassword);
      if (pwd !== data.password) throw new CommonException('旧密码不正确');
      updateData.password = this.encodePassword(dto.password);
      updateData.changePwdAt = new Date();
    }
    await this.dbUtilsSer.transaction(async (transaction) => {
      await data.update(updateData, { transaction });
    });
    return {
      updateKeys: Object.keys(updateData),
    };
  }
}
