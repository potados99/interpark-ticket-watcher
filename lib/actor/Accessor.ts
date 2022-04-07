import qs from 'qs';
import Seat from '../model/Seat';
import Config from '../Config';
import {newAxiosInstance, newCookieJar} from '../common/axios';

export default class Accessor {
  constructor(
    private readonly config: Config
  ) {
  }

  private jar = newCookieJar();
  private axios = newAxiosInstance(this.jar);
  private sessionId: string;

  /**
   * 좌석맵 HTML 쓸어옵니다.
   */
  async getSeatMapDetail(): Promise<string> {
    const querystring = qs.stringify({
      GoodsCode: this.config.goodsCode,
      PlaceCode: this.config.placeCode,
      PlaySeq: this.config.playSeq,
      Block: 'RGN001',
      TmgsOrNot: 'D2006'
    });

    const result = await this.axios.get(`https://aspseat-ticket.interpark.com/Booking/App/MOSeatDetail.asp?${querystring}`);

    return result.data;
  }

  /**
   * 새로고침합니다. 로그인 후 세션 ID까지 다시 받아옵니다.
   */
  async reload(): Promise<void> {
    await this.login();
    this.sessionId = await this.generateSessionId();
  }

  /**
   * 로그인합니다. 결과는 쿠키에 담깁니다.
   */
  async login(): Promise<void> {
    // 로그인 폼 화면에 진입합니다. 쿠키가 우수수 떨어집니다.
    await this.axios.get(`https://accounts.interpark.com/authorize/ticket-mweb?origin=http%3A%2F%2Fmticket.interpark.com%2FMyTicket%2F&postProc=NONE`);

    // 로그인 요청을 쏩니다. 쿠키도 들고 갑니다.
    const loginResult = await this.axios.post(`https://accounts.interpark.com/login/submit`, qs.stringify({
      userId: this.config.username,
      userPwd: this.config.password
    }), {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const resultCode = loginResult.data.result_code;
    const callbackUrl = loginResult.data.callback_url;

    if (resultCode !== '00') {
      throw new Error(`로그인 실패!! 자세한 응답은 요기: ${loginResult.data}`);
    }

    // 주어진 콜백 URL로 들어가면 또 쿠키가 우수수 떨어지는데, 그중에 id_token이 있습니다.
    await this.axios.get(callbackUrl);
  }

  /**
   * 좌석 킵할때 사용될 세션 ID를 만들어옵니다.
   * 주의: 로그인이 되어 있어야(쿠키에 id_token이 숨쉬고 있어야) 합니다.
   */
  async generateSessionId(): Promise<string> {
    // 세션 만드는 페이지로 진입합니다. 결과는 응답 속에 담겨 있습니다.
    const result = await this.axios.get(`https://moticket.interpark.com/OneStop/Session?GoodsCode=${this.config.goodsCode}`);

    // 끄내옵니다.
    const sessionId = /"SessionID":"(?<sessionId>[A-Z0-9]+)"/.exec(result.data)?.groups?.sessionId;

    if (sessionId == null) {
      throw new Error(`${this.config.goodsCode} 상품에 대해 세션 발급 실패! 자세한 이야기는 페이지 소스 보세요: ${result.data}`);
    }

    return sessionId;
  }

  /**
   * 자리를 킵해둡니다.
   *
   * @param seat 킵할 자리.
   */
  async reserveSeat(seat: Seat) {
    if (this.sessionId == null) {
      await this.reload();
    }

    const params = {
      GoodsCode: this.config.goodsCode,
      PlaceCode: this.config.placeCode,
      PlaySeq: this.config.playSeq,
      SessionID: `F0A0D1E19BBD4096BCD78A747EEBB873`,
      SeatCnt: `1`,
      SeatGrade: `1^`,
      Floor: `^`,
      RowNo: `${seat.row}^`,
      SeatNo: `${seat.column}^`,
      BlankSeatCheckYN: 'N',
      SportsYN: 'N'
    };

    await this.axios.post('https://moticket.interpark.com/OneStop/SaveSeatAjax', qs.stringify(params));
  }
}
