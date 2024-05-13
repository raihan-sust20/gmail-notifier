import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as R from 'ramda';
import notifier from 'node-notifier';
import * as BlubirdPromise from 'bluebird';
import { DateTime, Duration } from 'luxon';
import { google } from 'googleapis';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { authorize } from '../gmail-authz/gmail.auth';
import { CreateEmailQueryParamDto } from './dto/create-email-query-param.dto';
import { UpdateEmailQueryParamDto } from './dto/update-email-query-param.dto';
import { EmailQueryParamRepositoryService } from './repositories/email-query-param-repository.service';
import { EmailQueryParam } from './entities/email-query-param.entity';
import { IFormatedEmailQuery } from './interfaces/email-query.interface';
import {
  IEmailMessageMetadata,
  IGroupedEmailMessageMetadataItem,
} from './interfaces/email-message-metadata.interface';
import { IEmailMessageListItem } from './interfaces/email-message-list-item.interface';

@Injectable()
export class EmailsService {
  constructor(
    private emailQueryParamRepositoryService: EmailQueryParamRepositoryService,

    @InjectRepository(EmailQueryParam)
    private emailQueryParamRepository: Repository<EmailQueryParam>,
  ) {}

  /**
   * @todo Bind 'this' to the class
   */

  async create(createEmailQueryParamData: CreateEmailQueryParamDto) {
    return this.emailQueryParamRepositoryService.createEmailQueryParam(
      createEmailQueryParamData,
    );
  }

  async listEmailQueryParams() {
    return this.emailQueryParamRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailQueryParamDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }

  private getTimestamp = R.curry((duration: Duration): number => {
    return DateTime.now().minus(duration).toUnixInteger();
  });

  fetchEmailMessageMetadata = R.curry(
    async (
      auth,
      message: IEmailMessageListItem,
    ): Promise<IEmailMessageMetadata> => {
      const messageId: string = R.prop('id', message);
      const gmail = google.gmail({ version: 'v1', auth });

      const messageDetails = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'metadata',
      });
      const messageHeaders = messageDetails?.data?.payload?.headers;

      const messageFrom = R.pipe(
        R.find(R.propEq('From', 'name')),
        R.prop('value'),
      )(messageHeaders);
      const messageSubject = R.pipe(
        R.find(R.propEq('Subject', 'name')),
        R.prop('value'),
      )(messageHeaders);

      console.log('Message From: ', messageFrom);
      console.log('Message Subject: ', messageSubject);

      return {
        from: messageFrom,
        subject: messageSubject,
      };
    },
  );

  listEmailMessages = R.curry(
    async (auth, qQuery: string): Promise<IEmailMessageListItem[] | null> => {
      const gmail = google.gmail({ version: 'v1', auth });
      const timestamp = this.getTimestamp({ months: 6 });
      const res = await gmail.users.messages.list({
        userId: 'me',
        // q: `from:do-not-reply@ses.binance.com after:${timestamp}`,
        q: qQuery,
      });

      const messages = res?.data?.messages;
      if (R.isNil(messages) || messages.length === 0) {
        console.log('No messages found.');
        return null;
      }

      return messages;
    },
  );

  private formatEmailQueryParams = async (): Promise<IFormatedEmailQuery[]> => {
    const emailQueryParamListFromDb = await this.listEmailQueryParams();

    return R.map(
      (emailQueryParamItem: EmailQueryParam): IFormatedEmailQuery => {
        const name = R.prop('name', emailQueryParamItem);
        const emailAddress = R.prop('address', emailQueryParamItem);
        const lastExecuted = R.prop('lastExecuted', emailQueryParamItem);
        const lastExecutedUnixInt =
          DateTime.fromJSDate(lastExecuted).toUnixInteger();
        const qQueryFromDb = R.prop('qQuery', emailQueryParamItem);

        return {
          name,
          qQuery: `from:${emailAddress} after:${lastExecutedUnixInt} ${qQueryFromDb}`,
        };
      },
      emailQueryParamListFromDb,
    );
  };

  private listEmailMessagesMetadata = async (
    gmailApiAuth: any,
    formatedEmailQueryParamList: IFormatedEmailQuery[],
  ): Promise<IGroupedEmailMessageMetadataItem[] | null> => {
    return BlubirdPromise.each(
      formatedEmailQueryParamList,
      async (formatedEmailQueryParamItem: IFormatedEmailQuery) => {
        const qQuery = R.prop('qQuery', formatedEmailQueryParamItem);
        const name = R.prop('name', formatedEmailQueryParamItem);

        const emailMessageList = await this.listEmailMessages(
          gmailApiAuth,
          qQuery,
        );

        if (R.isNil(emailMessageList)) {
          return null;
        }

        const emailMessagesMetadata = await BlubirdPromise.each(
          emailMessageList,
          this.fetchEmailMessageMetadata(gmailApiAuth),
        );

        console.log('Email message metadata method: ', emailMessagesMetadata)

        return {
          name,
          emailMessagesMetadata,
        };
      },
    );
  };

  private sendDesktopNotification(
    groupedEmailMessagesMetadata: IGroupedEmailMessageMetadataItem[],
  ) {
    R.forEach(
      (groupedEmailMessagesMetadataItem: IGroupedEmailMessageMetadataItem) => {
        const emailMessageFrom = R.prop(
          'name',
          groupedEmailMessagesMetadataItem,
        );

        const emailMessagesMetadata = R.pipe(
          R.prop('emailMessagesMetadata'),
          R.pluck('subject'),
          R.join('\n'),
        )(groupedEmailMessagesMetadataItem);

        notifier.notify(
          {
            title: `Reciveed Email from ${emailMessageFrom}`,
            message: emailMessagesMetadata,
          },
          function (err, response, metadata) {
            console.log('Response: ', response);
            console.log('Whoops! Failed to notify user.');
            console.error(err);
          },
        );
      },
      groupedEmailMessagesMetadata,
    );
  }

  @Cron('*/3 * * * *')
  async monitorEmails() {
    const gmailApiAuth = await authorize();
    const formatedEmailQueryParamList = await this.formatEmailQueryParams();

    const groupedEmailMessagesMetadata = await this.listEmailMessagesMetadata(
      gmailApiAuth,
      formatedEmailQueryParamList,
    );

    console.log(
      'Grouped email message metadata from schedule: ',
      groupedEmailMessagesMetadata,
    );

    const filteredEmailMessagesMetadata = R.reject(
      R.isNil,
      groupedEmailMessagesMetadata,
    );

    this.sendDesktopNotification(filteredEmailMessagesMetadata);

    /**
     * Update lastExecuted prop of EmailQueryParam entity
     */
  }
}
