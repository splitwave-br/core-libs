import { IPayloadConverter } from '@consumer/application/handler/converter/payload-converter.interface';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TypeEnum } from '../dto/type-enum';

export class PrimepagWebhookReceivedConverter
  implements IPayloadConverter<WebhookBodyDTO>
{
  execute(tenant: string, body: WebhookBodyDTO): TransactionEntity[] {
    if (!body.message.reference_code) {
      throw new BusinessException(`reference_code not found in body`);
    }

    if (!body.message.end_to_end) {
      throw new BusinessException(`end_to_end not found in body`);
    }

    const transaction = TransactionEntity.create(
      body.message.reference_code,
      tenant,
      AcquirerEnum.PRIMEPAG,
    );

    switch (body.notification_type) {
      case TypeEnum.PIX_QRCODE:
        transaction.pay(
          body.message.value_cents / 100,
          new Date(),
          body.message.end_to_end,
        );
        break;
      default:
        throw new Error('Unknown type');
    }

    return [transaction];
  }
}
