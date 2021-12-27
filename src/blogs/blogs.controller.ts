import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnyAuthGuard } from 'src/auth/any.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { BlogsService } from './blogs.service';
import { BlogCreateRequestDto } from './dto/blog-create.request';

@Controller('blogs')
@ApiTags('Blog APIs')
@ApiBearerAuth('access-token')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  create(@GetUser() user: User, @Body() blogCreate: BlogCreateRequestDto) {
    return this.blogsService.create(user, blogCreate);
  }

  @Get()
  getAll() {
    return this.blogsService.getAll();
  }

  @Get('myblog')
  @UseGuards(JwtAuthGuard)
  getMyBlog(@GetUser() user: User) {
    return this.blogsService.getMyBlog(user);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe ) id: string) {
    return this.blogsService.getById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() blogUpdate: BlogCreateRequestDto) {
    return this.blogsService.update(id, blogUpdate);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.blogsService.delete(id, user);
  }
}
