import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateRequestDto } from './dto/user-create.dto.request';
import * as bcrypt from 'bcrypt';
import { UserLoginRequestDto } from './dto/user-login.request.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(userCreate: UserCreateRequestDto) {
    const { email, password, name } = userCreate;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: RoleEnum.User,
    });

    try {
      const result = await this.usersRepository.save(user);
      delete result.password;
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(
    userLogin: UserLoginRequestDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = userLogin;
    const user = await this.usersRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new BadRequestException('WRONG_EMAIL_OR_PASSWORD');
    }
  }
}
