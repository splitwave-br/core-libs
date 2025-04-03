import { ContextService } from '@libs/context-service';
import { BusinessException } from '@libs/core/domain/exception/business.exception';
import { DomainEvent } from '@libs/events/domain-event';
import { Handler } from '@libs/events/handler.interface';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Injectable()
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly contextService: ContextService,
  ) {}

  public async process(
    event: DomainEvent<object>,
    context: RmqContext,
    handler: Handler,
  ) {
    // TODO: send metric event_received_count
    const channel = context.getChannelRef();
    const pattern = context.getPattern();
    const originalMessage = context.getMessage();
    let retryCount = 0;

    try {
      const headers = originalMessage.properties?.headers || {};
      retryCount = (parseInt(headers['x-retry-count']) || 0) + 1;

      this.logger.log(
        `*** Message received: ${pattern} - ${JSON.stringify(event)}`,
      );

      this.contextService.setTenant(event.tenant);

      await handler.execute(event);
      this.logger.log(`*** Message processed: ${pattern}`);
      channel.ack(originalMessage);
      this.logger.log(`*** Message acked: ${pattern}`);
      // TODO: send metric event_processed_count
    } catch (e) {
      this.logger.error(e);

      if (retryCount >= 3) {
        await channel.nack(originalMessage, false, false);
        this.logger.warn(
          `*** Message nacked due to max amount of retries: ${pattern} - ${e.message} - retry: ${retryCount}`,
        );
        return;
      }

      if (e instanceof BusinessException) {
        channel.nack(originalMessage, false, false);
        this.logger.warn(
          `*** Message nacked without retry: ${pattern} - ${e.message}`,
        );
        // TODO: send metric event_processed_with_error_count
      } else {
        // TODO: send metric error_on_process_event_count
        await this.queueService.retry(pattern, event, retryCount);
        channel.nack(originalMessage, false, false);
        this.logger.warn(
          `*** Message nacked due to error: ${pattern} - ${e.message}`,
        );
      }
    }
  }
}
