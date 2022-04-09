import Seat from '../model/Seat';
import Config from '../Config';
import Accessor, {AfterReserveScripts} from './Accessor';

export type CatchResult = {
  seat: Seat;
  scripts: AfterReserveScripts;
};

/**
 * 자리를 잡아야 하는지 판단 및 실제로 자리를 잡아주는 친구입니다.
 */
export default class Catcher {
  constructor(
    private readonly config: Config,
    private readonly accessor: Accessor,
  ) {
  }

  async catchIfDesired(seats: Seat[]): Promise<CatchResult[]> {
    const {captureRegex} = this.config;
    if (captureRegex == null) {
      return [];
    }

    const regex = new RegExp(captureRegex);

    const results: CatchResult[] = [];

    for (const seat of seats) {
      if (regex.test(seat.toNormalizedString())) {
        const scripts = await this.accessor.reserveSeat(seat);

        results.push({
          seat,
          scripts
        });
      }
    }

    return results;
  }
}
