import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import File from '../../dbModels/File';

interface DownloadCommandArguments {
  name: string;
}

export default class DownloadCommand extends Command {
  public constructor() {
    super('download', {
      aliases: ['download'],
      category: 'Manage Files',
      description: {
        content:
          'Downloads a file from discord/assembles its chunks, providing the link to download the given file.',
        usage: 'download `filename`',
        examples: ['download test'],
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
    args: DownloadCommandArguments
  ): Promise<Message> {
    const file = await File.findOne({
      name: args.name,
    });
    if (file == null)
      return message.util.send(`Could not find a file with name ${args.name}`);

    return message.util.send(
      `Visit ${this.client.config.baseUrl}/download/${file._id} to download the file.`
    );
    return;
  }
}
