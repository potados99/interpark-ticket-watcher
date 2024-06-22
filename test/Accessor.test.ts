import Config from '../lib/Config';
import Accessor from '../lib/actor/Accessor';

describe('로그인하기', () => {
  it('되나?', async () => {
    const config = Config.of({
      goodsCode: '24005722',
      placeCode: '20000611',
      playSeq: '003',

      username: 'qudwns1031',
      password: '',

      captureRegex: '.*' // 다
    });

    const accessor = new Accessor(config);

    await accessor.login();
  });
});