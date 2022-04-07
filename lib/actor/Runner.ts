import Worker from './Worker';
import Config from '../Config';
import {sleep} from '../common/utils';
import Notifier from './Notifier';
import Accessor from './Accessor';
import Repository from './Repository';

export default class Runner {
  async run() {
    Config.parseCommandLineArguments();

    console.log(Config.current);
    console.log('시작');

    const accessor = new Accessor(Config.current);
    const repo = new Repository(accessor);

    const notifier = new Notifier(Config.current);
    const worker = new Worker(repo, notifier);

    while (true) {
      await worker.tick();

      await sleep(Config.current.pollIntervalMillis);
    }
  }
}
