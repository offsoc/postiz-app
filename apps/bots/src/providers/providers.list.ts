import { ProvidersInterface } from './providers.interface';
import { DiscordProvider } from '@gitroom/bots/providers/discord.provider';

export const providersList = [
  new DiscordProvider(),
] as ProvidersInterface<any>[];

export type providerListIdentifiers = 'discord';