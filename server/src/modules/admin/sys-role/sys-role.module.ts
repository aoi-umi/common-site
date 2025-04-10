import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DbUtilsService } from '@/processors/utils/db-utils.service';
import { UtilsService } from '@/processors/utils/utils.service';

import { SysRoleService } from './sys-role.service';
import { SysRoleController } from './sys-role.controller';
import { SysRole } from './entities/sys-role.entity';
import { SysRoleAuthority } from './entities/sys-role-authority.entity';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([SysRole, SysRoleAuthority, SysAuthority]),
  ],
  controllers: [SysRoleController],
  providers: [SequelizeModule, SysRoleService, DbUtilsService, UtilsService],
  exports: [SysRoleService, SequelizeModule],
})
export class SysRoleModule {}
