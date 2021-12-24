import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import { PrefixSupplier } from 'discord-akairo';
import Mustache from 'mustache';

export default class HelpCommand extends Command {
  public constructor() {
    super('help', {
      aliases: ['help', 'commands'],
      category: 'Public Commands',
      description: {
        content: 'View available commands on the bot',
        usage: 'help `command`',
        examples: ['help', 'help ping'],
      },
      ratelimit: 3,
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          default: null,
        },
      ],
    });
  }

  public async exec(message: Message, { command }): Promise<Message> {
    const prefix = await (this.client.commandHandler.prefix as PrefixSupplier)(
      message
    );
    if (command) {
      return message.channel.send({
        embeds: [
          this.client.generateEmbed().setAuthor({
            name: `Help | ${command}`,
            url: this.client.user.avatarURL(),
          }).setDescription(stripIndents`
          **Description:**
          ${command.description.content || 'No content provided.'}

          **Usage:**
          ${
            prefix +
              Mustache.render(command.description.usage, { prefix: prefix }) ||
            'No usage provided'
          }

          **Examples:**
          ${
            command.description.examples
              ? command.description.examples
                  .map(
                    (example) =>
                      `\`${
                        prefix + Mustache.render(example, { prefix: prefix })
                      }\``
                  )
                  .join('\n')
              : 'No examples provided.'
          }
          `),
        ],
      });
    }
    const embed = this.client
      .generateEmbed()
      .setAuthor(
        `Help | ${this.client.user.username}`,
        this.client.user.avatarURL()
      )
      .setFooter(`${prefix}help [command] for more information on a command`);

    for (const category of this.handler.categories.values()) {
      if (['default'].includes(category.id)) continue;
      embed.addField(
        category.id,
        category
          .filter((cmd) => cmd.aliases.length > 0)
          .map((cmd) => `**\`${cmd}\`**`)
          .join(',') || 'No commands in this category.'
      );
    }

    return message.channel.send({ embeds: [embed] });
  }
}
