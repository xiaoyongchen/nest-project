// 创建映射到数据库表的类（实体）
// src/user/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
// @Unique(['tenantId', 'email']) // ✅ 表级唯一约束
export class User {
  // 自增主键，自动生成
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ unique: true }) // ✅ 字段级唯一约束
  email: string;

  @Column({ select: false }) // ✅ 密码字段不返回给前端
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // 新镇的字段需要UpdateDateColumn
  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ default: 'test' })
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
