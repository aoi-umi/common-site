import { BadRequestException } from '@nestjs/common';

export class ResponseCommon {
  success: boolean;
  data: any;
  err: any;
  constructor(err, data?) {
    this.success = err ? false : true;
    this.err = err;
    this.data = data;
    if (err && !data) {
      this.data = err?.data || err?.response;
    }
  }

  getResObj() {
    let msg = '';
    let data = this.data;
    if (!this.success) {
      msg = typeof this.err === 'string' ? this.err : this.err?.message;
      if (this.err instanceof BadRequestException) {
        const res = this.err.getResponse() as any;
        data = res?.message;
      }
    }

    return {
      success: this.success,
      data,
      msg,
    };
  }
}
