import Fetcher from './Fetcher';
import Seat from '../model/Seat';
import SeatMapParser from './SeatMapParser';

export default class PerfRepository {
  constructor(
    private readonly fetcher: Fetcher
  ) {
  }

  async getAvailableSeats(): Promise<Seat[]> {
    const fetched = await this.fetcher.fetchSeatMapHtml();

    return new SeatMapParser(fetched).availableSeats();
  }
}
