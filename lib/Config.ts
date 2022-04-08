import {program} from 'commander';

const options = program
  .requiredOption('--goods-code <string>', '공연 식별자')
  .requiredOption('--place-code <string>', '장소 식별자')
  .requiredOption('--play-seq <string>', '공연 회차')
  .requiredOption('--username <string>', '로그인 ID')
  .requiredOption('--password <string>', '비밀번호')
  .requiredOption('--slack-webhook-url <string>', '슬랙으로 메시지를 보낼 웹 훅 URL')
  .option('--poll-interval-millis <number>', '폴링 간격(밀리초)', '500')
  .option('--capture-regex <string>', '예약할 좌석 정규표현식')

export default class Config {
  static current: Config;

  readonly goodsCode: string;
  readonly placeCode: string;
  readonly playSeq: string;

  readonly username: string;
  readonly password: string;

  readonly slackWebhookUrl: string;
  readonly pollIntervalMillis: number;

  readonly captureRegex?: string;

  static parseCommandLineArguments() {
    this.current = Config.fromCommandLineArguments();
  }

  private static fromCommandLineArguments() {
    const opts = options.parse().opts();

    return this.of({
      goodsCode: opts.goodsCode,
      placeCode: opts.placeCode,
      playSeq: opts.playSeq,
      username: opts.username,
      password: opts.password,
      slackWebhookUrl: opts.slackWebhookUrl,
      pollIntervalMillis: parseInt(opts.pollIntervalMillis),
      captureRegex: opts.captureRegex,
    });
  }

  static of(partial: Partial<Config>) {
    return Object.assign(new Config(), partial);
  }
}
