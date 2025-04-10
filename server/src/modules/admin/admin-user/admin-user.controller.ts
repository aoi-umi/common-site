import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ReqParams, ReqParamsResult } from '@/decorators/req-params.decorator';
import { Auth } from '@/processors/auth/auth.decorator';
import { dev } from '@/processors/config/config.service';
import { CommonException } from '@/processors/exception/common-exception';
import { UtilsService } from '@/processors/utils/utils.service';
import { AdminUserService } from './admin-user.service';
import { AdminUserSignInDto, AdminUserUpdateDto } from './dto/admin-user.dto';

@Controller()
export class AdminUserController {
  constructor(
    private readonly adminUserService: AdminUserService,
    private utilsSer: UtilsService,
  ) {}

  @Get('info')
  async info(@ReqParams() data: ReqParamsResult) {
    return data.adminUser;
  }

  @Post('signIn')
  async signIn(
    @Body() data: AdminUserSignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let rs = await this.adminUserService.signIn(data);
    let user = rs.user;
    res.cookie(dev.authKey, user.authToken, { maxAge: rs.ttl * 1000 });
    return user;
  }

  @Post('signOut')
  async signOut(@ReqParams() data: ReqParamsResult) {
    await this.adminUserService.signOut(data.adminUser?.authToken);
  }

  @Auth({ self: true })
  @Post('update')
  async update(
    @ReqParams() data: ReqParamsResult,
    @Body() dto: AdminUserUpdateDto,
  ) {
    return this.adminUserService.update(data.adminUser.id, dto);
  }

  @Auth({ self: true })
  @Get('me')
  async meDetail(@ReqParams() data: ReqParamsResult) {
    let id = data.adminUser?.id;
    return this.adminUserService.findOne(id, { isMe: true });
  }

  @Get(':id')
  async detail(@ReqParams() data: ReqParamsResult, @Param('id') id) {
    let isMe = id === data.adminUser?.id;
    return this.adminUserService.findOne(id, { isMe });
  }
}
