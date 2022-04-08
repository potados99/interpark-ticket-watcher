import {interceptParameters} from '../common/utils';

export default class Seat {
  constructor(
    readonly id: string,
    readonly row: string,
    readonly column: string,
    readonly available: Boolean // 이 속성은 이 프로젝트에서는 안 써요.
  ) {
  }

  static fromSelectSeatCallStatement(selectSeatCallStatement: string): Seat {
    const params = interceptParameters('SelectSeat', selectSeatCallStatement);

    const row = params[3];
    const column = params[4];

    return new Seat(`${row}${column}`, row, column, true);
  }

  get valid(): Boolean {
    return this.row !== "" && this.column !== "-1"
  }

  toString(): string {
    return `${this.row}열 ${this.column}번`;
  }

  toNormalizedString(): string {
    return `${this.row}${this.column}`;
  }
}
