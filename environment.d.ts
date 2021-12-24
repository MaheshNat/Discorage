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
      port: number;
      baseUrl: string;
      guildId: string;
    }
  }
}

export {};
