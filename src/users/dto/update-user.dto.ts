// 创建数据传输对象（DTO）
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
export class UpdateUserDto extends PartialType(CreateUserDto) {}