import { Module } from '@nestjs/common';

import { ConfigService } from '@/processors/config/config.service';
import { UtilsService } from '@/processors/utils/utils.service';

import { WeChatService } from '@/modules/common/wechat/wechat.service';
import { UserCommonModule } from '@/modules/common/user/user.module';

import { UserController } from './user.controller';

@Module({
  imports: [UserCommonModule],
  controllers: [UserController],
  providers: [WeChatService, ConfigService, UtilsService],
})
export class UserModule {}
