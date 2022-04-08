import fetch from 'node-fetch';
import Seat from '../model/Seat';
import Config from '../Config';
import {CatchResult} from './Catcher';

type NotifyParams = {
  activatedSeats: Seat[],
  deactivatedSeats: Seat[]
};

export default class Notifier {
  constructor(
    private readonly config: Config
  ) {
  }

  async notifyText(message: string) {
    await this.postToSlack(message);
  }

  async notifySeatChanges({activatedSeats, deactivatedSeats}: NotifyParams) {
    const added = activatedSeats.length > 0 ? `${activatedSeats.map(s => s.toString()).join(', ')} 생김\n` : '';
    const gone = deactivatedSeats.length > 0 ? `${deactivatedSeats.map(s => s.toString()).join(', ')} 사라짐\n` : '';
    const link = `<https://mobileticket.interpark.com/goods/${this.config.goodsCode}|바로가기>`;

    await this.postToSlack(`${added}${gone}${link}`);
  }

  async notifySeatCatchResults(results: CatchResult[]) {
    const text = results
      .map((result) => `${result.seat.toString()} 예약하였습니다.\n취소하려면 다음 스크립트를 실행하세요:\n\`\`\`${result.cancelCurlScript}\`\`\``)
      .join('\n');

    await this.postToSlack(text);
  }

  private async postToSlack(text: string) {
    await fetch(this.config.slackWebhookUrl, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({text}),
    });
  }
}
