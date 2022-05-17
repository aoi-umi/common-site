import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { HandlerAfterInterceptor } from './interceptor/handler-after.interceptor';
import { init } from './middleware/init.middleware';
import { ConfigService, env } from './processors/config/config.service';
import { LoggerService } from './processors/logger/logger.service';
import { AuthGuard } from './processors/auth/auth.guard';
import { SysApiService } from './modules/admin/sys-api/sys-api.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
    cors: {
      credentials: true,
      origin: (origin, cb) => {
        cb(null, origin);
      },
    },
  });
  if (!env.noDoc) {
    const config = new DocumentBuilder()
      .setTitle('api docs')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'My API Docs',
    };
    SwaggerModule.setup('docs', app, document, customOptions);
  }
  const httpAdapterHost = app.get(HttpAdapterHost);
  const logSer = app.get(LoggerService);
  const configSer = app.get(ConfigService);
  const apiSer = app.get(SysApiService);
  const reflector = app.get(Reflector);

  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(init({ loggerService: logSer }));
  app.useGlobalGuards(new AuthGuard(apiSer, reflector));

  /**
    HandlerAfterInterceptor 记录success
    AllExceptionsFilter 记录error
  * */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        // excludeExtraneousValues: true,
      },
    }),
  );
  app.useGlobalInterceptors(new HandlerAfterInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  await app.listen(configSer.env.port || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
