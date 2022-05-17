import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { QueryHandlerPipe } from 'src/pipes/query-handler.pipe';
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
    @Query(new QueryHandlerPipe())
    dto: SysApiFindOptionDto,
  ) {
    return this.apiSer.findAll(dto);
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
