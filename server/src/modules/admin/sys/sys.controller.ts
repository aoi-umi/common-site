import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysGenerateScriptDto } from './dto/sys.dto';

@Controller()
export class SysController {
  constructor(private sysService: SysService) {}

  @Post('generateScript')
  generateScript(@Body() dto: SysGenerateScriptDto) {
    return this.sysService.generateScript(dto);
  }

  @Post('syncData')
  syncData(@Request() req: Express.Request) {
    const router = req['app']._router;
    return this.sysService.syncData({
      router,
    });
  }
}
