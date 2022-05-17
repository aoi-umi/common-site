import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';

import { routes, routeModules } from './routes';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, dev, env } from './processors/config/config.service';
import { LoggerService } from './processors/logger/logger.service';
import { UserMiddleware } from './middleware/user.middleware';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...env.db,
      autoLoadModels: true,
      ...dev.dbOptions,
    }),
    ...routeModules,
    RouterModule.register(routes),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, LoggerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
