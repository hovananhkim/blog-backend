import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { ENV_KEY } from './constants';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { Blog } from './entities/blog.entity';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${process.env.STAGE == 'prod' ? '.env.stage.prod' : '.env.stage.dev'}`,
      ],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = process.env.STAGE === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          autoLoadEntities: true,
          synchronize: false,
          entities: [User, Blog],
          type: 'postgres',
          url: configService.get(ENV_KEY.BD_URL),
          keepConnectionAlive: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    BlogsModule
  ],
})
export class AppModule {}
