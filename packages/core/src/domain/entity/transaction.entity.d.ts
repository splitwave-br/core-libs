import { AcquirerEnum } from './enum/acquirer.enum';
import { TransactionStatusEnum } from './enum/transaction-status.enum';
export declare class TransactionEntity {
    private readonly id;
    private readonly tenant;
    private readonly acquirer;
    private status;
    private end2end;
    private amountPaid?;
    private paymentDate?;
    static create(id: string, tenant: string, acquirer: AcquirerEnum): TransactionEntity;
    static restore(props: TransactionProperties): TransactionEntity;
    pay(amountPaid: number, paymentDate: Date, end2end: string): void;
    infraction(end2end: string): void;
    getId(): string;
    getTenant(): string;
    getAcquirer(): AcquirerEnum;
    getEnd2end(): string;
    getAmountPaid(): number;
    getPaymentDate(): Date;
    getStatus(): TransactionStatusEnum;
    private constructor();
    private validate;
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
