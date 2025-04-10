import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UtilsService } from '@/processors/utils/utils.service';
import { ConfigService } from '@/processors/config/config.service';
import { DbUtilsService } from '@/processors/utils/db-utils.service';

import { AdminUserModule } from '../admin-user/admin-user.module';
import { AdminUserMgtController } from './admin-user-mgt.controller';

@Module({
  imports: [AdminUserModule],
  controllers: [AdminUserMgtController],
  providers: [UtilsService, ConfigService, DbUtilsService],
  exports: [],
})
export class AdminUserMgtModule {}
