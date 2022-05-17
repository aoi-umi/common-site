import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export type AuthOptions = { self?: boolean };

export const authKey = Symbol('auth');

export function Auth(opt?: AuthOptions) {
  return applyDecorators(SetMetadata(authKey, opt));
}
