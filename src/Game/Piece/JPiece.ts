import Piece from "./Piece";

export default class TPiece extends Piece {
  constructor(x: number, y: number) {
    const id = "J";
    const color = "#0000ff";
    let matrix = [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, -1],
    ];
    super({
      id,
      color,
      pivot: [x, y],
      matrix,
    });
  }
}
