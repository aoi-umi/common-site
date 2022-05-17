import { Module } from '@nestjs/common';
import { SysModule } from '../sys/sys.module';
import { AdminMainController } from './main.controller';

@Module({
  imports: [SysModule],
  controllers: [AdminMainController],
  providers: [],
})
export class AdminMainModule {}
