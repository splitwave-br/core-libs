import { IPayloadConverter } from '@consumer/application/handler/converter/payload-converter.interface';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { OperationTypeEnum } from '../dto/operation-type-enum';
import { WebhookInfractionBodyDTO } from '../dto/webhook-infraction-body.dto';
import { EventEnum } from '../dto/event-enum';

export class VenitWebhookReceivedConverter
  implements IPayloadConverter<WebhookBodyDTO>
{
  execute(
    tenant: string,
    body: WebhookBodyDTO | WebhookInfractionBodyDTO,
  ): TransactionEntity[] {
    if ('event' in body) {
      if (!('data' in body)) {
        throw new BusinessException(`data not found in body`);
      }

      if (!body.data) {
        throw new BusinessException(`data not found in body`);
      }

      if (!('endToEndId' in body.data)) {
        throw new BusinessException(`endToEndId not found in body`);
      }

      if (!body.data.endToEndId) {
        throw new BusinessException(`data not found in body`);
      }

      const transaction = TransactionEntity.create(
        body.data.endToEndId,
        tenant,
        AcquirerEnum.VENIT,
      );

      switch (body.event) {
        case EventEnum.PRECAUTIONARY_BLOCK:
          transaction.infraction(body.data.endToEndId);
          break;
        default:
          throw new Error('Unknown event');
      }

      return [transaction];
    }

    if (!('transactionId' in body)) {
      throw new BusinessException(`transactionId not found in body`);
    }

    if (!('endToEndId' in body)) {
      throw new BusinessException(`endToEndId not found in body`);
    }

    if (!body.transactionId) {
      throw new BusinessException(`transactionId not found in body`);
    }

    if (!body.endToEndId) {
      throw new BusinessException(`endToEndId not found in body`);
    }

    const transaction = TransactionEntity.create(
      body.transactionId,
      tenant,
      AcquirerEnum.VENIT,
    );

    switch (body.operationType) {
      case OperationTypeEnum.RECEIPT:
        transaction.pay(body.amount, new Date(), body.endToEndId);
        break;
      default:
        throw new Error('Unknown type');
    }

    return [transaction];
  }
}
