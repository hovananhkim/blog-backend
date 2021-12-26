import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepositories: Repository<User>,
  ) {}
  getMe(user: User) {
    delete user.password;
    delete user.id;
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepositories.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
