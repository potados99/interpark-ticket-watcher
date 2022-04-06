import Seat from '../model/Seat';

export default class Detector {
  constructor(
    private readonly seatsBefore: Seat[],
    private readonly seatsAfter: Seat[]
  ) {
  }

  get hasNoChanges(): Boolean {
    return this.activatedSeats().length === 0 && this.deactivatedSeats().length === 0;
  }

  get hasChanges(): Boolean {
    return !this.hasNoChanges;
  }

  activatedSeats(): Seat[] {
    return this
      .seatsAfter
      .filter(s => this.seatsBefore.find(ss => ss.id === s.id) == null);
  }

  deactivatedSeats(): Seat[] {
    return this
      .seatsBefore
      .filter(s => this.seatsAfter.find(ss => ss.id === s.id) == null);
  }
}
