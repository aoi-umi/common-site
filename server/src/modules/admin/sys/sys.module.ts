import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UtilsService } from 'src/processors/utils/utils.service';
import { ConfigService } from 'src/processors/config/config.service';
import { DbUtilsService } from 'src/processors/utils/db-utils.service';

import { SysMenuModule } from '../sys-menu/sys-menu.module';
import { SysRole } from '../sys-role/entities/sys-role.entity';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysRoleAuthority } from '../sys-role/entities/sys-role-authority.entity';
import { SysApi } from '../sys-api/entities/sys-api.entity';
import { SysApiAuthority } from '../sys-api/entities/sys-api-authority.entity';

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
      SysApiAuthority,
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
