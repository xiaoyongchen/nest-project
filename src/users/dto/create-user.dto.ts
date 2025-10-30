import { Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword } from '../../validator/isStrongPassword';
export class CreateUserDto {
  @Expose()
  @IsString()
  readonly name: string;
  @Expose()
  @IsEmail()
  @MaxLength(36)
  readonly email: string;
  @Expose()
  @MaxLength(36)
  @MinLength(1)
  @IsString()
  readonly role: string;
  // plainToClass, classToPlain 在服务层，也可以手动调用
  // @Exclude() IsStrongPassword 同时使用序列化的时候会异常。这里不适用expose, 可以考虑两个dto
  // @Exclude()
  @IsStrongPassword()
  readonly password: string;
}
