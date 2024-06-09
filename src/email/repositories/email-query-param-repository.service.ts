import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import * as R from 'ramda';
import { EmailQueryParam } from '../entities/email-query-param.entity';
import { CreateEmailQueryParamDto } from '../dto/create-email-query-param.dto';
import { IEmailQueryParamDataToUpdate } from '../interfaces/email-query-param-update.interface';

@Injectable()
export class EmailQueryParamRepositoryService {
  constructor(
    @InjectRepository(EmailQueryParam)
    private emailQueryParamRepository: Repository<EmailQueryParam>,
  ) {}

  createEmailQueryParam(emailQueryParamData: CreateEmailQueryParamDto) {
    const emailQueryParam = new EmailQueryParam();

    emailQueryParam.address = emailQueryParamData.address;
    emailQueryParam.name = emailQueryParamData.name;
    emailQueryParam.qQuery = emailQueryParamData.qQuery;
    emailQueryParam.lastExecuted = DateTime.now().toJSDate();

    /**
     * @todo Used just for test. Must not be used for production.
     */
    // emailQueryParam.lastExecuted = DateTime.now()
    //   .minus({ months: 3 })
    //   .toJSDate();

    return this.emailQueryParamRepository.save(emailQueryParam);
  }

  async updateEmailQueryParam(
    dataToUpdate: IEmailQueryParamDataToUpdate,
    addressList: string[] | null,
  ) {
    const addressesFromDb = await this.emailQueryParamRepository.find({
      select: { address: true },
    });
    const addressListFromDb = R.pluck('address', addressesFromDb);

    this.emailQueryParamRepository
      .createQueryBuilder()
      .update()
      .set(dataToUpdate)
      .where('address IN (:...addressList)', {
        addressList: addressList || addressListFromDb,
      })
      .execute();
  }
}
