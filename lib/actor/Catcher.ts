import Seat from '../model/Seat';
import Config from '../Config';
import Accessor from './Accessor';

export type CatchResult = {
  seat: Seat;
  cancelCurlScript: string;
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
        const {cancelCurlScript} = await this.accessor.reserveSeat(seat);

        results.push({
          seat,
          cancelCurlScript
        });
      }
    }

    return results;
  }
}
