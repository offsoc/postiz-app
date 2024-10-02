import {NestFactory} from '@nestjs/core';

import {MicroserviceOptions} from '@nestjs/microservices';
import { BotsStrategy } from './strategy';
import { AppModule } from '@gitroom/bots/app/app.module';

async function bootstrap() {
    // some comment again
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        strategy: new BotsStrategy(
          process.env.LOAD_BOTS
        )
    });

    await app.listen();
}

bootstrap();