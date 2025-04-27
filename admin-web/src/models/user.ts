import stringify from 'json-stable-stringify'
import * as utils from '@/utils'
import { AuthorityDataType } from '@/views/authority-mgt'
import { RoleDataType } from '@/views/role-mgt'

export interface UserInfo {
  id?: string
  account?: string
  nickname?: string
  authToken?: string
  avatarUrl?: string
  isSysAdmin?: boolean
  roleList?: RoleDataType[]
  authorityList?: AuthorityDataType[]
  allAuthorityList?: AuthorityDataType[]
  authority?: string[]
}

export type LoginUserType = UserInfo & LoginUser
export class LoginUser {
  isLogin = false
  static create(data: UserInfo) {
    const user = new LoginUser()
    if (data) {
      for (const key in data) {
        user[key] = data[key]
      }
      user.isLogin = true
    } else {
      //
    }
    return user as LoginUserType
  }

  hasAuth(this: LoginUserType, auth: string | string[]) {
    if (auth && !this.isSysAdmin) {
      const authList = auth instanceof Array ? auth : [auth]
      for (const ele of authList) {
        if (!this.authority || !this.authority.includes(ele)) {
          return false
        }
      }
    }
    return true
  }

  equalsId(this: LoginUserType, id: string) {
    return this.id && this.id === id
  }

  static createToken(data: { account; password }) {
    let { password, ...rest } = data
    let rs = {
      ...rest,
      randKey: utils.randStr(),
    }
    let token = stringify({
      ...rs,
      password: utils.md5(password),
    })
    token = utils.md5(token)
    return {
      ...rs,
      token,
    }
  }
}
