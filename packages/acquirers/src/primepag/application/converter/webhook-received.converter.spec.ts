import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { PrimepagWebhookReceivedConverter } from './webhook-received.converter';
import { TypeEnum } from '../dto/type-enum';
import { StatusEnum } from '../dto/status-enum';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';

describe('PrimepagWebhookReceivedConverter', () => {
  let converter: PrimepagWebhookReceivedConverter;

  beforeEach(() => {
    converter = new PrimepagWebhookReceivedConverter();
  });

  const scenarios = [
    {
      description: 'Deve converter um payload válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          notification_type: TypeEnum.PIX_QRCODE,
          message: {
            reference_code: 'tx123',
            value_cents: 2,
            content:
              '00020101021126580014br.gov.bcb.pix0136d5091c68-5056-481b-88ad-95eb340a1a2152040000530398654040.025802BR5925Primepag Solucoes em Paga6009SAO PAULO62220518PRIMEPAGPIXQRCODE263044FC9',
            status: StatusEnum.paid,
            generator_name: 'John Doe',
            generator_document: '67178678097',
            payer_name: 'John Doe',
            payer_document: '67178678097',
            registration_date: '2021-11-10T14:51:25.000-03:00',
            payment_date: '2021-11-10T14:52:10.000-03:00',
            end_to_end: 'E18236120202206142202a1022c1tg10',
          },
          md5: '679f3ff14b8eadd1e504f2a35c0d8fb3',
        };

        const transactions = converter.execute('tenant1', body);
        expect(transactions).toHaveLength(1);
        expect(transactions[0]).toBeInstanceOf(TransactionEntity);
        expect(transactions[0].getAcquirer()).toBe(AcquirerEnum.PRIMEPAG);
        expect(transactions[0].getId()).toBe('tx123');
      },
    },
    {
      description: 'Deve lançar erro quando txId não está presente',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          notification_type: TypeEnum.PIX_QRCODE,
          message: { reference_code: undefined, end_to_end: 'end2end123' },
          md5: '679f3ff14b8eadd1e504f2a35c0d8fb3',
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro quando endToEndId não está presente',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          notification_type: TypeEnum.PIX_QRCODE,
          message: { reference_code: 'tx123', end_to_end: undefined },
          md5: '679f3ff14b8eadd1e504f2a35c0d8fb3',
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro para tipo desconhecido',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          message: { reference_code: 'tx123', end_to_end: 'end2end123' },
          md5: '679f3ff14b8eadd1e504f2a35c0d8fb3',
          notification_type: 'UNKNOWN' as TypeEnum,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Unknown type',
        );
      },
    },
  ];

  test.each(scenarios)('$description', async ({ setup, testFn }) => {
    await setup();
    await testFn();
  });
});
