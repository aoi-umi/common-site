import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { QueryHandlerPipe } from '@/pipes/query-handler.pipe';
import { SysRoleService } from './sys-role.service';
import {
  SysRoleCreateDto,
  SysRoleDeleteDto,
  SysRoleFindOptionDto,
  SysRoleUpdateDto,
} from './dto/sys-role.dto';

@Controller()
export class SysRoleController {
  constructor(private readonly roleSer: SysRoleService) {}

  @Get()
  findAll(@Query(new QueryHandlerPipe()) dto: SysRoleFindOptionDto) {
    return this.roleSer.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleSer.findOne(id);
  }

  @Post('create')
  create(@Body() dto: SysRoleCreateDto) {
    return this.roleSer.create(dto);
  }

  @Post('update')
  update(@Body() dto: SysRoleUpdateDto) {
    return this.roleSer.update(dto);
  }

  @Post('delete')
  remove(@Body() dto: SysRoleDeleteDto) {
    return this.roleSer.remove(dto);
  }
}
