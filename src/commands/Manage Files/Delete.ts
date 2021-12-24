import { Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import File from '../../dbModels/File';

interface DeleteCommandArguments {
  name: string;
}

export default class DeleteCommand extends Command {
  public constructor() {
    super('delete', {
      aliases: ['delete'],
      category: 'Manage Files',
      description: {
        content: 'Deletes a file from discord.',
        usage: 'delete `filename`',
        examples: ['delete test'],
      },
      ratelimit: 3,
      args: [
        {
          id: 'name',
          type: 'string',
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, please provide a valid filename.`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    args: DeleteCommandArguments
  ): Promise<Message> {
    const file = await File.findOne({
      name: args.name,
    });
    if (file == null)
      return message.util.send(`Could not find a file with name ${args.name}`);

    const channel = (await this.client.guilds.cache
      .get(this.client.config.guildId)
      .channels.fetch(file.chunks[0].channelId)) as TextChannel;

    for (const chunk of file.chunks) {
      const message = await channel.messages.fetch(chunk.messageId);
      await message.delete();
    }

    file.delete();

    return message.util.send(`Deleted file ${args.name}`);
  }
}
