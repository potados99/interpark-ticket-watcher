import {program} from 'commander';
import Fetcher from './Fetcher';
import PerfRepository from './PerfRepository';
import Notifier from './Notifier';
import Worker from './Worker';
import {sleep} from '../common/utils';

export default class Runner {
  private options = program
    .requiredOption('--seat-view-url <number>', '좌석 선택 화면 URL')
    .requiredOption('--slack-webhook-url <string>', '슬랙으로 메시지를 보낼 웹 훅 URL')
    .option('--poll-interval-millis <number>', '폴링 간격(밀리초)', '500')
    .parse()
    .opts();

  async run() {
    console.log(this.options);
    console.log('시작');

    const {seatViewUrl, slackWebhookUrl, pollIntervalMillis} = this.options;
    const interval = parseInt(pollIntervalMillis);

    const fetcher = new Fetcher(seatViewUrl);
    const repo = new PerfRepository(fetcher);

    const notifier = new Notifier(seatViewUrl, slackWebhookUrl);
    const worker = new Worker(repo, notifier);

    while (true) {
      await worker.tick();

      await sleep(interval);
    }
  }
}
