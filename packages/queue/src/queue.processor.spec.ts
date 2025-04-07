import { ContextService } from '@splitwave-br/context-service';
import { BusinessException } from '@splitwave-br/core/';
import { DomainEvent } from './domain-event';
import { InternalServerErrorException } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';

describe('QueueProcessorTest', () => {
  let processor: QueueProcessor;
  let service: QueueService;
  let context: ContextService;
  let mockContext: RmqContext;

  const event = {
    tenant: 'test-tenant',
  } as DomainEvent<object>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        QueueProcessor,
        {
          provide: QueueService,
          useValue: { retry: jest.fn() },
        },
        {
          provide: ContextService,
          useValue: { setTenant: jest.fn() },
        },
      ],
    }).compile();

    processor = module.get<QueueProcessor>(QueueProcessor);
    service = module.get<QueueService>(QueueService);
    context = module.get<ContextService>(ContextService);

    mockContext = {
      getChannelRef: jest.fn().mockReturnValue({
        ack: jest.fn().mockImplementation(() => void 0),
        nack: jest.fn().mockImplementation(() => void 0),
      }),
      getPattern: jest.fn().mockReturnValue('TestPattern'),
      getMessage: jest.fn().mockReturnValue({}),
    } as unknown as RmqContext;

    jest.spyOn(service, 'retry').mockImplementation(() => void 0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    {},
    { properties: {} },
    { properties: { headers: {} } },
    { properties: { headers: { 'x-retry-count': 0 } } },
    { properties: { headers: { 'x-retry-count': 1 } } },
    { properties: { headers: { 'x-retry-count': 2 } } },
  ])(
    'should successfully ack message when processed without errors',
    async (message: any) => {
      // given
      const channelRef = mockContext.getChannelRef();
      const handler = { execute: jest.fn() };

      jest.spyOn(mockContext, 'getMessage').mockReturnValue(message);
      jest.spyOn(channelRef, 'ack').mockImplementation(() => void 0);

      // when
      await processor.process(event, mockContext, handler);

      // then
      expect(context.setTenant).toHaveBeenCalledWith(event.tenant);
      expect(handler.execute).toHaveBeenCalledWith(event);
      expect(channelRef.ack).toHaveBeenCalled();
    },
  );

  const scenarios = [
    {
      description:
        'should nack message when fail to process due to business error',
      retryCount: 0,
      handler: {
        execute: jest.fn().mockImplementation(() => {
          throw new BusinessException('Error');
        }),
      },
      channelRef: { nack: jest.fn() },
      expectationFn: (params: any) => {
        expect(context.setTenant).toHaveBeenCalledWith(event.tenant);
        expect(params.handler.execute).toHaveBeenCalled();
        expect(mockContext.getChannelRef().nack).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false,
        );
        expect(service.retry).not.toHaveBeenCalled();
      },
    },
    {
      description:
        'should nack and retry message when fail to process due to internal server error',
      retryCount: 0,
      handler: {
        execute: jest.fn().mockImplementation(() => {
          throw new InternalServerErrorException();
        }),
      },
      channelRef: { nack: jest.fn() },
      expectationFn: (params: any) => {
        expect(context.setTenant).toHaveBeenCalledWith(event.tenant);
        expect(params.handler.execute).toHaveBeenCalled();
        expect(mockContext.getChannelRef().nack).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false,
        );
        expect(service.retry).toHaveBeenCalledWith(
          mockContext.getPattern(),
          event,
          1,
        );
      },
    },
    {
      description:
        'should nack and retry message when fail to process due to generic error',
      retryCount: 0,
      handler: {
        execute: jest.fn().mockImplementation(() => {
          throw new Error();
        }),
      },
      channelRef: { nack: jest.fn() },
      expectationFn: (params: any) => {
        expect(context.setTenant).toHaveBeenCalledWith(event.tenant);
        expect(params.handler.execute).toHaveBeenCalled();
        expect(mockContext.getChannelRef().nack).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false,
        );
        expect(service.retry).toHaveBeenCalledWith(
          mockContext.getPattern(),
          event,
          1,
        );
      },
    },
    ...[undefined, null, 0, 1].map((retryCount) => ({
      description: `should nack and retry message and correctly increment retry count to ${1 + (retryCount || 0)}`,
      retryCount,
      handler: {
        execute: jest.fn().mockImplementation(() => {
          throw new InternalServerErrorException();
        }),
      },
      channelRef: { nack: jest.fn() },
      expectationFn: (params: any) => {
        expect(context.setTenant).toHaveBeenCalledWith(event.tenant);
        expect(params.handler.execute).toHaveBeenCalled();
        expect(mockContext.getChannelRef().nack).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false,
        );
        expect(service.retry).toHaveBeenCalledWith(
          mockContext.getPattern(),
          event,
          1 + (retryCount || 0),
        );
      },
    })),
    {
      description: 'should nack and not retry when retry count reach 3',
      retryCount: 2,
      handler: {
        execute: jest.fn().mockImplementation(() => {
          throw new InternalServerErrorException();
        }),
      },
      channelRef: { nack: jest.fn() },
      expectationFn: (params: any) => {
        expect(context.setTenant).toHaveBeenCalledWith(event.tenant);
        expect(params.handler.execute).toHaveBeenCalled();
        expect(mockContext.getChannelRef().nack).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false,
        );
        expect(service.retry).not.toHaveBeenCalled();
      },
    },
  ];

  test.each(scenarios)('$description', async (params: any) => {
    // given
    jest.spyOn(mockContext, 'getMessage').mockReturnValue({
      properties: {
        headers: {
          'x-retry-count': params.retryCount,
        },
      },
    });

    // when
    await processor.process(event, mockContext, params.handler);

    // then
    params.expectationFn(params);
  });
});
