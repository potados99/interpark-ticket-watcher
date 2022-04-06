import fetch from 'node-fetch';

export default class Fetcher {
  constructor(private readonly seatViewUrl: string) {
  }

  async fetchSeatMapHtml(): Promise<string> {
    const response = await fetch(this.seatViewUrl);

    return await response.text();
  }
}
