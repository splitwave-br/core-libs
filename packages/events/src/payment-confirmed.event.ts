import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { DomainEvent } from './domain-event';

export class PaymentConfirmedEvent extends DomainEvent<PaymentConfirmedEvent> {
  acquirer: AcquirerEnum;
  webhookHash: string;
  transactionId: string;
  amountPaid: number;
  paymentDate: Date;
  end2end: string;
}
