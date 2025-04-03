import { DomainEvent } from '@libs/events/domain-event';

export interface Handler {
  execute(event: DomainEvent<object>): Promise<void>;
}
