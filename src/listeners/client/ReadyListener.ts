import consola from 'consola';
import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  public constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client',
    });
  }

  public exec(): void {
    consola.ready(`${this.client.user.tag} online.`);
  }
}
