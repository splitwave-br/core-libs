import { IPayloadConverter } from '@consumer/application/handler/converter/payload-converter.interface';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { EventEnum } from '../dto/event-enum';
import { StatusEnum } from '../dto/status-enum';

export class DubaicashWebhookReceivedConverter
  implements IPayloadConverter<WebhookBodyDTO>
{
  execute(tenant: string, body: WebhookBodyDTO): TransactionEntity[] {
    if (!body.transaction.externalId) {
      throw new BusinessException(`externalId not found in body`);
    }

    if (!body.bankData.endtoendId) {
      throw new BusinessException(`endtoendId not found in body`);
    }

    const transaction = TransactionEntity.create(
      body.transaction.externalId,
      tenant,
      AcquirerEnum.DUBAICASH,
    );

    switch (body.event) {
      case EventEnum.PIX_PAY_IN:
        switch (body.status) {
          case StatusEnum.COMPLETED:
            transaction.pay(
              body.transaction.amount,
              new Date(),
              body.bankData.endtoendId,
            );
            break;
          default:
            throw new Error('Unknown status');
        }
        break;
      default:
        throw new Error('Unknown event');
    }

    return [transaction];
  }
}
