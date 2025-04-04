import { WebhookReceivedStatusEnum } from '../enum/webhook-received-status.enum';

export class StatusHistory {
  status: WebhookReceivedStatusEnum;
  date: Date;
  durationInMilliseconds?: number;
}
