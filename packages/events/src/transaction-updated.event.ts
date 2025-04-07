import { AcquirerEnum } from '@splitwave-br/core';
import { DomainEvent } from './domain-event';
import { TransactionStatusEnum } from '@splitwave-br/core';

export class TransactionUpdatedEvent extends DomainEvent<TransactionUpdatedEvent> {
  acquirer: AcquirerEnum;
  transactionId: string;
  status: TransactionStatusEnum;
  updatedAt: Date;
}
