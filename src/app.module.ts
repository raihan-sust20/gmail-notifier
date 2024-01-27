import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GmailModule } from './gmail/gmail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), GmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
