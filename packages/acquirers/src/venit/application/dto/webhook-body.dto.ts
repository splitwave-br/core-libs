import { OperationTypeEnum } from './operation-type-enum';
import { TypeEnum } from './type-enum';

export class WebhookBodyDTO {
  idempotencyKey: string;
  transactionId: string;
  endToEndId: string;
  key: string;
  initiationType: TypeEnum.QR_CODE_STATIC;
  operationType: OperationTypeEnum.RECEIPT;
  amount: 1;
  createdAt: string;
  description: string;
  payer: {
    number: string;
    branch: string;
    type: string;
    participant: {
      name: string;
      ispb: string;
    };
    holder: {
      name: string;
      document: string;
      type: string;
    };
  };
  beneficiary: {
    number: string;
    branch: string;
    type: string;
    participant: {
      name: string;
      ispb: string;
    };
    holder: {
      document: string;
      type: string;
    };
  };
}
