import { MainApiConfigType } from '../api'
import { currEnvCfg } from './env'

export const apiConfig: MainApiConfigType = {
  defaultArgs: {
    host: `${currEnvCfg.apiHost}/admin`,
  },
  method: {
    adminMainData: {
      url: '/mainData',
      method: 'get',
    },
    adminUserInfo: {
      url: '/adminUser/info',
      method: 'get',
    },
    adminUserSignIn: {
      url: '/adminUser/signIn',
    },
    adminUserSignOut: {
      url: '/adminUser/signOut',
    },

    adminUserUpdate: {
      url: '/adminUser/update',
    },
    adminUserDetail: {
      url: '/adminUser/:id',
      method: 'get',
    },

    sysGenerateScript: {
      url: '/sys/generateScript',
    },
    sysSyncData: {
      url: '/sys/syncData',
    },

    sysApiQuery: {
      url: '/sysApi',
      method: 'get',
    },
    sysApiCreate: {
      url: '/sysApi/create',
    },
    sysApiUpdate: {
      url: '/sysApi/update',
    },
    sysApiDelete: {
      url: '/sysApi/delete',
    },

    sysMenuQuery: {
      url: '/sysMenu',
      method: 'get',
    },
    sysMenuCreate: {
      url: '/sysMenu/create',
    },
    sysMenuUpdate: {
      url: '/sysMenu/update',
    },
    sysMenuDelete: {
      url: '/sysMenu/delete',
    },
    sysMenuMove: {
      url: '/sysMenu/move',
    },

    sysAuthorityQuery: {
      url: '/sysAuthority',
      method: 'get',
    },
    sysAuthorityCreate: {
      url: '/sysAuthority/create',
    },
    sysAuthorityUpdate: {
      url: '/sysAuthority/update',
    },
    sysAuthorityDelete: {
      url: '/sysAuthority/delete',
    },

    sysRoleQuery: {
      url: '/sysRole',
      method: 'get',
    },
    sysRoleCreate: {
      url: '/sysRole/create',
    },
    sysRoleUpdate: {
      url: '/sysRole/update',
    },
    sysRoleDelete: {
      url: '/sysRole/delete',
    },

    adminUserMgtQuery: {
      url: '/adminUserMgt',
      method: 'get',
    },
    adminUserMgtCreate: {
      url: '/adminUserMgt/create',
    },
    adminUserMgtUpdate: {
      url: '/adminUserMgt/update',
    },
  },
}
