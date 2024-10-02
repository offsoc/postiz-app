import { providersList } from './providers/providers.list';
import { ProvidersInterface } from './providers/providers.interface';
import { BullMqServer } from '@gitroom/nestjs-libraries/bull-mq-transport-new/strategy';

export class BotsStrategy extends BullMqServer {
  bots: ProvidersInterface<any>[];
  constructor(bots: string) {
    super();
    this.bots = bots
      ?.split(',')
      ?.filter((f) => f)
      ?.map((f) => providersList.find((p) => p.identifier === f))
      ?.filter((f) => f) || [];

    if (this.bots.length === 0) {
      throw `You have to provide the bots you want to run in the \`LOAD_BOTS\` variables, must be any of ${providersList
        .map((p) => p.identifier)
        .join(',')} you can select multiple using a comma`;
    }
  }
  override async listen(callback: () => void) {
    for (const bot of this.bots) {
      bot.client = await bot.init();
    }

    return super.listen(callback, this.bots);
  }

  close() {
    for (const bot of this.bots) {
      bot.close();
    }
    return super.close();
  }
}
