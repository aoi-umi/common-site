import { LocalStore } from '@/store'

import { error } from '../utils'

import {
  ApiModel,
  ApiConfigModel,
  ApiMethodConfigType,
  ApiMethod,
  ApiMethodInferType,
} from './http-model'

export type MainMethod = {
  adminMainData
  adminUserInfo
  adminUserSignIn
  adminUserSignOut
  adminUserUpdate
  adminUserDetail
  sysGenerateScript
  sysSyncData
  sysMenuQuery
  sysMenuCreate
  sysMenuUpdate
  sysMenuDelete
  sysMenuMove
  sysApiQuery
  sysApiCreate
  sysApiUpdate
  sysApiDelete
  sysAuthorityQuery
  sysAuthorityCreate
  sysAuthorityUpdate
  sysAuthorityDelete
  sysRoleQuery
  sysRoleCreate
  sysRoleUpdate
  sysRoleDelete
  adminUserMgtQuery
  adminUserMgtCreate
  adminUserMgtUpdate
}

export type ApiListQueryArgs = {
  page?: number
  rows?: number
  orderBy?: string
  sortOrder?: string
}
export type MainApiConfigType = ApiConfigModel<MainMethod>

export type Result<T = any> = {
  success: boolean
  msg?: string
  statusCode?: number
  data: T
}

export type ListResult<T = any> = {
  total: number
  rows: T[]
}
export class MainApi extends ApiModel<MainMethod> {
  constructor(apiConfig: MainApiConfigType) {
    super(apiConfig, {
      beforeRequest: (req) => {
        req.headers = {
          ...this.defaultHeaders(),
          ...req.headers,
        }
        req.withCredentials = true
        return req
      },
      afterResponse: (res: Result) => {
        if (!res.success) {
          throw error(res.msg, res.statusCode)
        }
        return res.data
      },
    })
  }

  defaultHeaders() {
    const headers = {}
    let auth = 'auth'
    const token = LocalStore.getItem(auth)
    if (token) {
      headers[auth] = token
    }
    return headers
  }
}
