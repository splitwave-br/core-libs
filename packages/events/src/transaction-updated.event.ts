import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { DomainEvent } from './domain-event';
import { TransactionStatusEnum } from '@libs/core/domain/entity/enum/transaction-status.enum';

export class TransactionUpdatedEvent extends DomainEvent<TransactionUpdatedEvent> {
  acquirer: AcquirerEnum;
  transactionId: string;
  status: TransactionStatusEnum;
  updatedAt: Date;
}
