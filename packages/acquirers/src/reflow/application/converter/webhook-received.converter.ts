import { IPayloadConverter } from '@consumer/application/handler/converter/payload-converter.interface';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { StatusEnum } from '../dto/status-enum';
import { PaymentMethodEnum } from '../dto/payment-method-enum';
import { AMOUNT_PAID_NOT_INFORMED } from '@libs/acquirers/const';

export class ReflowWebhookReceivedConverter
  implements IPayloadConverter<WebhookBodyDTO>
{
  execute(tenant: string, body: WebhookBodyDTO): TransactionEntity[] {
    if (!body.code) {
      throw new BusinessException(`code not found in body`);
    }

    if (!body.endToEnd) {
      throw new BusinessException(`endToEnd not found in body`);
    }

    const transaction = TransactionEntity.create(
      body.code,
      tenant,
      AcquirerEnum.REFLOW,
    );

    switch (body.paymentMethod) {
      case PaymentMethodEnum.PIX:
        switch (body.status) {
          case StatusEnum.PAID:
            transaction.pay(
              AMOUNT_PAID_NOT_INFORMED,
              new Date(),
              body.endToEnd,
            );
            break;
          case StatusEnum.INFRACTION:
            transaction.infraction(body.endToEnd);
            break;
          default:
            throw new Error('Unknown event');
        }
        break;
      default:
        throw new Error('Unknown payment method');
    }

    return [transaction];
  }
}
