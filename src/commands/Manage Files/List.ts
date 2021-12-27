import { stripIndents } from 'common-tags';
import { Command } from 'discord-akairo';
import { Message, MessageButton } from 'discord.js';
import paginationEmbed from 'discordjs-button-pagination';
import File from '../../dbModels/File';
import { getTimestamp } from '../../utils/utils';
import prettyBytes from 'pretty-bytes';

export default class ListCommand extends Command {
  public constructor() {
    super('list', {
      aliases: ['list'],
      category: 'Manage Files',
      description: {
        content: 'Lists all files stored in discord.',
        usage: 'list `filename`',
        examples: ['list test'],
      },
      ratelimit: 3,
    });
  }

  public async exec(message: Message) {
    const files = await File.find();

    const embeds = files.map((file) =>
      this.client.generateEmbed().setTitle(file.name)
        .setDescription(stripIndents`created on ${getTimestamp(file._id)}.
        size: ${prettyBytes(file.size)}`)
    );

    const previousButton = new MessageButton()
      .setCustomId('previousButton')
      .setLabel('Previous')
      .setStyle('DANGER');

    const nextButton = new MessageButton()
      .setCustomId('nextButton')
      .setLabel('Next')
      .setStyle('SUCCESS');

    paginationEmbed(
      message,
      embeds,
      [previousButton, nextButton],
      this.client.config.paginationTimeout
    );
  }
}
