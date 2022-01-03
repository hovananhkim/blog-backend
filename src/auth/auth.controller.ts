import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserCreateRequestDto } from './dto/user-create.dto.request';
import { UserLoginRequestDto } from './dto/user-login.request.dto';

@Controller('auth')
@ApiTags('Auth APIs')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() userCreate: UserCreateRequestDto) {
    return this.authService.create(userCreate);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() userLogin: UserLoginRequestDto) {
    return this.authService.login(userLogin);
  }
}
