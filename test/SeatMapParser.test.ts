import Config from '../lib/Config';
import Accessor from '../lib/actor/Accessor';
import SeatMapParser from '../lib/actor/SeatMapParser';

describe('좌석 맵 해석', () => {
  it('예약 가능 좌석 가져오기', async () => {
    const accessor = new Accessor(Config.of({
      goodsCode: '22003760',
      placeCode: '20000611',
      playSeq: '003'
    }));

    const html = await accessor.getSeatMapDetail();

    console.log(new SeatMapParser(html).availableSeats());
  });
});
