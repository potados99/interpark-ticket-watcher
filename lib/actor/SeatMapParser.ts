import Seat from '../model/Seat';
import cheerio from 'cheerio';

export default class SeatMapParser {
  constructor(private readonly seatMapHtml: string) {
  }

  availableSeats(): Seat[] {
    const $ = cheerio.load(this.seatMapHtml);

    return $('#TmgsTable')
      .find('tr > td > img.stySeat')
      .map((i, el) => el.attribs['onclick'])
      .toArray()
      .map((onclick) => onclick.replace('javascript: ', ''))
      .map((statement) => Seat.fromSelectSeatCallStatement(statement))
  }
}
