import Seat from '../lib/model/Seat';
import Detector from '../lib/actor/Detector';

describe('Detector 감지!', () => {
  it('좌석 하나가 생길 때', async () => {
    const seatsBefore = [
      new Seat("s1", "A", "1", true),
    ];

    const seatsAfter = [
      new Seat("s1", "A", "1", true),
      new Seat("s2", "A", "2", true),
    ];

    const detector = new Detector(seatsBefore, seatsAfter);

    expect(detector.activatedSeats()[0].id).toBe('s2');
  });

  it('좌석 하나가 사라질 때', async () => {
    const seatsBefore = [
      new Seat("s1", "A", "1", true),
      new Seat("s2", "A", "2", true),
    ];

    const seatsAfter = [
      new Seat("s1", "A", "1", true),
    ];

    const detector = new Detector(seatsBefore, seatsAfter);

    expect(detector.hasChanges).toBeTruthy();
    expect(detector.deactivatedSeats()[0].id).toBe('s2');
  });
});
