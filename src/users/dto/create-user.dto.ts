import { Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { IsStrongPassword } from '../../validator/isStrongPassword';
export class CreateUserDto {
  @Expose()
  @IsString()
  readonly name: string;
  @Expose()
  @IsEmail()
  @MaxLength(36)
  readonly email: string;
  // plainToClass, classToPlain 在服务层，也可以手动调用
  // @Exclude() IsStrongPassword 同时使用序列化的时候会异常。这里不适用expose, 可以考虑两个dto
  // @Exclude()
  @IsStrongPassword()
  readonly password: string;
}
