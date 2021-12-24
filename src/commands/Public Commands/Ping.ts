import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
  public constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'Public Commands',
      description: {
        content: 'Check the latency of the ping to the Discord API',
        usage: 'ping',
        examples: ['ping'],
      },
      ratelimit: 3,
    });
  }

  public async exec(message: Message): Promise<Message> {
    return message.channel.send({
      embeds: [
        this.client
          .generateEmbed()
          .setTitle('Pong!')
          .setDescription(`Bot responded in ${this.client.ws.ping}ms`),
      ],
    });
  }
}
