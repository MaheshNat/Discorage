import { ColorResolvable } from 'discord.js';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      token: string;
      prefix: string;
      embedColor: ColorResolvable;
      environment: 'dev' | 'prod' | 'debug';
      statusUrl: string;
      mongoUri: string;
      owners: string;
      port: string;
      baseUrl: string;
      guildId: string;
      paginationTimeout: string;
    }
  }
}

export {};
