import { Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { IsStrongPassword } from '../../validator/isStrongPassword';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: '张三',
  })
  @Expose()
  @IsString()
  readonly name: string;
  @ApiProperty({
    description: '邮箱',
    example: 'zhangsan@example.com',
  })
  @Expose()
  @IsEmail()
  @MaxLength(36)
  readonly email: string;
  @ApiProperty({
    description: '角色',
    example: 'test',
  })
  @Expose()
  @MaxLength(36)
  @IsString()
  readonly role: string;
  // plainToClass, classToPlain 在服务层，也可以手动调用
  // @Exclude() IsStrongPassword 同时使用序列化的时候会异常。这里不适用expose, 可以考虑两个dto
  // @Exclude()
  @ApiProperty({
    description: '密码',
    example: 'Aa123456',
  })
  @IsStrongPassword()
  readonly password: string;
}
