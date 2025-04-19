import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UtilsService } from '@/processors/utils/utils.service';
import { ConfigService } from '@/processors/config/config.service';
import { DbUtilsService } from '@/processors/utils/db-utils.service';

import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysApi } from './entities/sys-api.entity';

import { SysApiService } from './sys-api.service';
import { SysApiController } from './sys-api.controller';

@Module({
  imports: [SequelizeModule.forFeature([SysApi, SysAuthority])],
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
