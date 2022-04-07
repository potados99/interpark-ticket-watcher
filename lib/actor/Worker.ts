import Seat from '../model/Seat';
import Detector from './Detector';
import Notifier from './Notifier';
import Repository from './Repository';

export default class Worker {
  constructor(
    private readonly repo: Repository,
    private readonly notifier: Notifier
  ) {
  }

  private working: Boolean = false;
  private previousSeats: Seat[] = [];

  async tick() {
    let currentSeats: Seat[] = [];

    try {
      currentSeats = await this.repo.getAvailableSeats();
    } catch (e) {
      console.error(e);
      return;
    }

    try {
      process.stdout.write('.');

      if (!this.working) {
        this.working = true;

        process.stdout.write('!');
        await this.notifier.notifyText('!');

        return;
      }

      const detector = new Detector(this.previousSeats, currentSeats);

      if (detector.hasNoChanges) {
        return;
      }

      process.stdout.write('_');

      await this.notifier.notify({
        activatedSeats: detector.activatedSeats(),
        deactivatedSeats: detector.deactivatedSeats()
      });
    } catch (e: any) {
      console.error(e);
      await this.notifier.notifyText(e.message);
    } finally {
      this.previousSeats = currentSeats;
    }
  }
}
