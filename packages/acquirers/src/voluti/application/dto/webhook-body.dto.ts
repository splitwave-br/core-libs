import { QRCodeStatusEnum } from './qrcode-status.enum';
import { TransactionTypeEnum } from './transaction-type.enum';
import { TypeEnum } from './type-enum';

export class WebhookBodyDTO {
  data: {
    id: string;
    txId: string;
    pixKey: string;
    status: QRCodeStatusEnum;
    payment: {
      amount: string;
      currency: string;
    };
    refunds: any[];
    createdAt: string;
    errorCode: string | null;
    endToEndId: string;
    ticketData: any;
    webhookType: string;
    debtorAccount: {
      ispb: string;
      name: string;
      issuer: string;
      number: string;
      document: string;
      accountType: string;
    };
    idempotencyKey: string | null;
    creditDebitType: string;
    creditorAccount: {
      ispb: string;
      name: string;
      issuer: string;
      number: string;
      document: string;
      accountType: string;
    };
    localInstrument: string;
    transactionType: TransactionTypeEnum;
    remittanceInformation: string | null;
    type?: string;
    reportedBy?: string;
  };
  type: TypeEnum;
}
