import { Controller, Get, Query } from '@nestjs/common';
import { QueryHandlerPipe } from '@/pipes/query-handler.pipe';
import { UserFindOptionDto } from '@/modules/common/user/dto/user.dto';
import { UserService } from '@/modules/common/user/user.service';

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
