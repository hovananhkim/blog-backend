import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/entities/blog.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { BlogCreateRequestDto } from './dto/blog-create.request';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  async create(user: User, blogCreate: BlogCreateRequestDto): Promise<Blog> {
    const { title, description, image } = blogCreate;
    const blog = this.blogsRepository.create({
      title,
      description,
      image,
      user,
    });
    try {
      const result = await this.blogsRepository.save(blog);
      delete result.user;
      return result;
    } catch (error) {
      
    }
  }

  async getAll(): Promise<Blog[]> {
    return this.blogsRepository.find();
  }

  async getMyBlog(user: User): Promise<Blog[]> {
    return this.blogsRepository.find({ user });
  }

  async getById(id: string): Promise<Blog> {
    return this.findById(id);
  }

  async update(id: string, blogUpdate: BlogCreateRequestDto): Promise<Blog> {
    const blog = await this.findById(id);
    const { title, description } = blogUpdate;
    blog.title = title;
    blog.description = description;
    return this.blogsRepository.save(blog);
  }

  async delete(id: string): Promise<void> {
    const blog = await this.findById(id);
    await this.blogsRepository.delete(blog);
  }

  private async findById(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException(`Blog ID with ${id} not found`);
    }
    return blog;
  }
}
