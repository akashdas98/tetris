import Piece, { PieceInterface } from "./Piece";

export default class TPiece extends Piece {
  constructor(pivot?: PieceInterface["pivot"]) {
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
      pivot,
      matrix,
    });
  }
}
