import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import File from '../../dbModels/File';

interface RenameCommandArguments {
  oldName: string;
  newName: string;
}

export default class RenameCommand extends Command {
  public constructor() {
    super('rename', {
      aliases: ['rename'],
      category: 'Manage Files',
      description: {
        content: 'Renames a file from discord.',
        usage: 'rename `old filename` `new filename`',
        examples: ['rename test.png test2.png'],
      },
      ratelimit: 3,
      args: [
        {
          id: 'oldName',
          type: 'string',
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, please provide a old valid filename.`,
          },
        },
        {
          id: 'newName',
          type: 'string',
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, please provide a new valid filename.`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    args: RenameCommandArguments
  ): Promise<Message> {
    const file = await File.findOne({
      name: args.oldName,
    });
    if (file == null)
      return message.util.send(
        `Could not find a file with name ${args.oldName}`
      );

    file.name = args.newName;
    await file.save();

    return message.util.send(`Renamed file ${args.oldName} to ${args.newName}`);
  }
}
