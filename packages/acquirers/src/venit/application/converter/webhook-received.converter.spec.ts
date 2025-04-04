import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { VenitWebhookReceivedConverter } from './webhook-received.converter';
import { TypeEnum } from '../dto/type-enum';
import { OperationTypeEnum } from '../dto/operation-type-enum';
import { WebhookInfractionBodyDTO } from '../dto/webhook-infraction-body.dto';
import { EventEnum } from '../dto/event-enum';

describe('VenitWebhookReceivedConverter', () => {
  let converter: VenitWebhookReceivedConverter;

  beforeEach(() => {
    converter = new VenitWebhookReceivedConverter();
  });

  const scenarios = [
    {
      description: 'Deve converter um payload válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          idempotencyKey: 'E10573421302502020526XIQkEcfBTHC',
          transactionId: 'tx123',
          endToEndId: 'E80573421302502020526XIQkEcfBTHC',
          key: 'ca22b145-ac51-4010-91b8-1c712431f804',
          initiationType: TypeEnum.QR_CODE_STATIC,
          operationType: OperationTypeEnum.RECEIPT,
          amount: 1,
          createdAt: '2025-02-02T05:26:26.522Z',
          description: '52.437.243NIL',
          payer: {
            number: '34345374586',
            branch: '0001',
            type: 'CURRENT',
            participant: {
              name: 'MERCADO PAGO IP LTDA.',
              ispb: '10573521',
            },
            holder: {
              name: '52.437.243 NILSON SIEROTA',
              document: '52437243000195',
              type: 'LEGAL',
            },
          },
          beneficiary: {
            number: '113822711',
            branch: '0001',
            type: 'PAYMENT',
            participant: {
              name: 'BMB PAGAMENTOS',
              ispb: '13372874',
            },
            holder: {
              document: '46908518000129',
              type: 'LEGAL',
            },
          },
        };

        const transaction = converter.execute('tenant1', body);
        expect(transaction[0]).toBeInstanceOf(TransactionEntity);
        expect(transaction[0].getAcquirer()).toBe(AcquirerEnum.VENIT);
        expect(transaction[0].getId()).toBe('tx123');
      },
    },
    {
      description:
        'Deve converter um payload válido de infraction para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookInfractionBodyDTO = {
          event: EventEnum.PRECAUTIONARY_BLOCK,
          data: {
            accountId: '22659291-e051-4047-a37c-cd693cbd9cfa',
            endToEndId: 'E10573421302502020526XIQkEcfBTHC',
            amount: '25.00',
          },
        };

        const transaction = converter.execute('tenant1', body);
        expect(transaction[0]).toBeInstanceOf(TransactionEntity);
        expect(transaction[0].getAcquirer()).toBe(AcquirerEnum.VENIT);
        expect(transaction[0].getId()).toBe('E10573421302502020526XIQkEcfBTHC');
      },
    },
    {
      description: 'Deve lançar erro quando txId for undefined',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          idempotencyKey: 'E10573421302502020526XIQkEcfBTHC',
          transactionId: undefined,
          endToEndId: 'E80573421302502020526XIQkEcfBTHC',
          key: 'ca22b145-ac51-4010-91b8-1c712431f804',
          initiationType: TypeEnum.QR_CODE_STATIC,
          operationType: OperationTypeEnum.RECEIPT,
          amount: 1,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro quando txId não está presente',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          idempotencyKey: 'E10573421302502020526XIQkEcfBTHC',
          endToEndId: 'E80573421302502020526XIQkEcfBTHC',
          key: 'ca22b145-ac51-4010-91b8-1c712431f804',
          initiationType: TypeEnum.QR_CODE_STATIC,
          operationType: OperationTypeEnum.RECEIPT,
          amount: 1,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro quando endToEndId for undefined',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          idempotencyKey: 'E10573421302502020526XIQkEcfBTHC',
          transactionId: '700688e0e04a1ee1506b0ddbb85b1f48',
          endToEndId: undefined,
          key: 'ca22b145-ac51-4010-91b8-1c712431f804',
          initiationType: TypeEnum.QR_CODE_STATIC,
          operationType: OperationTypeEnum.RECEIPT,
          amount: 1,
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
          idempotencyKey: 'E10573421302502020526XIQkEcfBTHC',
          transactionId: '700688e0e04a1ee1506b0ddbb85b1f48',
          key: 'ca22b145-ac51-4010-91b8-1c712431f804',
          initiationType: TypeEnum.QR_CODE_STATIC,
          operationType: OperationTypeEnum.RECEIPT,
          amount: 1,
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
          idempotencyKey: 'E10573421302502020526XIQkEcfBTHC',
          transactionId: '700688e0e04a1ee1506b0ddbb85b1f48',
          endToEndId: 'E80573421302502020526XIQkEcfBTHC',
          key: 'ca22b145-ac51-4010-91b8-1c712431f804',
          initiationType: TypeEnum.QR_CODE_STATIC,
          operationType: 'UNKNOWN' as OperationTypeEnum,
          amount: 1,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Unknown type',
        );
      },
    },
    //INFRACTION
    {
      description: 'Deve lançar erro quando endToEndId está undefined',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookInfractionBodyDTO = {
          event: EventEnum.PRECAUTIONARY_BLOCK,
          data: {
            accountId: '22659291-e051-4047-a37c-cd693cbd9cfa',
            endToEndId: undefined,
            amount: '25.00',
          },
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
        const body: WebhookInfractionBodyDTO = {
          event: EventEnum.PRECAUTIONARY_BLOCK,
          data: {
            accountId: '22659291-e051-4047-a37c-cd693cbd9cfa',
            amount: '25.00',
          },
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro para event não implementado',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookInfractionBodyDTO = {
          event: 'UNKNOWN' as EventEnum,
          data: {
            accountId: '22659291-e051-4047-a37c-cd693cbd9cfa',
            endToEndId: 'E10573421302502020526XIQkEcfBTHC',
            amount: '25.00',
          },
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Unknown event',
        );
      },
    },
    {
      description: 'Deve lançar erro quando data não for undefined',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookInfractionBodyDTO = {
          event: 'UNKNOWN' as EventEnum,
          data: undefined,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'data not found in body',
        );
      },
    },
    {
      description: 'Deve lançar erro quando data não for informado',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookInfractionBodyDTO = {
          event: 'UNKNOWN' as EventEnum,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'data not found in body',
        );
      },
    },
  ];

  test.each(scenarios)('$description', async ({ setup, testFn }) => {
    await setup();
    await testFn();
  });
});
