import { Module } from '@nestjs/common';

import { StarsController } from './stars.controller';
import { DatabaseModule } from '@gitroom/nestjs-libraries/database/prisma/database.module';
import { TrendingService } from '@gitroom/nestjs-libraries/services/trending.service';
import { PostsController } from '@gitroom/workers/app/posts.controller';
import { BullMqModule } from '@gitroom/nestjs-libraries/bull-mq-transport-new/bull.mq.module';
import { ProviderClient } from '@gitroom/bots/provider.client';

@Module({
  imports: [DatabaseModule, BullMqModule],
  controllers: [
    ...(!process.env.IS_GENERAL ? [StarsController] : []),
    PostsController,
  ],
  providers: [TrendingService, ProviderClient],
  exports: [ProviderClient]
})
export class AppModule {}
