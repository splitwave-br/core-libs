import { StatusEnum } from './status-enum';
import { TypeEnum } from './type-enum';

export class WebhookBodyDTO {
  notification_type: TypeEnum;
  message: {
    reference_code: string;
    value_cents: number;
    content: string;
    status: StatusEnum;
    generator_name: string;
    generator_document: string;
    payer_name: string;
    payer_document: string;
    registration_date?: string | null;
    payment_date?: string | null;
    end_to_end?: string | null;
  };
  md5?: string;
}
