import { EventEnum } from './event-enum';
import { StatusEnum } from './status-enum';

export class WebhookBodyDTO {
  uuid: string;
  bankData: {
    documentNumber: string;
    endtoendId: string;
    key: string;
    name: string;
    ispb: string;
    account: string;
  };
  transaction: {
    transactionId: string;
    uuid: string;
    externalId: string;
    amount: number;
    subType: string;
    type: string;
    ispb: string;
    account: string;
  };
  status: StatusEnum;
  event: EventEnum;
}
