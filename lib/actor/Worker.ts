import Seat from '../model/Seat';
import Detector from './Detector';
import Notifier from './Notifier';
import Repository from './Repository';
import Catcher from './Catcher';

export default class Worker {
  constructor(
    private readonly repo: Repository,
    private readonly catcher: Catcher,
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

      const catchResults = await this.catcher.catchIfDesired(currentSeats);
      if (catchResults.length > 0) {
        console.log(`${catchResults}`);

        await this.notifier.notifySeatCatchResults(catchResults);
      }

      const detector = new Detector(this.previousSeats, currentSeats);
      if (detector.hasChanges) {
        process.stdout.write('_');

        await this.notifier.notifySeatChanges({
          activatedSeats: detector.activatedSeats(),
          deactivatedSeats: detector.deactivatedSeats()
        });
      }

    } catch (e: any) {
      console.error(e);
      await this.notifier.notifyText(e.message);
    } finally {
      this.previousSeats = currentSeats;
    }
  }
}
