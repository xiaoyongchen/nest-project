import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
// import { UserController } from './user/user.controller';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

// 配置连接池
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nest_user',
      password: '123456',
      database: 'user_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // 开发环境使用，自动同步数据库结构
    }),
    UserModule, // 注册用户模块
  ],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule {}
