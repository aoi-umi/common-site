import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QueryHandlerPipe } from '@/pipes/query-handler.pipe';

import { AdminUserService } from '../admin-user/admin-user.service';
import {
  AdminUserMgtCreateDto,
  AdminUserFindOptionDto,
  AdminUserMgtUpdateDto,
} from '../admin-user/dto/admin-user.dto';

@Controller()
export class AdminUserMgtController {
  constructor(private readonly adminUserSer: AdminUserService) {}

  @Get()
  async findAll(@Query(new QueryHandlerPipe()) dto: AdminUserFindOptionDto) {
    return this.adminUserSer.findAll(dto);
  }

  @Post('create')
  async create(@Body() dto: AdminUserMgtCreateDto) {
    return this.adminUserSer.mgtCreate(dto);
  }

  @Post('update')
  async update(@Body() dto: AdminUserMgtUpdateDto) {
    return this.adminUserSer.mgtUpdate(dto);
  }
}
