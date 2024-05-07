import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GmailModule } from './gmail/gmail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    GmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
