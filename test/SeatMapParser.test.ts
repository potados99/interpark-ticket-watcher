import Fetcher from '../lib/actor/Fetcher';
import SeatMapParser from '../lib/actor/SeatMapParser';

describe('좌석 맵 해석', () => {
  it('예약 가능 좌석 가져오기', async () => {
    const html = await new Fetcher('https://aspseat-ticket.interpark.com/Booking/App/MOSeatDetail.asp?GoodsCode=22003760&PlaceCode=20000611&PlaySeq=003&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImagePage=&UILock=Y&BizCode=15523').fetchSeatMapHtml();

    console.log(new SeatMapParser(html).availableSeats());
  });
});
