import { WebhookReceivedEntity } from '../entity/webhook-received.entity';

export interface IWebhookReceivedRepository {
  save(entity: WebhookReceivedEntity): Promise<void>;
  update(entity: WebhookReceivedEntity): Promise<void>;
  getByHash(hash: string): Promise<WebhookReceivedEntity | void>;
}

export const IWebhookReceivedRepository = Symbol('IWebhookReceivedRepository');
