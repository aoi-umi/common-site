import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ReqParams, ReqParamsResult } from './decorators/req-params.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    let data = this.appService.getHello();
    res.end(data);
  }

  @Get('/json')
  getHelloJson() {
    let resData = this.appService.getHello();
    return resData;
  }

  @Get('/test')
  getHelloTest(@ReqParams() data: ReqParamsResult) {
    let resData = this.appService.getHello();
    data.resConfig.test = true;
    return resData;
  }
}
