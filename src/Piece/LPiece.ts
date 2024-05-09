import Piece from "./Piece";

export default class TPiece extends Piece {
  constructor(x: number, y: number) {
    const id = "L";
    const color = "#ff7f00";
    let matrix = [
      [-1, 0],
      [0, 0],
      [1, 0],
      [1, -1],
    ];
    super({
      id,
      color,
      pivot: [x, y],
      matrix,
    });
  }
}
