import { TypeEnum } from './type-enum';

export class WebhookInfractionBodyDTO {
  data: {
    id: string;
    type: string;
    status: string;
    endToEndId: string;
    reportedBy: string;
    creationDate: string;
    reportDetails: string;
    transactionId: string;
    analysisResult: string;
    analysisDetails: string;
    transactionAmount: {
      amount: number;
      currency: string;
    };
    lastModificationDate: string;
  };
  type: TypeEnum;
}
