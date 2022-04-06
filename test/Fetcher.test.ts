import Fetcher from '../lib/actor/Fetcher';

describe('Fetcher 기본 기능', () => {
  const fetcher = new Fetcher('https://aspseat-ticket.interpark.com/Booking/App/MOSeatDetail.asp?GoodsCode=22003760&PlaceCode=20000611&PlaySeq=003&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImagePage=&UILock=Y&BizCode=15523');

  it('좌석 맵 fetching', async () => {
    console.log(await fetcher.fetchSeatMapHtml());
  });
});
