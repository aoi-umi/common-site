import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { Request as ExpReq } from 'express';

import { QueryHandlerPipe } from '@/pipes/query-handler.pipe';
import { SysApiService } from './sys-api.service';
import {
  SysApiDeleteDto,
  SysApiCreateDto,
  SysApiUpdateDto,
  SysApiFindOptionDto,
} from './dto/sys-api.dto';
@Controller()
export class SysApiController {
  constructor(private apiSer: SysApiService) {}

  @Get()
  findAll(
    @Request() req: ExpReq,
    @Query(new QueryHandlerPipe())
    dto: SysApiFindOptionDto,
  ) {
    const router = req.app._router;
    let routes: { path: string; method: string }[] = router.stack
      .map((routeObj) => {
        if (!routeObj.route) return;
        const path = routeObj.route.path;
        const method = routeObj.route.stack[0].method.toUpperCase();
        return {
          path,
          method,
          auth: `${path}_${method}`,
        };
      })
      .filter((item) => item);
    routes.sort((a, b) => a.path.localeCompare(b.path));
    let path = dto.where?.path?.trim();
    let method = dto.where?.method?.trim();
    routes = routes.filter((ele) => {
      return (
        (!path || ele.path.toLowerCase().includes(path.toLowerCase())) &&
        (!method || ele.method.toLowerCase().includes(method.toLowerCase()))
      );
    });
    let all = routes;
    if (dto.pageIndex && dto.pageSize) {
      let start = (dto.pageIndex - 1) * dto.pageSize;
      routes = routes.slice(start, start + dto.pageSize);
    }
    return { rows: routes, total: all.length };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiSer.findOne(id);
  }

  @Post('create')
  create(@Body() dto: SysApiCreateDto) {
    return this.apiSer.create(dto);
  }

  @Post('update')
  update(@Body() dto: SysApiUpdateDto) {
    return this.apiSer.update(dto);
  }

  @Post('delete')
  remove(@Body() dto: SysApiDeleteDto) {
    return this.apiSer.remove(dto);
  }
}
