import { AcquirerEnum } from '@splitwave-br/core';
import { DomainEvent } from './domain-event';

export class WebhookReceivedEvent extends DomainEvent<WebhookReceivedEvent> {
  hash: string;
  acquirer: AcquirerEnum;
  receivedAt: Date;
}
