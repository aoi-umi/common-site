import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ResponseCommon } from '@/processors/response/response.common';

@Injectable()
export class HandlerAfterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const logObj = req.logObject;
    return next.handle().pipe(
      map((data) => {
        let resConfig = req.myData?.resConfig;
        const resData = new ResponseCommon(null, data).getResObj();
        if (resConfig?.test) resData['test'] = true;
        logObj.end(req, resData);
        return resData;
      }),
    );
  }
}
