import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { AcquirerEnum } from '@libs/core/domain/entity/enum/acquirer.enum';
import { TransactionEntity } from '@libs/core/domain/entity/transaction.entity';
import { WebhookBodyDTO } from '../dto/webhook-body.dto';
import { StatusEnum } from '../dto/status-enum';
import { CashtimeWebhookReceivedConverter } from './webhook-received.converter';
import { PaymentMethodEnum } from '../dto/payment-method-enum';

describe('CashtimeWebhookReceivedConverter', () => {
  let converter: CashtimeWebhookReceivedConverter;

  beforeEach(() => {
    converter = new CashtimeWebhookReceivedConverter();
  });

  const scenarios = [
    {
      description: 'Deve converter um payload válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          code: 'tx123',
          externalCode: '4ee6e96b-0ef9-4701-b820-d4cd81c5dc0d',
          orderId: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          storeId: 'b79d4246-6759-45a3-a861-b5ee0e23c0da',
          paymentMethod: PaymentMethodEnum.PIX,
          status: StatusEnum.PAID,
          endToEnd: 'E60701190202502141754DY5WXXKL21B',
          amount: 10.0,
        };

        const transactions = converter.execute('tenant1', body);
        expect(transactions).toHaveLength(1);
        expect(transactions[0]).toBeInstanceOf(TransactionEntity);
        expect(transactions[0].getAcquirer()).toBe(AcquirerEnum.CASHTIME);
        expect(transactions[0].getId()).toBe('tx123');
      },
    },
    {
      description:
        'Deve converter um payload infraction válido para TransactionEntity',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          code: 'tx123',
          externalCode: '4ee6e96b-0ef9-4701-b820-d4cd81c5dc0d',
          orderId: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          storeId: 'b79d4246-6759-45a3-a861-b5ee0e23c0da',
          paymentMethod: PaymentMethodEnum.PIX,
          status: StatusEnum.INFRACTION,
          endToEnd: 'E60701190202502141754DY5WXXKL21B',
          amount: 10.0,
        };

        const transactions = converter.execute('tenant1', body);
        expect(transactions).toHaveLength(1);
        expect(transactions[0]).toBeInstanceOf(TransactionEntity);
        expect(transactions[0].getAcquirer()).toBe(AcquirerEnum.CASHTIME);
        expect(transactions[0].getId()).toBe('tx123');
      },
    },
    {
      description: 'Deve lançar erro quando txId não está presente',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          code: undefined,
          externalCode: '4ee6e96b-0ef9-4701-b820-d4cd81c5dc0d',
          orderId: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          storeId: 'b79d4246-6759-45a3-a861-b5ee0e23c0da',
          paymentMethod: PaymentMethodEnum.PIX,
          status: StatusEnum.PAID,
          endToEnd: 'E60701190202502141754DY5WXXKL21B',
          amount: 10.0,
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
          code: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          externalCode: '4ee6e96b-0ef9-4701-b820-d4cd81c5dc0d',
          orderId: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          storeId: 'b79d4246-6759-45a3-a861-b5ee0e23c0da',
          paymentMethod: PaymentMethodEnum.PIX,
          status: StatusEnum.PAID,
          endToEnd: undefined,
          amount: 10.0,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          BusinessException,
        );
      },
    },
    {
      description: 'Deve lançar erro para status desconhecido',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          code: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          externalCode: '4ee6e96b-0ef9-4701-b820-d4cd81c5dc0d',
          orderId: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          storeId: 'b79d4246-6759-45a3-a861-b5ee0e23c0da',
          paymentMethod: PaymentMethodEnum.PIX,
          status: 'UNKNOWN' as StatusEnum,
          endToEnd: 'E60701190202502141754DY5WXXKL21B',
          amount: 10.0,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Unknown event',
        );
      },
    },
    {
      description: 'Deve lançar erro para metodod de pagamento desconhecido',
      setup: async () => {},
      testFn: async () => {
        const body: WebhookBodyDTO = {
          code: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          externalCode: '4ee6e96b-0ef9-4701-b820-d4cd81c5dc0d',
          orderId: 'd61aa0d6-0835-4211-a2f7-4aa2b3d8f0e8',
          storeId: 'b79d4246-6759-45a3-a861-b5ee0e23c0da',
          paymentMethod: 'UNKNOWN' as PaymentMethodEnum,
          status: StatusEnum.PAID,
          endToEnd: 'E60701190202502141754DY5WXXKL21B',
          amount: 10.0,
        } as any;

        expect(() => converter.execute('tenant1', body)).toThrow(
          'Unknown payment method',
        );
      },
    },
  ];

  test.each(scenarios)('$description', async ({ setup, testFn }) => {
    await setup();
    await testFn();
  });
});
