import { Module } from '@nestjs/common';

import { ConfigService } from 'src/processors/config/config.service';
import { UtilsService } from 'src/processors/utils/utils.service';

import { WeChatService } from 'src/modules/common/wechat/wechat.service';
import { UserCommonModule } from 'src/modules/common/user/user.module';

import { UserController } from './user.controller';

@Module({
  imports: [UserCommonModule],
  controllers: [UserController],
  providers: [WeChatService, ConfigService, UtilsService],
})
export class UserModule {}
