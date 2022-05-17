import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction,
  getModule,
} from 'vuex-module-decorators'
import { LoginUserType, LoginUser } from '@/models/user'
import { env } from '@/config'
import { LocalStore } from './local-store'

@Module({ name: 'user' })
export class LoginUserStore extends VuexModule {
  user: LoginUserType = LoginUser.create(null)

  @Mutation
  setUser(user) {
    this.user = LoginUser.create(user)
    if (!user) {
      LocalStore.removeItem(env.authKey)
    }
  }

  logining = false
  @Mutation
  setLogining(v) {
    this.logining = v
  }
}
