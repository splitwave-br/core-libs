import { WebhookReceivedStatusEnum } from '../enum/webhook-received-status.enum';
export declare class StatusHistory {
    status: WebhookReceivedStatusEnum;
    date: Date;
    durationInMilliseconds?: number;
}
