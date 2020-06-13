import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '172.17.0.3',
  port: 5432,
  username: 'postgres',
  password: 'secretpassword',
  database: 'taskmanagement',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
