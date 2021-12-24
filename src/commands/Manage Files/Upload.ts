import { Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import File from '../../dbModels/File';
import path from 'path';
import fs from 'fs';
import Chunk from '../../models/Chunk';
import { saveFile, read } from '../../utils/utils';

interface UploadCommandArguments {
  name: string;
}

export default class UploadCommand extends Command {
  public constructor() {
    super('upload', {
      aliases: ['upload'],
      category: 'Manage Files',
      description: {
        content: 'Uploads a file from discord, chunking it appropriately.',
        usage: 'upload `filename`',
        examples: ['upload test'],
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
    args: UploadCommandArguments
  ): Promise<Message> {
    // handling edge cases
    if (message.attachments.size > 1)
      return message.util.send('Can only upload one file at a time.');
    if (message.attachments.size == 0)
      return message.util.send('Please attach a file to upload.');
    const existingFile = await File.findOne({
      name: args.name,
    });
    if (existingFile !== null)
      return message.util.send(
        `A file with name ${args.name} already exists. Please rename the file.`
      );

    const chunks: Chunk[] = [];
    const storageChannelId = this.client.settings.get(
      message.guild.id,
      'storageChannelId',
      message.channel.id
    );
    const storageChannel = (await this.client.guilds.cache
      .get(message.guild.id)
      .channels.fetch(storageChannelId)) as TextChannel;

    // save attachment to file system
    const attachment = message.attachments.first();
    const fileParts = attachment.name.split('.');
    const name = `${args.name}.${fileParts[fileParts.length - 1]}`;
    const filePath = path.join(__dirname, '..', '..', 'data', attachment.id);
    await saveFile(attachment.url, filePath);

    // chunking and uploading file to discord
    let index = 0;
    for await (const chunk of read(filePath, this.client.config.chunkSize)) {
      const chunkMessage = await storageChannel.send({
        files: [{ name: `${attachment.id}-chunk-${index}`, attachment: chunk }],
      });
      chunks.push({
        url: chunkMessage.attachments.first().url,
        channelId: storageChannelId,
        messageId: chunkMessage.id,
      });
      index += 1;
    }

    // saving file to database
    await File.create({
      name: name,
      size: attachment.size,
      chunks: chunks,
    });

    // deleting temporary file
    fs.unlinkSync(filePath);

    return message.util.send(`Saved file ${name} to <#${storageChannelId}>`);
  }
}
