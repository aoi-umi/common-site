import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NormalUser } from 'src/processors/auth/auth.types';
import { SignInAdminUser } from 'src/modules/admin/admin-user/admin-user.service';

declare module 'express' {
  interface Request {
    myData: ReqParamsResult;
  }
}

export interface UserReqInfo {
  ip?: string;
  ua?: string;
  origin?: string;
  referer?: string;
}

type ResConfig = {
  test?: boolean;
};
export interface ReqParamsResult {
  params: ParamsDictionary;
  query: ParsedQs;
  cookies: any;
  info: UserReqInfo;
  normalUser: NormalUser;
  adminUser: SignInAdminUser;
  resConfig: ResConfig;
  request: Request;
}

export const ReqParams = createParamDecorator(
  (
    field: keyof ReqParamsResult,
    context: ExecutionContext,
  ): ReqParamsResult => {
    const request = context.switchToHttp().getRequest<Request>();

    const ip =
      (request.headers['x-forwarded-for'] as string) ||
      (request.headers['x-real-ip'] as string) ||
      request.socket.remoteAddress ||
      request.ip ||
      request.ips[0];

    const info: UserReqInfo = {
      ip: ip.replace('::ffff:', '').replace('::1', '') || null,
      ua: request.headers['user-agent'],
      origin: request.headers.origin,
      referer: request.headers.referer,
    };

    const result = {
      params: request.params,
      query: request.query,
      cookies: request.cookies,
      info,
      normalUser: request.normalUser,
      adminUser: request.adminUser,
      resConfig: {},
      request,
    } as ReqParamsResult;

    request.myData = result;

    return field ? result[field] : result;
  },
);
