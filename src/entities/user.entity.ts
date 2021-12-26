
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

export enum RoleEnum {
  Admin='ROLE_ADMIN',
  User='ROlE_USER'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  role: RoleEnum;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(()=> Blog, (blog) => blog.user)
  blogs: Blog[]
}
