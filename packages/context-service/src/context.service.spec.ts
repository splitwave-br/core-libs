import { ContextService } from './context.service';
import { Request } from 'express';

describe('ContextService', () => {
  let contextService: ContextService;
  let requestMock: jest.Mocked<Request>;

  beforeEach(() => {
    requestMock = {
      headers: {},
    } as unknown as jest.Mocked<Request>;

    contextService = new ContextService(requestMock);
  });

  const scenarios = [
    {
      description: 'Deve definir e recuperar um tenant corretamente',
      setup: () => contextService.setTenant('tenant1'),
      expectFn: () => expect(contextService.getTenant()).toBe('tenant1'),
    },
    {
      description: 'Deve retornar undefined quando não houver tenant definido',
      setup: () => {},
      expectFn: () => expect(contextService.getTenant()).toBeUndefined(),
    },
    {
      description: 'Deve recuperar tenant do header se não estiver na store',
      setup: () => (requestMock.headers['tenant'] = 'tenantFromHeader'),
      expectFn: () =>
        expect(contextService.getTenant()).toBe('tenantFromHeader'),
    },
    {
      description: 'Deve definir e recuperar valores corretamente',
      setup: () => contextService.set('key1', 'value1'),
      expectFn: () => expect(contextService.get('key1')).toBe('value1'),
    },
    {
      description: 'Deve lançar erro ao definir um valor com chave vazia',
      setup: () => {},
      expectFn: () =>
        expect(() => contextService.set('', 'value')).toThrow(
          'Key cannot be empty',
        ),
    },
    {
      description: 'Deve verificar se uma chave existe na store',
      setup: () => contextService.set('key2', 'value2'),
      expectFn: () => {
        expect(contextService.has('key2')).toBe(true);
        expect(contextService.has('key3')).toBe(false);
      },
    },
    {
      description: 'Deve excluir uma chave da store',
      setup: () => contextService.set('key4', 'value4'),
      expectFn: () => {
        expect(contextService.delete('key4')).toBe(true);
        expect(contextService.has('key4')).toBe(false);
      },
    },
    {
      description: 'Deve retornar o nome do schema corretamente',
      setup: () => contextService.setTenant('tenant.example'),
      expectFn: () =>
        expect(contextService.getSchemaName()).toBe('tenant_example'),
    },
    {
      description:
        'Deve retornar o schema public se nenhum tenant for definido',
      setup: () => {},
      expectFn: () => expect(contextService.getSchemaName()).toBe('public'),
    },
    {
      description:
        'Deve reutilizar valor existente ao definir uma chave já existente',
      setup: () => contextService.set('existingKey', 'initialValue'),
      expectFn: () =>
        expect(contextService.set('existingKey', 'newValue')).toBe(
          'initialValue',
        ),
    },
    {
      description:
        'Deve retornar undefined ao tentar obter uma chave inexistente',
      setup: () => {},
      expectFn: () =>
        expect(contextService.get('nonExistingKey')).toBeUndefined(),
    },
    {
      description: 'Deve lançar erro ao verificar existência de chave vazia',
      setup: () => {},
      expectFn: () =>
        expect(() => contextService.has('')).toThrow('Key cannot be empty'),
    },
    {
      description: 'Deve lançar erro ao deletar chave vazia',
      setup: () => {},
      expectFn: () =>
        expect(() => contextService.delete('')).toThrow('Key cannot be empty'),
    },
    {
      description:
        'Deve retornar false ao tentar deletar uma chave inexistente',
      setup: () => {},
      expectFn: () =>
        expect(contextService.delete('nonExistingKey')).toBe(false),
    },
    {
      description: 'Deve lançar erro ao tentar obter uma chave vazia',
      setup: () => {},
      expectFn: () =>
        expect(() => contextService.get('')).toThrow('Key cannot be empty'),
    },
  ];

  test.each(scenarios)('$description', ({ setup, expectFn }) => {
    setup();
    expectFn();
  });
});
