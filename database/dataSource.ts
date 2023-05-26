import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({
  path: __dirname + '/../src/configs/env/.development.env',
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['migrations/*{.ts,.js}'],
  entities: ['src/**/entities/*{.ts,.js}'],
});
