import { Controller, Get } from '@nestjs/common';
import { SysService } from '../sys/sys.service';

@Controller()
export class AdminMainController {
  constructor(private sysService: SysService) {}

  @Get('mainData')
  getData() {
    return this.sysService.getData();
  }
}
