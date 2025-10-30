import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exceptioin.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // 基本配置
      whitelist: true, // 移除DTO中未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义属性，返回400错误
      transform: true, // 自动类型转换
      disableErrorMessages: false, // 生产环境可设为true

      // 高级配置
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式转换
      },
      // exceptionFactory: (errors) => {
      //   // 自定义错误格式
      //   return new CustomErrorResponse(errors);
      // }
    }),
  );
  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('用户管理系统 API')
    .setDescription('用户管理系统的 REST API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
