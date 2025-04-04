import { EventEnum } from './event-enum';

export class WebhookInfractionBodyDTO {
  event: EventEnum.PRECAUTIONARY_BLOCK;
  data: {
    accountId: string;
    endToEndId: string;
    amount: string;
  };
}
