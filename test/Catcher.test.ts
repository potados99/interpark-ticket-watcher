import Accessor from '../lib/actor/Accessor';
import Config from '../lib/Config';
import Repository from '../lib/actor/Repository';
import Catcher from '../lib/actor/Catcher';

describe('자리잡기!', () => {
  it('해보자!', async () => {
    const config = Config.of({
      goodsCode: '22003760',
      placeCode: '20000611',
      playSeq: '003',

      username: 'qudwns1031',
      password: ''
    });

    const accessor = new Accessor(config);
    const repository = new Repository(accessor);
    const catcher = new Catcher(config, accessor);

    const seats = await repository.getAvailableSeats();

    await catcher.catchIfDesired(seats.slice(0, 1));
  });
});
