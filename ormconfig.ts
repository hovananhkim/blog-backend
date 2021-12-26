import { ConfigService } from '@nestjs/config';
let configService = new ConfigService();

const ormconfig = {
  type: 'postgres',
  entities: ['./src/entities/*.entity.ts'],
  migrations: ['./src/migrations/*.ts'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  cli: {
    migrationsDir: 'src/migrations',
  },
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  username: configService.get('DB_USERNAME'),
};

export default ormconfig;
