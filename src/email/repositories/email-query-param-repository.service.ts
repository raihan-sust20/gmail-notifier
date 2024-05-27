import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmailQueryParam } from "../entities/email-query-param.entity";
import { CreateEmailQueryParamDto } from "../dto/create-email-query-param.dto";
import { DateTime } from "luxon";

@Injectable()
export class EmailQueryParamRepositoryService {
  constructor(
    @InjectRepository(EmailQueryParam)
    private emailQueryParamRepository: Repository<EmailQueryParam>
  ) {}

  createEmailQueryParam(emailQueryParamData: CreateEmailQueryParamDto) {
    const emailQueryParam = new EmailQueryParam();

    emailQueryParam.address = emailQueryParamData.address;
    emailQueryParam.name = emailQueryParamData.name;
    emailQueryParam.qQuery = emailQueryParamData.qQuery;
    emailQueryParam.lastExecuted = DateTime.now().toJSDate();

    /**
     * @todo Used just for test. Must be removed for production.
     */
    emailQueryParam.lastExecuted = DateTime.now().minus({ months: 3}).toJSDate();

    return this.emailQueryParamRepository.save(emailQueryParam);

  }
}