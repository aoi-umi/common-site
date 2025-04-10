import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { FindOptionBaseDto } from '@/models/query.dto';

@Injectable()
export class QueryHandlerPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 默认分页
    if (value instanceof FindOptionBaseDto) {
      if (!value.pageIndex) value.pageIndex = 1;
      if (!value.pageSize) value.pageSize = 10;
    }
    return value;
  }
}
