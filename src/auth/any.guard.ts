import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ERROR } from 'src/constants';
  
  @Injectable()
  export class AnyAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
      return super.canActivate(context);
    }
  
    handleRequest(err, user, info) {
      if (err) {
        throw err ;
      }
      return user;
    }
  }