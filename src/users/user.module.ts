// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 注入 User 实体到当前模块
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // 导出 UserService，auth模块中可以注入该服务
})
export class UserModule {}
