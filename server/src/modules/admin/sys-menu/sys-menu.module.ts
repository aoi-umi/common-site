import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DbUtilsService } from 'src/processors/utils/db-utils.service';
import { SysPage } from '../sys/entities/sys-page.entity';
import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysMenuService } from './sys-menu.service';
import { SysMenuController } from './sys-menu.controller';
import { SysMenu } from './entities/sys-menu.entity';
import { SysMenuTree } from './entities/sys-menu-tree.entity';
import { SysMenuAuthority } from './entities/sys-menu-authority.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysMenu,
      SysMenuTree,
      SysPage,
      SysMenuAuthority,
      SysAuthority,
    ]),
  ],
  controllers: [SysMenuController],
  providers: [SysMenuService, DbUtilsService],
  exports: [SequelizeModule, SysMenuService],
})
export class SysMenuModule {}
