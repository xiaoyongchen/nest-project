// 创建登录dto
// src/auth/dto/login.dto.ts
import { IsEmail, MaxLength } from 'class-validator';
import { IsStrongPassword } from '../../validator/isStrongPassword';
import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose()
  @IsEmail()
  @MaxLength(36)
  email: string;

  @IsStrongPassword()
  password: string;
}
