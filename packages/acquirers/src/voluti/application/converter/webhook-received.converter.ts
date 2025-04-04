import { IPayloadConverter } from '@consumer/application/handler/converter/payload-converter.interface';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TypeEnum } from '../dto/type-enum';
import { WebhookInfractionBodyDTO } from '../dto/webhook-infraction-body.dto';

export class VolutiWebhookReceivedConverter
  implements IPayloadConverter<WebhookBodyDTO>
{
  execute(
    tenant: string,
    body: WebhookBodyDTO | WebhookInfractionBodyDTO,
  ): TransactionEntity[] {
    if (!body.data.endToEndId) {
      throw new BusinessException(`endToEndId not found in body`);
    }

    switch (body.type) {
      case TypeEnum.RECEIVE:
        if (!('txId' in body.data)) {
          throw new BusinessException(`txId not found in body`);
        }

        if (!body.data.txId) {
          throw new BusinessException(`txId not found in body`);
        }

        const transaction = TransactionEntity.create(
          body.data.txId,
          tenant,
          AcquirerEnum.VOLUTI,
        );

        transaction.pay(
          parseFloat(body.data.payment.amount),
          new Date(),
          body.data.endToEndId,
        );

        return [transaction];
      case TypeEnum.INFRACTION:
        const transactionInfraction = TransactionEntity.create(
          body.data.endToEndId,
          tenant,
          AcquirerEnum.VOLUTI,
        );

        transactionInfraction.infraction(body.data.endToEndId);

        return [transactionInfraction];
      case TypeEnum.REFUND:
        throw new Error('Refund not implemented');
      default:
        throw new Error('Unknown type');
    }
  }
}
