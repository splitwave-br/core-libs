import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { DomainEvent } from './domain-event';

export class PaymentInfractionedEvent extends DomainEvent<PaymentInfractionedEvent> {
  webhookHash: string;
  acquirer: AcquirerEnum;
  transactionId: string;
  end2end: string;
}
