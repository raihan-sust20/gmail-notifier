import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailQueryParam } from './entities/email-query-param.entity';
import { EmailQueryParamRepositoryService } from './repositories/email-query-param-repository.service';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailQueryParam, Email])],
  controllers: [EmailsController],
  providers: [EmailsService, EmailQueryParamRepositoryService],
  exports: [EmailsService, EmailQueryParamRepositoryService, TypeOrmModule],
})
export class EmailsModule {}
