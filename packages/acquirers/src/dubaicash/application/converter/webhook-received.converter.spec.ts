import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { StatusEnum } from '../dto/status-enum';
import { DubaicashWebhookReceivedConverter } from './webhook-received.converter';
import { EventEnum } from '../dto/event-enum';

describe('DubaicashWebhookReceivedConverter', () => {
  let converter: DubaicashWebhookReceivedConverter;

  beforeEach(() => {
    converter = new DubaicashWebhookReceivedConverter();
  });

  const scenarios = [
    {
      description: 'Deve converter um payload válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          uuid: '285c6b0e-fe58-4663-898a-fdd75778324f',
          bankData: {
            documentNumber: '37935870888',
            endtoendId: 'end2end123',
            key: null,
            name: 'EMERSON RODRIGUES DE FREITAS',
            ispb: '60701190',
            account: '0000',
          },
          transaction: {
            transactionId: '1739555661982',
            uuid: 'f5518585-6b74-44df-b50e-6b8510fffa80',
            externalId: 'tx123',
            amount: 2,
            subType: 'PIX',
            type: 'CREDIT',
            ispb: '30385259',
            account: '0000',
          },
          status: StatusEnum.COMPLETED,
          event: EventEnum.PIX_PAY_IN,
        };

        const transactions = converter.execute('tenant1', body);
        expect(transactions).toHaveLength(1);
        expect(transactions[0]).toBeInstanceOf(TransactionEntity);
        expect(transactions[0].getAcquirer()).toBe(AcquirerEnum.DUBAICASH);
        expect(transactions[0].getId()).toBe('tx123');
      },
    },
    {
      description: 'Deve lançar erro quando txId não está presente',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          uuid: '285c6b0e-fe58-4663-898a-fdd75778324f',
          bankData: {
            documentNumber: '37935870888',
            endtoendId: 'end2end123',
            key: null,
            name: 'EMERSON RODRIGUES DE FREITAS',
            ispb: '60701190',
            account: '0000',
          },
          transaction: {
            transactionId: '1739555661982',
            uuid: 'f5518585-6b74-44df-b50e-6b8510fffa80',
            externalId: undefined,
            amount: 2,
            subType: 'PIX',
            type: 'CREDIT',
            ispb: '30385259',
            account: '0000',
          },
          status: StatusEnum.COMPLETED,
          event: EventEnum.PIX_PAY_IN,
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
          uuid: '285c6b0e-fe58-4663-898a-fdd75778324f',
          bankData: {
            documentNumber: '37935870888',
            endtoendId: undefined,
            key: null,
            name: 'EMERSON RODRIGUES DE FREITAS',
            ispb: '60701190',
            account: '0000',
          },
          transaction: {
            transactionId: '1739555661982',
            uuid: 'f5518585-6b74-44df-b50e-6b8510fffa80',
            externalId: 'tx123',
            amount: 2,
            subType: 'PIX',
            type: 'CREDIT',
            ispb: '30385259',
            account: '0000',
          },
          status: StatusEnum.COMPLETED,
          event: EventEnum.PIX_PAY_IN,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro para evento desconhecido',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          uuid: '285c6b0e-fe58-4663-898a-fdd75778324f',
          bankData: {
            documentNumber: '37935870888',
            endtoendId: 'endToEnd123',
            key: null,
            name: 'EMERSON RODRIGUES DE FREITAS',
            ispb: '60701190',
            account: '0000',
          },
          transaction: {
            transactionId: '1739555661982',
            uuid: 'f5518585-6b74-44df-b50e-6b8510fffa80',
            externalId: 'tx123',
            amount: 2,
            subType: 'PIX',
            type: 'CREDIT',
            ispb: '30385259',
            account: '0000',
          },
          status: StatusEnum.COMPLETED,
          event: 'UNKNOWN' as EventEnum,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Unknown event',
        );
      },
    },
    {
      description: 'Deve lançar erro para status desconhecido',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          uuid: '285c6b0e-fe58-4663-898a-fdd75778324f',
          bankData: {
            documentNumber: '37935870888',
            endtoendId: 'endToEnd123',
            key: null,
            name: 'EMERSON RODRIGUES DE FREITAS',
            ispb: '60701190',
            account: '0000',
          },
          transaction: {
            transactionId: '1739555661982',
            uuid: 'f5518585-6b74-44df-b50e-6b8510fffa80',
            externalId: 'tx123',
            amount: 2,
            subType: 'PIX',
            type: 'CREDIT',
            ispb: '30385259',
            account: '0000',
          },
          status: 'UNKNOWN' as StatusEnum,
          event: EventEnum.PIX_PAY_IN,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Unknown status',
        );
      },
    },
  ];

  test.each(scenarios)('$description', async ({ setup, testFn }) => {
    await setup();
    await testFn();
  });
});
