import { Controller, Get } from '@nestjs/common';
import { ReqParams, ReqParamsResult } from '@/decorators/req-params.decorator';
import { SysService } from '../sys/sys.service';

@Controller()
export class AdminMainController {
  constructor(private sysService: SysService) {}

  @Get('mainData')
  getData(@ReqParams() data: ReqParamsResult) {
    return this.sysService.getData(data.adminUser);
  }
}
