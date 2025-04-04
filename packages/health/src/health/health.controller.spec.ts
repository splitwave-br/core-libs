import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let httpHealthIndicator: HttpHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: { check: jest.fn().mockResolvedValue({ status: 'ok' }) },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest
              .fn()
              .mockResolvedValue({ google: { status: 'up' } }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
  });

  it('Instância de HealthController deve ser definida', () => {
    expect(controller).toBeDefined();
  });

  it('Deve chamar health.check corretamente e retornar status ok', async () => {
    const result = await controller.check();

    expect(healthCheckService.check).toHaveBeenCalledWith([
      expect.any(Function),
    ]);
    expect(result).toEqual({ status: 'ok' });
  });

  it('Deve chamar httpHealthIndicator.pingCheck corretamente', async () => {
    const checkMock = jest.fn().mockImplementation(async (healthIndicators) => {
      return Promise.all(
        healthIndicators.map((indicator: () => any) => indicator()),
      );
    });

    healthCheckService.check = checkMock;

    await controller.check();

    expect(healthCheckService.check).toHaveBeenCalledWith([
      expect.any(Function),
    ]);

    const checkFn = checkMock.mock.calls[0][0][0];
    await checkFn();

    expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith(
      'google',
      'https://google.com',
    );
  });
});
