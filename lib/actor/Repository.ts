import Seat from '../model/Seat';
import Accessor from './Accessor';
import SeatMapParser from './SeatMapParser';

export default class Repository {
  constructor(
    private readonly accessor: Accessor
  ) {
  }

  async getAvailableSeats(): Promise<Seat[]> {
    const fetched = await this.accessor.getSeatMapDetail();

    return new SeatMapParser(fetched).availableSeats();
  }
}
