import { Injectable } from '@nestjs/common';
import { MiniProgram, FileStore } from 'wechat-jssdk';
import { ConfigService } from '@/processors/config/config.service';

@Injectable()
export class WeChatService {
  private apps = {};
  constructor(private configSer: ConfigService) {
    const miniProgram = new MiniProgram({
      store: new FileStore({
        fileStorePath: configSer.env.wx.infoPath,
      }),
      miniProgram: {
        appId: configSer.env.wx.appId,
        appSecret: configSer.env.wx.appSecret,
      },
    });
    this.apps['default'] = miniProgram;
  }

  private getApp(name?: string) {
    return this.apps[name || 'default'];
  }

  async getSession(code: string) {
    let session = await this.getApp().getSession(code);
    return session as {
      expires_in: number;
      openid: string;
      session_key: string;
      unionid: string;
    };
  }
}
