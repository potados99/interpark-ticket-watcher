import Worker from './Worker';
import Config from '../Config';
import {sleep} from '../common/utils';
import Notifier from './Notifier';
import Accessor from './Accessor';
import Repository from './Repository';
import Catcher from './Catcher';

export default class Runner {
  async run() {
    Config.parseCommandLineArguments();

    console.log(Config.current);
    console.log('시작');

    const accessor = new Accessor(Config.current);
    const repo = new Repository(accessor);

    const catcher = new Catcher(Config.current, accessor);
    const notifier = new Notifier(Config.current);

    const worker = new Worker(repo, catcher, notifier);

    while (true) {
      await worker.tick();

      await sleep(Config.current.pollIntervalMillis);
    }
  }
}
