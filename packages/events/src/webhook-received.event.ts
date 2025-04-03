import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { DomainEvent } from '@libs/events/domain-event';

export class WebhookReceivedEvent extends DomainEvent<WebhookReceivedEvent> {
  hash: string;
  acquirer: AcquirerEnum;
  receivedAt: Date;
}
