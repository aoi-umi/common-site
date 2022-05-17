import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as stringify from 'json-stable-stringify';
import * as dayjs from 'dayjs';

@Injectable()
export class UtilsService {
  getGuid() {
    return uuidv4() as string;
  }

  hash(value: string, algorithm = 'md5') {
    return crypto.createHash(algorithm).update(value).digest('hex');
  }

  createToken(data) {
    let str = stringify(data);
    return this.hash(str);
  }

  mkdirs(dir) {
    if (fs.existsSync(dir)) return dir;
    return fs.mkdirSync(dir, { recursive: true });
  }

  writeFile(opt: {
    filepath: string | Array<string>;
    data: string;
    flag?: fs.OpenMode;
  }) {
    opt = {
      flag: 'w',
      ...opt,
    };
    let { filepath, flag } = opt;
    if (filepath instanceof Array) filepath = path.resolve(...filepath);
    let dir = path.dirname(filepath);
    this.mkdirs(dir);
    let fd = fs.openSync(filepath, flag);
    fs.writeFileSync(fd, opt.data);
    fs.closeSync(fd);
    return { filepath };
  }

  parseBoolean(val) {
    if (typeof val === 'string') {
      val = val.trim().toLowerCase();
    }
    return [1, '1', 'true', true].includes(val);
  }

  strComp(
    strA: string,
    strB: string,
    opt?: {
      ignoreCase?: boolean;
    },
  ) {
    opt = {
      ...opt,
    };
    if (opt.ignoreCase) {
      if (strA) strA = strA.toLocaleLowerCase();
      if (strB) strB = strB.toLocaleLowerCase();
    }
    return strA.localeCompare(strB);
  }

  dateFormat(date, fmt?: string) {
    fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
    return dayjs(date).format(fmt);
  }
}
