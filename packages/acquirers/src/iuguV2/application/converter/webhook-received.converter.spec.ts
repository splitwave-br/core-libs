import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { IuguV2WebhookReceivedConverter } from './webhook-received.converter';

describe('IuguV2WebhookReceivedConverter', () => {
  let converter: IuguV2WebhookReceivedConverter;

  beforeEach(() => {
    converter = new IuguV2WebhookReceivedConverter();
  });

  const scenarios = [
    {
      description: 'Deve converter um payload válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          pix: [
            {
              endToEndId: 'E18236120202502222010s102b032f5e',
              txid: 'tx123',
              valor: '5.00',
              chave: '6000ef70-5074-44af-8963-45a4d7ad56b3',
              horario: '2025-02-22T20:10:55.809Z',
            },
          ],
        };
        const transaction = converter.execute('tenant1', body);
        expect(transaction[0]).toBeInstanceOf(TransactionEntity);
        expect(transaction[0].getAcquirer()).toBe(AcquirerEnum.IUGUV2);
        expect(transaction[0].getId()).toBe('tx123');
      },
    },
    {
      description:
        'Deve converter um payload válido para TransactionEntity para 2 possições',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          pix: [
            {
              endToEndId: 'E18236120202502222010s102b032f5e',
              txid: 'tx123',
              valor: '5.00',
              chave: '6000ef70-5074-44af-8963-45a4d7ad56b3',
              horario: '2025-02-22T20:10:55.809Z',
            },
            {
              endToEndId: 'E18236120202502222010s102b032f4e',
              txid: 'tx321',
              valor: '10.00',
              chave: '6000ef70-5074-44af-8963-45a4d7ad56b3',
              horario: '2025-02-22T20:11:55.809Z',
            },
          ],
        };
        const transactions = converter.execute('tenant1', body);

        expect(transactions.length).toBe(2);

        transactions.forEach((transaction) => {
          expect(transaction).toBeInstanceOf(TransactionEntity);
          expect(transaction.getAcquirer()).toBe(AcquirerEnum.IUGUV2);
        });

        expect(transactions[0].getId()).toBe('tx123');
        expect(transactions[1].getId()).toBe('tx321');
      },
    },
    {
      description: 'Deve lançar erro quando pix não está presente',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          endToEndId: 'E18236120202502222010s102b032f5e',
          txid: undefined,
          valor: '5.00',
          chave: '6000ef70-5074-44af-8963-45a4d7ad56b3',
          horario: '2025-02-22T20:10:55.809Z',
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
          pix: [
            {
              endToEndId: 'E18236120202502222010s102b032f5e',
              txid: undefined,
              valor: '5.00',
              chave: '6000ef70-5074-44af-8963-45a4d7ad56b3',
              horario: '2025-02-22T20:10:55.809Z',
            },
          ],
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
          pix: [
            {
              endToEndId: undefined,
              txid: 'ED8F83FFF88E40B7B4B91A81801E491E',
              valor: '5.00',
              chave: '6000ef70-5074-44af-8963-45a4d7ad56b3',
              horario: '2025-02-22T20:10:55.809Z',
            },
          ],
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
  ];

  test.each(scenarios)('$description', async ({ setup, testFn }) => {
    await setup();
    await testFn();
  });
});
