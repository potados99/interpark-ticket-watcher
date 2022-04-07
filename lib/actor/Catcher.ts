import Seat from '../model/Seat';
import Config from '../Config';
import Accessor from './Accessor';

export default class Catcher {
  constructor(
    private readonly config: Config,
    private readonly accessor: Accessor
  ) {
  }

  async catchIfDesired(seats: Seat[]) {
    for (const seat of seats) {
      console.log(`${seat} 잡습니다.`);

      await this.accessor.reserveSeat(seat);

      return; // TODO 정규식에 맞는 것만 catch 해야 함.
    }
  }
}
