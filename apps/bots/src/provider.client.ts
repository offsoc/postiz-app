import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { Job, Queue, QueueEvents } from 'bullmq';
import { ioRedis } from '@gitroom/nestjs-libraries/redis/redis.service';
import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { providerListIdentifiers } from '@gitroom/bots/providers/providers.list';

@Injectable()
export class ProviderClient extends ClientProxy {
  queues = new Map<string, Queue>();
  queueEvents = new Map<string, QueueEvents>();

  async connect(): Promise<any> {
    return;
  }

  async close() {
    return;
  }

  message(
    provider: providerListIdentifiers,
    params: { serverId?: string; channelId: string; message: string[], attachments: string[] }
  ): Promise<Array<{id: string, releaseUrl: string}>> {
    return this.send('provider', {
      payload: {
        provider,
        ...params,
      },
    }).toPromise();
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void
  ) {
    const queue = this.getQueue('provider');
    const queueEvents = this.getQueueEvents('provider');
    queue
      .add('provider', packet.data, {
        jobId: packet.data.id ?? v4(),
        ...packet.data.options,
        removeOnComplete: false,
        removeOnFail: true,
      })
      .then((job) => {
        job
          .waitUntilFinished(queueEvents)
          .then(() => {
            Job.fromId(queue, job.id).then(({ returnvalue }) => {
              job.remove();
              callback({ response: returnvalue, isDisposed: true });
            });
          })
          .catch((err) => {
            callback({ err, isDisposed: true });
          });
      });

    return () => {/** empty **/};
  }

  getQueueEvents(pattern: string) {
    return (
      this.queueEvents.get(pattern) ||
      new QueueEvents(pattern, {
        connection: ioRedis,
      })
    );
  }

  getQueue(pattern: string) {
    return (
      this.queues.get(pattern) ||
      new Queue(pattern, {
        connection: ioRedis,
      })
    );
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    console.log('event to dispatch: ', packet);
    const queue = this.getQueue('provider');
    await queue.add('provider', packet.data, {
      jobId: v4(),
      ...packet.data.options,
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
}
