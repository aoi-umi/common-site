import { Controller, Get, Post, Body } from '@nestjs/common';
import { SysMenuService } from './sys-menu.service';
import {
  SysMenuUpdateDto,
  SysMenuQueryDto,
  SysMenuCreateDto,
  SysMenuDeleteDto,
  SysMenuMoveDto,
} from './dto/sys-menu.dto';

@Controller()
export class SysMenuController {
  constructor(private readonly sysMenuSer: SysMenuService) {}

  @Get()
  query(@Body() dto: SysMenuQueryDto) {
    return this.sysMenuSer.findAll(dto);
  }

  @Post('create')
  save(@Body() dto: SysMenuCreateDto) {
    return this.sysMenuSer.create(dto);
  }

  @Post('update')
  update(@Body() dto: SysMenuUpdateDto) {
    return this.sysMenuSer.update(dto);
  }

  @Post('move')
  move(@Body() dto: SysMenuMoveDto) {
    return this.sysMenuSer.move(dto);
  }

  @Post('delete')
  delete(@Body() dto: SysMenuDeleteDto) {
    return this.sysMenuSer.delete(dto);
  }
}
