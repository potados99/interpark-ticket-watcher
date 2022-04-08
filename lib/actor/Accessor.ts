import qs from 'qs';
import Seat from '../model/Seat';
import iconv from 'iconv-lite';
import Config from '../Config';
import cheerio from 'cheerio';
import {newAxiosInstance, newCookieJar} from '../common/axios';

type Session = {
  sessionId: string;
  oneStopModel: any;
}

type ReserveResult = {
  cancelCurlScript: string;
};

/**
 * 인터파크에 요청 보낼 때에 사용하는 친구입니다.
 * 계정 정보가 있으면 로그인할 수 있습니다.
 * 쿠키 저장소를 가지고 있습니다.
 */
export default class Accessor {
  constructor(
    private readonly config: Config
  ) {
  }

  private jar = newCookieJar();
  private axios = newAxiosInstance(this.jar);

  /**
   * 좌석을 잡는 데에 사용될 세션입니다.
   * 테스트 결과 한 번 만들어 놓으면 계속 가는 것 같으니,
   * 따로 새로고침은 안 합니다.
   * @private
   */
  private session: Session;

  /**
   * 새로고침합니다. 로그인 후 세션 ID와 OneStopModel 까지 다시 받아옵니다.
   */
  async reload(): Promise<void> {
    await this.login();

    this.session = await this.generateSession();

    console.log(`Accessor 리로드 완료!`);
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
  async generateSession(): Promise<Session> {
    const result = await this.axios.get(
      `https://moticket.interpark.com/OneStop/Session?GoodsCode=${this.config.goodsCode}`,
      {responseType: 'arraybuffer'}
    );

    const content = iconv.decode(result.data, 'EUC-KR').toString();

    const $ = cheerio.load(content);
    const $input = $('input#OneStopModel');

    const oneStopModelString = $input.attr('value');
    if (oneStopModelString == null) {
      throw new Error('페이지 내에 OneStopModel이 없습니다ㅠ');
    }

    const oneStopModel = JSON.parse(oneStopModelString);

    return {
      sessionId: oneStopModel.GoodsInfo.SessionID,
      oneStopModel
    };
  }

  /**
   * 자리를 킵해둡니다.
   *
   * @param seat 킵할 자리.
   */
  async reserveSeat(seat: Seat): Promise<ReserveResult> {
    if (this.session == null) {
      await this.reload();
    }

    const reserveParams = {
      GoodsCode: this.config.goodsCode,
      PlaceCode: this.config.placeCode,
      PlaySeq: this.config.playSeq,
      SessionID: this.session.sessionId,
      SeatCnt: `1`,
      SeatGrade: `1^`,
      Floor: `^`,
      RowNo: `${seat.row}^`,
      SeatNo: `${seat.column}^`,
      BlankSeatCheckYN: 'N',
      SportsYN: 'N'
    };

    await this.axios.post(
      'https://moticket.interpark.com/OneStop/SaveSeatAjax',
      qs.stringify(reserveParams)
    );

    return {
      cancelCurlScript: this.generateDropSeatCurlScript(seat)
    }
  }

  /**
   * 지정된 자리를 드랍하는 cURL 스크립트를 만들어 반환합니다.
   * @param seat 드랍할 자리.
   * @private
   */
  private generateDropSeatCurlScript(seat: Seat): string {
    const oneStopModel = {
      'GoodsInfo': this.session.oneStopModel.GoodsInfo,
      'PlayDateTime': {
        'PlaySeq': this.config.playSeq,
      },
      'SeatInfo': {
        'BlockNo': '001^',
        'Floor': '^',
        'RowNo': `${seat.row}^`,
        'SeatNo': `${seat.column}^`,
        'SeatGrade': '1^',
        'IsBlock': 'Y',
        'SeatCnt': 1,
      }
    };

    const body = `OneStopModel=${encodeURIComponent(JSON.stringify(oneStopModel))}`;

    return `curl --location --request POST 'https://moticket.interpark.com/OneStop/Seat' --header 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' --data-raw '${body}'`;
  }

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
}
