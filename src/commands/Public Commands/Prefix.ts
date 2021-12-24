import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

interface PrefixCommandArguments {
  prefix: string;
}

export default class PrefixCommand extends Command {
  public constructor() {
    super('prefix', {
      aliases: ['prefix'],
      category: 'Public Commands',
      description: {
        content: 'Set a new server-wide prefix.',
        usage: 'prefix `new prefix`',
        examples: ['prefix !'],
      },
      ratelimit: 3,
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          id: 'prefix',
          type: 'string',
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, please provide a valid prefix.`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    args: PrefixCommandArguments
  ): Promise<Message> {
    const oldPrefix = this.client.settings.get(
      message.guild.id,
      'prefix',
      this.client.config.defaultPrefix
    );

    await this.client.settings.set(message.guild.id, 'prefix', args.prefix);

    return message.util.send(
      `Prefix changed from ${oldPrefix} to ${args.prefix}`
    );
  }
}
