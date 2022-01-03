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
    } catch (error) {}
  }

  async getAll() {
    const blogs = await this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .orderBy('updated_at', 'DESC')
      .getMany();

    const result = [];
    for (const blog of blogs) {
      const createdBy = blog.user.name;
      delete blog.user;
      const item = {
        ...blog,
        createdBy,
      };
      result.push(item);
    }
    return result;
  }

  async getMyBlog(user: User) {
    const userId = user.id;
    const blogs = await this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('blog.user_id = :userId', {userId})
      .orderBy('updated_at', 'DESC')
      .getMany();
    const result = [];
    for (const blog of blogs) {
      const createdBy = blog.user.name;
      delete blog.user;
      const item = {
        ...blog,
        createdBy,
      };
      result.push(item);
    }
    return result;
  }

  async getById(id: string): Promise<Blog> {
    return this.findById(id);
  }

  async update(id: string, blogUpdate: BlogCreateRequestDto): Promise<Blog> {
    const blog = await this.findById(id);
    const { title, description, image } = blogUpdate;
    blog.title = title;
    blog.description = description;
    blog.image = image;
    return this.blogsRepository.save(blog);
  }

  async delete(id: string, user): Promise<void> {
    const blog = await this.blogsRepository.findOne({ id, user });
    if (!blog) {
      throw new NotFoundException('BLOG_NOT_FOUND');
    }
    await this.blogsRepository.delete({ id });
  }

  private async findById(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException(`Blog ID with ${id} not found`);
    }
    return blog;
  }
}
