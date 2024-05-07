import { DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

const env: any = dotenv.parse(fs.readFileSync('.env'));

export const typeOrmConfig: DataSourceOptions = {
  type: 'sqlite',
  database: env.SQLITE_DB_PATH,
  synchronize: env.TYPEORM_SYNC === 'ON',
  logging: env.TYPEORM_LOG === 'ON',
  migrations: ['dist/db/migration/*.js'],
};
