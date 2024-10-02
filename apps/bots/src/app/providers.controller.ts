import { Controller } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { ProvidersInterface } from '@gitroom/bots/providers/providers.interface';

@Controller()
export class ProvidersController {
  constructor(private _postsService: PostsService) {}
  @EventPattern('provider', Transport.REDIS)
  async post(data: {
    provider: ProvidersInterface<any>;
    serverId?: string;
    channelId: string;
    message: string[];
    attachments: string[];
  }) {
    return data.provider.message(data);
  }
}
