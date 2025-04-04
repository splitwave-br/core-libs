import { IPayloadConverter } from '@consumer/application/handler/converter/payload-converter.interface';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';

export class IuguV2WebhookReceivedConverter
  implements IPayloadConverter<WebhookBodyDTO>
{
  execute(tenant: string, body: WebhookBodyDTO): TransactionEntity[] {
    if (!body.pix) {
      throw new BusinessException(`pix not found in body`);
    }

    const transactions: TransactionEntity[] = [];
    body.pix.forEach((pix) => {
      if (!pix.txid) {
        throw new BusinessException(`txid not found in body`);
      }

      if (!pix.endToEndId) {
        throw new BusinessException(`endToEndId not found in body`);
      }

      const transaction = TransactionEntity.create(
        pix.txid,
        tenant,
        AcquirerEnum.IUGUV2,
      );

      transaction.pay(parseFloat(pix.valor), new Date(), pix.endToEndId);

      transactions.push(transaction);
    });

    return transactions;
  }
}
