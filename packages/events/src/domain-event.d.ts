export declare abstract class DomainEvent<T extends object> {
    tenant: string;
    eventId: string;
    dispatchedAt: Date;
    constructor(props: Omit<T, 'eventId' | 'dispatchedAt'>);
}
