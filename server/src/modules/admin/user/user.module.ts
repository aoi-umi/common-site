import { Module } from '@nestjs/common';

import { UserCommonModule } from 'src/modules/common/user/user.module';

import { UserController } from './user.controller';

@Module({
  imports: [UserCommonModule],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
