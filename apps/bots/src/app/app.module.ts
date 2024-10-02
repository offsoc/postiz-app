import { Module } from '@nestjs/common';

import {DatabaseModule} from "@gitroom/nestjs-libraries/database/prisma/database.module";
import { BullMqModule } from '@gitroom/nestjs-libraries/bull-mq-transport-new/bull.mq.module';
import { ProvidersController } from '@gitroom/bots/app/providers.controller';

@Module({
  imports: [DatabaseModule, BullMqModule],
  controllers: [ProvidersController],
  providers: [],
})
export class AppModule {}
