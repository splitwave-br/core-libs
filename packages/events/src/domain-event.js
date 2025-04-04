import { randomUUID } from 'crypto';
export class DomainEvent {
    constructor(props) {
        Object.assign(this, props);
        if (!this.tenant) {
            throw new Error('tenant is required');
        }
        this.eventId = randomUUID();
        this.dispatchedAt = new Date();
    }
}
