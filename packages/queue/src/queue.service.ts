import { DomainEvent } from '@libs/events/domain-event';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class QueueService {
  readonly logger = new Logger(QueueService.name);

  constructor(
    @Inject(QueueService.name) private readonly client: ClientProxy,
  ) {}

  public async retry(
    pattern: string,
    event: DomainEvent<object>,
    retryCount: number,
  ): Promise<void> {
    await this.emit(pattern, event, retryCount);
  }

  public async send(event: DomainEvent<object>): Promise<void> {
    await this.emit(event.constructor.name, event, 0);
  }

  public async emit(
    pattern: string,
    event: DomainEvent<object>,
    retryCount: number,
  ): Promise<void> {
    try {
      const record = new RmqRecordBuilder(event)
        .setOptions({
          headers: {
            ['x-version']: '1.0.0',
            ['x-retry-count']: retryCount.toString(),
          },
        })
        .build();

      await lastValueFrom(this.client.emit(pattern, record));
      if (retryCount > 0) {
        this.logger.warn(
          `*** Message retried: ${pattern} - ${retryCount} - ${JSON.stringify(event)}`,
        );
      } else {
        this.logger.log(
          `*** Message sent: ${pattern} - ${JSON.stringify(event)}`,
        );
      }
      // TODO: send metric event_sent_count
    } catch (error) {
      // TODO: send metric error_on_send_event_count
      this.logger.error(
        `Problem with RMQ in ${pattern} error: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException('Error on send message to Queue');
    }
  }
}
