import Piece from "./Piece";

export default class TPiece extends Piece {
  constructor(x: number, y: number) {
    const id = "T";
    const color = "#ff00ff";
    let matrix = [
      [0, -1],
      [-1, 0],
      [0, 0],
      [1, 0],
    ];
    super({
      id,
      color,
      pivot: [x, y],
      matrix,
    });
  }
}
