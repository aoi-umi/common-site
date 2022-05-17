import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService } from 'src/modules/common/user/user.service';
import { User } from 'src/modules/common/user/entities/user.entity';
import { Oauth } from 'src/modules/common/user/entities/oauth.entity';
import { DbUtilsService } from 'src/processors/utils/db-utils.service';

const providers = [UserService, DbUtilsService];

@Module({
  imports: [SequelizeModule.forFeature([User, Oauth])],
  controllers: [],
  providers: [...providers],
  exports: [...providers, SequelizeModule],
})
export class UserCommonModule {}
