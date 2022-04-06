import fetch from 'node-fetch';
import Seat from '../model/Seat';

type NotifyParams = {
  activatedSeats: Seat[],
  deactivatedSeats: Seat[]
};

export default class Notifier {
  constructor(
    private readonly seatViewUrl: string,
    private readonly slackWebhookUrl: string
  ) {
  }

  async notifyText(message: string) {
    await this.postToSlack(message);
  }

  async notify({activatedSeats, deactivatedSeats}: NotifyParams) {
    const goodsCode = new URLSearchParams(new URL(this.seatViewUrl).search).get('GoodsCode');

    const added = activatedSeats.length > 0 ? `${activatedSeats.map(s => s.toString()).join(', ')} 생김\n` : '';
    const gone = deactivatedSeats.length > 0 ? `${deactivatedSeats.map(s => s.toString()).join(', ')} 사라짐\n` : '';
    const link = `<https://mobileticket.interpark.com/goods/${goodsCode}|바로가기>`;

    await this.postToSlack(`${added}${gone}\n${link}`);
  }

  private async postToSlack(text: string) {
    await fetch(this.slackWebhookUrl, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({text}),
    });
  }
}
