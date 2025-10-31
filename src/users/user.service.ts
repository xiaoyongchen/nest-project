import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import * as bcrypt from 'bcryptjs';

// 在服务层使用自定义异常
import { NotFoundException } from '../exceptions/not-fount.exception';
import { SearchUsersDto } from './dto/search-users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // // 创建用户时对密码进行哈希处理
    // 在实体类处理了, 这里就无须处理
    // const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    // const user = this.userRepository.create({
    //   ...createUserDto,
    //   password: hashedPassword, // 存储哈希值，不是明文
    // });
    // return this.userRepository.save(user);
    // 需要实例话才能触发@BeforeInsert() @BeforeUpdate()钩子
    return this.userRepository.save(Object.assign(new User(), createUserDto));
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User', id);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  // 软删除
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    if (result.affected === 0) {
      throw new NotFoundException('User', id);
    }
  }

  // 这个需要显示把password赋给user
  async findByEmail(email: string): Promise<User | null> {
    // return this.userRepository.findOne({ where: { email } });
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
    return user;
  }
  // 分页
  async getList(searchDto: SearchUsersDto) {
    const { page, size, order, sortBy } = searchDto;

    const [users, total] = await this.userRepository.findAndCount({
      where: { isDeleted: false },
      order: { [sortBy]: order },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data: users,
      pagination: {
        page,
        size,
        total,
        pages: Math.ceil(total / size),
      },
    };
  }

  // 使用 QueryBuilder 的复杂查询
  async fuzzySearch(query: string): Promise<User[]> {
    const searchPattern = `%${query.trim()}%`;
    // 这样会导致bug，isDeleted: true 也出来了
    // .orWhere('user.email ILIKE :pattern', { pattern: searchPattern })
    // .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
    // .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.name ILIKE :pattern', { pattern: searchPattern })
      .where(
        '(user.name ILIKE :pattern OR user.email ILIKE :pattern) AND user.isDeleted = :isDeleted',
        { pattern: searchPattern, isDeleted: false },
      )
      .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('user.createdAt', 'DESC')
      .take(100)
      .getMany();
  }
}
