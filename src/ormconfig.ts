import { DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const env: any = dotenv.parse(fs.readFileSync('.env'));

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: env.SQLITE_DB_PATH,
  synchronize: env.TYPEORM_SYNC === 'ON',
  logging: env.TYPEORM_LOG === 'ON',
  autoLoadEntities: true,
  migrations: ['dist/db/migration/*.js'],
};
