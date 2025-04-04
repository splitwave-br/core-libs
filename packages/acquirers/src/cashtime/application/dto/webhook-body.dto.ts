import { StatusEnum } from './status-enum';

export class WebhookBodyDTO {
  code: string;
  externalCode: string;
  orderId: string;
  storeId: string;
  paymentMethod?: string;
  status: StatusEnum;
  endToEnd?: string;
  amount?: number;
}
