import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UtilsService } from 'src/processors/utils/utils.service';
import { ConfigService } from 'src/processors/config/config.service';
import { DbUtilsService } from 'src/processors/utils/db-utils.service';

import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysApi } from './entities/sys-api.entity';
import { SysApiAuthority } from './entities/sys-api-authority.entity';

import { SysApiService } from './sys-api.service';
import { SysApiController } from './sys-api.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([SysApi, SysAuthority, SysApiAuthority]),
  ],
  controllers: [SysApiController],
  providers: [
    SequelizeModule,
    UtilsService,
    ConfigService,
    DbUtilsService,
    SysApiService,
  ],
  exports: [SysApiService],
})
export class SysApiModule {}
