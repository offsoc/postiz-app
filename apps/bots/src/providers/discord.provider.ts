import { ProvidersInterface } from '@gitroom/bots/providers/providers.interface';
import { Client, GatewayIntentBits } from 'discord.js';

export class DiscordProvider implements ProvidersInterface<Client> {
  client: Client;
  identifier = 'discord';
  async init(): Promise<any> {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
    });
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });

    await client.login(process.env.DISCORD_BOT_TOKEN_ID);
    return client;
  }
  async close(): Promise<void> {
    console.log('close discord');
  }
  async message(params: {
    serverId?: string;
    channelId: string;
    message: string[];
    attachments: string[];
  }) {
    const [message, list] = params.message;
    const guild = this.client.guilds.cache.get(params.serverId);
    if (!guild) {
      return;
    }

    const channel = guild.channels.cache.get(params.channelId);
    if (!(channel && channel.isTextBased() && !channel.isThread())) {
      return;
    }

    const { id, startThread } = await channel.send({
      content: message,
      files: params.attachments,
    });

    const ids = [];
    ids.push({
      id,
      releaseUrl: `https://discord.com/channels/${guild.id}/${channel.id}/${id}`,
    });
    if (!list.length) {
      return ids;
    }
    console.log('start thread');
    const thread = await startThread({
      name: 'thread',
      autoArchiveDuration: 60,
      reason: 'Needed a separate thread for food',
    });
    console.log('fail');

    for (const message of list) {
      const { id } = await thread.send(message);
      ids.push({
        id,
        releaseUrl: `https://discord.com/channels/${guild.id}/${channel.id}/${thread.id}`,
      });
    }

    return ids;
  }
}
