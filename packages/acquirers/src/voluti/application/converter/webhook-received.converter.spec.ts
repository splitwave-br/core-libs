import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TypeEnum } from '../dto/type-enum';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { VolutiWebhookReceivedConverter } from './webhook-received.converter';
import { WebhookInfractionBodyDTO } from '../dto/webhook-infraction-body.dto';

describe('VolutiWebhookReceivedConverter', () => {
  let converter: VolutiWebhookReceivedConverter;

  beforeEach(() => {
    converter = new VolutiWebhookReceivedConverter();
  });

  const scenarios = [
    {
      description: 'Deve converter um payload válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          data: {
            id: '123',
            txId: 'tx123',
            endToEndId: 'end2end123',
            pixKey: 'randomPixKey',
            status: 'CONFIRMED' as any,
            payment: {
              amount: '100.00',
              currency: 'BRL',
            },
            refunds: [],
            createdAt: new Date().toISOString(),
            errorCode: null,
            ticketData: {},
            webhookType: 'PIX',
            debtorAccount: {
              ispb: '12345678',
              name: 'Debtor Name',
              issuer: '123',
              number: '123456',
              document: '123.456.789-00',
              accountType: 'CACC',
            },
            idempotencyKey: null,
            creditDebitType: 'CREDIT',
            creditorAccount: {
              ispb: '87654321',
              name: 'Creditor Name',
              issuer: '321',
              number: '654321',
              document: '987.654.321-00',
              accountType: 'CACC',
            },
            localInstrument: 'PIX',
            transactionType: 'TRANSFER' as any,
            remittanceInformation: null,
          },
          type: TypeEnum.RECEIVE,
        };

        const transactions = converter.execute('tenant1', body);
        expect(transactions).toHaveLength(1);
        expect(transactions[0]).toBeInstanceOf(TransactionEntity);
        expect(transactions[0].getAcquirer()).toBe(AcquirerEnum.VOLUTI);
        expect(transactions[0].getId()).toBe('tx123');
      },
    },
    {
      description:
        'Deve converter um payload infraction válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookInfractionBodyDTO = {
          data: {
            id: '2bdafea1-0aaa-47aa-be56-0101c1a1321a',
            type: 'REFUND_REQUEST' as any,
            status: 'WAITING_PSP' as any,
            endToEndId: 'E12345678901234567890123456789014',
            reportedBy: 'DEBITED_PARTICIPANT',
            creationDate: '2024-12-05T14:09:05.111+00:00',
            reportDetails:
              '1 - ANALISE REALIZADA E CONCLUIDA COMO FRAUDE/GOLPE/COACAO',
            transactionId: '659434453',
            analysisResult: null,
            analysisDetails: null,
            transactionAmount: {
              amount: 447.3,
              currency: 'BRL',
            },
            lastModificationDate: '2024-12-05T14:09:05.111+00:00',
          },
          type: TypeEnum.INFRACTION,
        };

        const transactions = converter.execute('tenant1', body);
        expect(transactions).toHaveLength(1);
        expect(transactions[0]).toBeInstanceOf(TransactionEntity);
        expect(transactions[0].getAcquirer()).toBe(AcquirerEnum.VOLUTI);
        expect(transactions[0].getId()).toBe(
          'E12345678901234567890123456789014',
        );
      },
    },
    {
      description: 'Deve lançar erro quando txId não está presente',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          data: {
            id: '123',
            txId: undefined,
            endToEndId: 'end2end123',
            payment: { amount: '100.00', currency: 'BRL' },
          },
          type: TypeEnum.RECEIVE,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro quando txId não é informado',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          data: {
            id: '123',
            endToEndId: 'end2end123',
            payment: { amount: '100.00', currency: 'BRL' },
          },
          type: TypeEnum.RECEIVE,
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
          data: {
            id: '123',
            txId: 'tx123',
            endToEndId: undefined,
            payment: { amount: '100.00', currency: 'BRL' },
          },
          type: TypeEnum.RECEIVE,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro para tipo REFUND não implementado',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          data: {
            id: '123',
            txId: 'tx123',
            endToEndId: 'end2end123',
            payment: { amount: '100.00', currency: 'BRL' },
          },
          type: TypeEnum.REFUND,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Refund not implemented',
        );
      },
    },
    {
      description: 'Deve lançar erro para tipo desconhecido',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          data: {
            id: '123',
            txId: 'tx123',
            endToEndId: 'end2end123',
            payment: { amount: '100.00', currency: 'BRL' },
          },
          type: 'UNKNOWN' as TypeEnum,
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
