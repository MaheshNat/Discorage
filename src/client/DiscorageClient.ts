import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  MongooseProvider,
} from 'discord-akairo';
import { Message } from 'discord.js';
import { join } from 'path';
import mongoose from 'mongoose';
import Guild from '../dbModels/Guild';
import { MessageEmbed } from 'discord.js';
import consola from 'consola';
import BotOptions from '../models/BotOptions';
import '../typings/types';

export default class DiscorageClient extends AkairoClient {
  public constructor(public readonly config: BotOptions) {
    super({
      ownerID: config.owners,
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    });

    if (!this.config.chunkSize) this.config.chunkSize = 8_000_000;

    this.settings = new MongooseProvider(Guild);

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: (message) =>
        message.guild
          ? this.settings.get(
              message.guild.id,
              'prefix',
              this.config.defaultPrefix
            )
          : this.config.defaultPrefix,
      allowMention: true,
      handleEdits: true,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      defaultCooldown: 6e4,
      argumentDefaults: {
        prompt: {
          modifyStart: (_: Message, str: string): string =>
            `${str}\n\nType \`cancel\` to cancel the command...`,
          modifyRetry: (_: Message, str: string): string =>
            `${str}\n\nType \`cancel\` to cancel the command...`,
          timeout: 'You took too long, the command has now been cancelled...',
          ended:
            'You exceeded the maximum amount of tries, this command has now been cancelled...',
          retries: 3,
          time: 3e4,
        },
        otherwise: '',
      },
      ignorePermissions: this.config.owners,
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'listeners'),
    });
  }

  private async _init() {
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });

    this.commandHandler.loadAll();
    consola.success('loaded commands');
    this.listenerHandler.loadAll();
    consola.success('loaded listeners');

    try {
      await mongoose.connect(process.env.mongoUri, {});
    } catch (err) {
      consola.error('failed to connect to database');
      consola.error(new Error(err));
    }
    consola.success('connected to database');
  }

  public async start(): Promise<string> {
    await this._init();
    await this.settings.init();
    return this.login(this.config.token);
  }

  public generateEmbed(): MessageEmbed {
    return new MessageEmbed().setColor(this.config.embedColor);
  }
}
