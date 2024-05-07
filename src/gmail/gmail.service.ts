import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { google } from 'googleapis';
import * as R from 'ramda';
import { authorize } from '../gmail-authz/gmail.auth';

@Injectable()
export class GmailService {
  private GMAIL_API_BASE_URL;

  constructor(private configService: ConfigService) {
    this.GMAIL_API_BASE_URL =
      this.configService.get<string>('GMAIL_API_BASE_URL');
  }

  async fetchMessageDetails(auth, messageId: string) {
    const gmail = google.gmail({ version: 'v1', auth });

    const messageDetails = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'metadata',
    });
    const messageHeaders = messageDetails?.data?.payload?.headers;
    console.log('Message paylaod: ', messageHeaders);
    const messageSender = R.pipe(
      R.find(R.propEq('From', 'name')),
      R.prop('value'),
    )(messageHeaders);
    const messageSubject = R.pipe(
      R.find(R.propEq('Subject', 'name')),
      R.prop('value'),
    )(messageHeaders);

    console.log(
      'Message Sender: ',
      R.find(R.propEq('From', 'name'), messageSender),
    );
    console.log(
      'Message Subject: ',
      R.find(R.propEq('Subject', 'name'), messageSubject),
    );
  }

  async listMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
      userId: 'me',
      // q: '{from:do-not-reply@ses.binance.com is:unread}'
      q: 'from:do-not-reply@ses.binance.com',
    });
    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
      console.log('No messages found.');
      return;
    }

    return messages;
  }

  @Cron('*/3 * * * *')
  async getEmailList() {
    const gmailApiAuth = await authorize();
    const messages = await this.listMessages(gmailApiAuth);
    const firstMessage = R.head(messages);

    return this.fetchMessageDetails(gmailApiAuth, firstMessage.id);
  }
}
