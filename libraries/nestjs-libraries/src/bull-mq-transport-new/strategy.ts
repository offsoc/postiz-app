import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Queue, Worker } from 'bullmq';
import { ioRedis } from '@gitroom/nestjs-libraries/redis/redis.service';
import { ProvidersInterface } from '@gitroom/bots/providers/providers.interface';

export class BullMqServer extends Server implements CustomTransportStrategy {
  queues: Map<string, Queue>;
  workers: Worker[] = [];

  /**
   * This method is triggered when you run "app.listen()".
   */
  listen(callback: () => void, providers: ProvidersInterface<any>[] = []) {
    this.queues = [...this.messageHandlers.keys()].reduce((all, pattern) => {
      all.set(pattern, new Queue(pattern, { connection: ioRedis }));
      return all;
    }, new Map());

    this.workers = Array.from(this.messageHandlers).map(
      ([pattern, handler]) => {
        return new Worker(
          pattern,
          async (job) => {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise<any>(async (resolve, reject) => {
              const provider = providers.length
                ? {
                    provider: providers.find(
                      (p) => p.identifier === job.data.payload.provider
                    ),
                  }
                : {};

              // @ts-ignore
              const stream$ = this.transformToObservable(
                await handler({ ...job.data.payload, ...provider }, job)
              );

              this.send(stream$, (packet) => {
                if (packet.err) {
                  reject(packet.err);
                  return job.discard();
                }

                resolve(packet.response);
                return true;
              });
            });
          },
          {
            connection: ioRedis,
            removeOnComplete: {
              count: 0,
            },
            removeOnFail: {
              count: 0,
            },
          }
        );
      }
    );

    callback();
  }

  /**
   * This method is triggered on application shutdown.
   */
  close() {
    this.workers.map((worker) => worker.close());
    this.queues.forEach((queue) => queue.close());
    return true;
  }
}
