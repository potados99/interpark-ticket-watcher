import Config from '../lib/Config';
import Catcher from '../lib/actor/Catcher';
import Accessor from '../lib/actor/Accessor';
import Repository from '../lib/actor/Repository';

describe('자리잡기!', () => {
  it('해보자!', async () => {
    const config = Config.of({
      goodsCode: '22003760',
      placeCode: '20000611',
      playSeq: '003',

      username: 'qudwns1031',
      password: 'ㅎ',

      captureRegex: '.*' // 다
    });

    const accessor = new Accessor(config);
    const repository = new Repository(accessor);
    const catcher = new Catcher(config, accessor);

    const seats = await repository.getAvailableSeats();

    const results = await catcher.catchIfDesired(seats.slice(0, 1));

    console.log(results);
  });
});
