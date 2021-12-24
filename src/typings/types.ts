import { MessageEmbed, ColorResolvable } from 'discord.js';
import BotOptions from '../models/BotOptions';
import DiscorageClient from '../client/DiscorageClient';

declare module 'discord-akairo' {
  interface AkairoClient {
    config: BotOptions;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    inhibitorHandler: InhibitorHandler;
    settings: MongooseProvider;
    generateEmbed(): MessageEmbed;
  }
}

declare module 'express' {
  interface Request {
    client?: DiscorageClient;
  }
}
