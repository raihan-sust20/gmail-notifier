import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailQueryParam } from './entities/email-query-param.entity';
import { EmailQueryParamRepositoryService } from './repositories/email-query-param-repository.service';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailQueryParam, Email])],
  controllers: [EmailController],
  providers: [EmailService, EmailQueryParamRepositoryService],
  exports: [EmailService, EmailQueryParamRepositoryService, TypeOrmModule],
})
export class EmailModule {}
