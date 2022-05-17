import { Controller, Get, Query } from '@nestjs/common';
import { QueryHandlerPipe } from 'src/pipes/query-handler.pipe';
import { UserFindOptionDto } from 'src/modules/common/user/dto/user.dto';
import { UserService } from 'src/modules/common/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query(new QueryHandlerPipe())
    dto: UserFindOptionDto,
  ) {
    let rs = await this.userService.findAll(dto);
    return rs;
  }
}
