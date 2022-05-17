import { HttpStatus } from '@nestjs/common';

type ResponseType =
  | string
  | {
      status?: number;
      error?: string;
      data?: any;
    };
export class CommonException {
  message: string;
  status: number;
  data: any;
  constructor(response: ResponseType, status?: number) {
    this.status = status;
    if (typeof response === 'string') this.message = response;
    else {
      this.message = response.error || HttpStatus[this.status];
      this.status = response.status;
      this.data = response.data;
    }
  }
}
