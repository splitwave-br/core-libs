import { randomUUID } from 'crypto';

export abstract class DomainEvent<T extends object> {
  tenant: string;
  eventId: string;
  dispatchedAt: Date;

  constructor(props: Omit<T, 'eventId' | 'dispatchedAt'>) {
    Object.assign(this, props);
    if (!this.tenant) {
      throw new Error('tenant is required');
    }
    this.eventId = randomUUID();
    this.dispatchedAt = new Date();
  }
}
