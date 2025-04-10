import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UtilsService } from '@/processors/utils/utils.service';
import { AppCacheModule } from '@/processors/cache/cache.module';
import { ConfigService } from '@/processors/config/config.service';
import { DbUtilsService } from '@/processors/utils/db-utils.service';

import { SysRoleModule } from '../sys-role/sys-role.module';
import { SysRole } from '../sys-role/entities/sys-role.entity';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';

import { AdminUserService } from './admin-user.service';
import { AdminUserController } from './admin-user.controller';
import { AdminUser } from './entities/admin-user.entity';
import { AdminUserRole } from './entities/admin-user-role.entity';
import { AdminUserAuthority } from './entities/admin-user-authority.entity';
import { SysRoleService } from '../sys-role/sys-role.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AdminUser,
      AdminUserRole,
      AdminUserAuthority,
      SysRole,
      SysAuthority,
    ]),
    AppCacheModule,
    SysRoleModule,
  ],
  controllers: [AdminUserController],
  providers: [
    AdminUserService,
    UtilsService,
    ConfigService,
    DbUtilsService,
    SysRoleService,
  ],
  exports: [SequelizeModule, AdminUserService],
})
export class AdminUserModule {}
