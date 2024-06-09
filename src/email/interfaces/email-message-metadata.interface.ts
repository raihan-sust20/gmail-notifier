export interface IEmailMessageMetadata {
  from: string;
  subject: string;
}

export interface IGroupedEmailMessageMetadataItem {
  name: string;
  emailMessagesMetadata: IEmailMessageMetadata[];
}
