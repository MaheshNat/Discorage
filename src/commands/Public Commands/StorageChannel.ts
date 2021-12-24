import { Command } from 'discord-akairo';
import { Channel, Message } from 'discord.js';

interface StorageCommandArguments {
  channel: Channel;
}

export default class StorageCommand extends Command {
  public constructor() {
    super('channel', {
      aliases: ['channel'],
      category: 'Public Commands',
      description: {
        content: 'Set a new channel to store files.',
        usage: 'channel `#new channel`',
        examples: ['channel #storage'],
      },
      ratelimit: 3,
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          id: 'channel',
          type: 'channel',
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, please provide a valid channel.`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    args: StorageCommandArguments
  ): Promise<Message> {
    const oldChannelId = this.client.settings.get(
      message.guild.id,
      'storageChannelId',
      message.channel.id
    );

    await this.client.settings.set(
      message.guild.id,
      'storageChannelId',
      args.channel.id
    );

    return message.util.send(
      `Storage channel changed from <#${oldChannelId}> to <#${args.channel.id}>`
    );
  }
}
