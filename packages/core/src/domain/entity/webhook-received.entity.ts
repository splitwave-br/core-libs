import * as crypto from 'crypto';
import { BusinessException } from '../exception/business.exception';
import { AcquirerEnum } from './enum/acquirer.enum';
import { WebhookReceivedStatusEnum } from './enum/webhook-received-status.enum';
import { StatusHistory } from './valiue-object/status-history.vo';

export class WebhookReceivedEntity {
  private readonly hash: string;
  private readonly tenant: string;
  private readonly acquirer: AcquirerEnum;
  private readonly receivedAt: Date;
  private readonly body: object;
  private updatedAt: Date;
  private status: WebhookReceivedStatusEnum;
  private error?: string;
  private statusHistory: StatusHistory[];

  public static create(tenant: string, acquirer: AcquirerEnum, body: object) {
    const now = new Date();
    return new WebhookReceivedEntity({
      hash: this.generateHash(body),
      tenant,
      acquirer,
      receivedAt: now,
      body,
      status: WebhookReceivedStatusEnum.RECEIVED,
      statusHistory: [
        {
          status: WebhookReceivedStatusEnum.RECEIVED,
          date: now,
        },
      ],
    });
  }

  public static restore(props: WebhookReceivedProperties) {
    return new WebhookReceivedEntity(props);
  }

  public setError(errorMessage: string): void {
    this.error = errorMessage;
    this.setStatus(WebhookReceivedStatusEnum.ERROR);
  }

  public setStatus(status: WebhookReceivedStatusEnum): void {
    this.status = status;
    this.update();
    const lastStatus = this.statusHistory[this.statusHistory.length - 1];
    if (lastStatus) {
      lastStatus.durationInMilliseconds =
        new Date().getTime() - lastStatus.date.getTime();
      this.statusHistory[this.statusHistory.length - 1] = lastStatus;
    }
    this.statusHistory.push({
      status,
      date: new Date(),
    });
  }

  public getHash(): string {
    return this.hash;
  }

  public getTenant(): string {
    return this.tenant;
  }

  public getAcquirer(): AcquirerEnum {
    return this.acquirer;
  }

  public getBody(): object {
    return this.body;
  }

  public getReceivedAt(): Date {
    return this.receivedAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getError(): string {
    return this.error;
  }

  public getStatus(): WebhookReceivedStatusEnum {
    return this.status;
  }

  public getStatusHistory(): StatusHistory[] {
    return this.statusHistory;
  }

  private update(): void {
    this.updatedAt = new Date();
    this.validate();
  }

  private constructor(props: WebhookReceivedProperties) {
    this.hash = props.hash;
    this.tenant = props.tenant;
    this.body = props.body;
    this.acquirer = props.acquirer;
    this.status = props.status;
    this.receivedAt = props.receivedAt;
    this.updatedAt = props.updatedAt;
    this.statusHistory = props.statusHistory;
    this.error = props.error;
    this.validate();
  }

  private validate(): void {
    if (!this.hash) {
      throw new BusinessException('Hash is required');
    }
    if (!this.tenant) {
      throw new BusinessException('Tenant is required');
    }
    if (!this.acquirer) {
      throw new BusinessException('Acquirer is required');
    }
    if (Object.values(AcquirerEnum).indexOf(this.acquirer) === -1) {
      throw new BusinessException(
        `Acquirer ${this.acquirer} is not supported `,
      );
    }
    if (!this.receivedAt) {
      throw new BusinessException('Received at is required');
    }
    if (!this.status) {
      throw new BusinessException('Status is required');
    }
  }

  private static generateHash(body: object): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(body))
      .digest('hex');
  }
}

export type WebhookReceivedProperties = {
  hash: string;
  body: object;
  tenant: string;
  acquirer: AcquirerEnum;
  receivedAt: Date;
  updatedAt?: Date;
  status?: WebhookReceivedStatusEnum;
  statusHistory?: StatusHistory[];
  error?: string;
};
