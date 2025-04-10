import { Controller, Get, Post, Body } from '@nestjs/common';
import { UtilsService } from '@/processors/utils/utils.service';
import { UserService } from '@/modules/common/user/user.service';
import { OauthName } from '@/modules/common/user/constants';
import { UserSignInDto } from '@/modules/common/user/dto/user.dto';
import { WeChatService } from '@/modules/common/wechat/wechat.service';

@Controller()
export class UserController {
  constructor(
    private readonly userSer: UserService,
    private readonly WxSer: WeChatService,
    private readonly utilsSer: UtilsService,
  ) {}

  @Get('signInfo')
  signInfo() {
    return { test: 'test' };
  }

  @Post('signIn')
  async signIn(@Body() reqData: UserSignInDto) {
    let session = await this.WxSer.getSession(reqData.code);
    let oauthData = {
      oauthName: OauthName.wechat,
      oauthId: session.openid,
    };
    let user = await this.userSer.findUserByOauth({
      name: oauthData.oauthName,
      oauthId: oauthData.oauthId,
    });
    if (!user) {
      let rs = await this.userSer.createByOauth({
        ...oauthData,
        user: {
          nickname: reqData.nickname,
          avatar: reqData.avatar,
        },
      });
      user = rs.user;
    }
    return user;
  }
}
