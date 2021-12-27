import { ColorResolvable } from 'discord.js';

export default interface BotOptions {
  token?: string;
  statusUrl?: string;
  embedColor?: ColorResolvable;
  defaultPrefix?: string;
  owners?: string | string[];
  chunkSize?: number;
  baseUrl?: string;
  guildId?: string;
  paginationTimeout?: number;
}
