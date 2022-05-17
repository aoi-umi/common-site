import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { QueryHandlerPipe } from 'src/pipes/query-handler.pipe';
import { SysAuthorityService } from './sys-authority.service';
import {
  SysAuthorityCreateDto,
  SysAuthorityDeleteDto,
  SysAuthorityFindOptionDto,
  SysAuthorityUpdateDto,
} from './dto/sys-authority.dto';

@Controller()
export class SysAuthorityController {
  constructor(private readonly authSer: SysAuthorityService) {}

  @Get()
  findAll(
    @Query(new QueryHandlerPipe())
    dto: SysAuthorityFindOptionDto,
  ) {
    return this.authSer.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authSer.findOne(id);
  }

  @Post('create')
  create(@Body() dto: SysAuthorityCreateDto) {
    return this.authSer.create(dto);
  }

  @Post('update')
  update(@Body() dto: SysAuthorityUpdateDto) {
    return this.authSer.update(dto);
  }

  @Post('delete')
  remove(@Body() dto: SysAuthorityDeleteDto) {
    return this.authSer.remove(dto);
  }
}
