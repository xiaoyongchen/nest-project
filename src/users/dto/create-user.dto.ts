import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MaxLength,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

// 自定义校验器
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
        },
        defaultMessage() {
          return '密码必须包含大小写字母和数字，且长度至少8位';
        },
      },
    });
  };
}
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
