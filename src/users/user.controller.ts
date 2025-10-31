// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchUsersDto } from './dto/search-users.dto';
import { Public } from 'src/auth/public.decorator';

@ApiTags('用户')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth() // 声明需要认证token
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: '获取用户列表',
    description: '支持分页、排序和搜索',
  })

  // 保护用户路由
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin') // 只有管理员可以变更用户
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin') // 只有管理员可以删除用户
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
  @Post('list')
  async getList(@Body() searchUsersDto: SearchUsersDto) {
    return this.userService.getList(searchUsersDto);
  }
}
