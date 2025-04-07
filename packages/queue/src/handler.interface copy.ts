import { DomainEvent } from './domain-event';

export interface Handler {
  execute(event: DomainEvent<object>): Promise<void>;
}
