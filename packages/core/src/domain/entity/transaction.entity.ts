import { BusinessException } from '../exception/business.exception';
import { AcquirerEnum } from './enum/acquirer.enum';
import { TransactionStatusEnum } from './enum/transaction-status.enum';

export class TransactionEntity {
  private readonly id: string;
  private readonly tenant: string;
  private readonly acquirer: AcquirerEnum;
  private status: TransactionStatusEnum;
  private end2end: string;
  private amountPaid?: number;
  private paymentDate?: Date;

  public static create(id: string, tenant: string, acquirer: AcquirerEnum) {
    return new TransactionEntity({
      id,
      tenant,
      acquirer,
    });
  }

  public static restore(props: TransactionProperties) {
    return new TransactionEntity(props);
  }

  public pay(amountPaid: number, paymentDate: Date, end2end: string): void {
    this.amountPaid = amountPaid;
    this.paymentDate = paymentDate;
    this.end2end = end2end;
    this.status = TransactionStatusEnum.PAID;
    this.validate();
  }

  public infraction(end2end: string): void {
    this.end2end = end2end;
    this.status = TransactionStatusEnum.INFRACTION;
    this.validate();
  }

  public getId(): string {
    return this.id;
  }

  public getTenant(): string {
    return this.tenant;
  }

  public getAcquirer(): AcquirerEnum {
    return this.acquirer;
  }

  public getEnd2end(): string {
    return this.end2end;
  }

  public getAmountPaid(): number {
    return this.amountPaid;
  }

  public getPaymentDate(): Date {
    return this.paymentDate;
  }

  public getStatus(): TransactionStatusEnum {
    return this.status;
  }

  private constructor(props: TransactionProperties) {
    this.id = props.id;
    this.tenant = props.tenant;
    this.acquirer = props.acquirer;
    this.amountPaid = props.amountPaid;
    this.status = props.status;
    this.paymentDate = props.paymentDate;
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new BusinessException('Id is required');
    }
    if (!this.tenant) {
      throw new BusinessException('Tenant is required');
    }
    if (!this.acquirer) {
      throw new BusinessException('Acquirer is required');
    }

    if (this.status == TransactionStatusEnum.PAID) {
      if (!this.amountPaid) {
        throw new BusinessException('Amount paid is required');
      }
      if (!this.paymentDate) {
        throw new BusinessException('Payment date is required');
      }
      if (!this.end2end) {
        throw new BusinessException('End2end is required');
      }
    }

    if (this.status == TransactionStatusEnum.INFRACTION) {
      if (!this.end2end) {
        throw new BusinessException('End2end is required');
      }
    }
  }
}

export type TransactionProperties = {
  id: string;
  tenant: string;
  acquirer: AcquirerEnum;
  status?: TransactionStatusEnum;
  end2end?: string;
  amountPaid?: number;
  paymentDate?: Date;
};
