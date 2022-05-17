import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsService } from 'src/processors/utils/db-utils.service';
import { SysAuthorityService } from './sys-authority.service';
import { SysAuthorityController } from './sys-authority.controller';
import { SysAuthority } from './entities/sys-authority.entity';
import { UtilsService } from 'src/processors/utils/utils.service';

@Module({
  imports: [SequelizeModule.forFeature([SysAuthority])],
  controllers: [SysAuthorityController],
  providers: [
    SequelizeModule,
    SysAuthorityService,
    DbUtilsService,
    UtilsService,
  ],
})
export class SysAuthorityModule {}
