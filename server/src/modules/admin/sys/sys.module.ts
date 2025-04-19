import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UtilsService } from '@/processors/utils/utils.service';
import { ConfigService } from '@/processors/config/config.service';
import { DbUtilsService } from '@/processors/utils/db-utils.service';

import { SysMenuModule } from '../sys-menu/sys-menu.module';
import { SysRole } from '../sys-role/entities/sys-role.entity';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysRoleAuthority } from '../sys-role/entities/sys-role-authority.entity';
import { SysApi } from '../sys-api/entities/sys-api.entity';

import { SysPage } from './entities/sys-page.entity';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysPage,
      SysRole,
      SysAuthority,
      SysRoleAuthority,
      SysApi,
    ]),
    SysMenuModule,
  ],
  controllers: [SysController],
  providers: [
    SequelizeModule,
    UtilsService,
    ConfigService,
    DbUtilsService,
    SysService,
  ],
  exports: [SysService],
})
export class SysModule {}
