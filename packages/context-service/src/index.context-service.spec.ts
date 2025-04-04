import * as contextServiceExports from './index';
import { ContextServiceModule } from './context-service.module';
import { ContextService } from './context.service';

describe('ContextService Exports', () => {
  test('Deve exportar ContextServiceModule', () => {
    expect(contextServiceExports).toHaveProperty(
      'ContextServiceModule',
      ContextServiceModule,
    );
  });

  test('Deve exportar ContextService', () => {
    expect(contextServiceExports).toHaveProperty(
      'ContextService',
      ContextService,
    );
  });
});
