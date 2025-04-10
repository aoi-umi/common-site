import {
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ResponseCommon } from '@/processors/response/response.common';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: T, context: ExecutionContext) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    let httpStatus = exception['status'] || HttpStatus.INTERNAL_SERVER_ERROR;

    let statusCode = httpStatus;
    if (![401, 403, 404].includes(httpStatus)) httpStatus = 200;
    const resBody = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(req),
      ...new ResponseCommon(exception).getResObj(),
    };

    let statusMsg = HttpStatus[httpStatus];
    if (!resBody.msg && statusMsg) resBody.msg = statusMsg;

    console.log(exception);

    const logObj = req.logObject;
    logObj.end(req, resBody);

    httpAdapter.reply(ctx.getResponse(), resBody, httpStatus);
  }
}
