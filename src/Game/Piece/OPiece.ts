import Piece, { PieceInterface } from "./Piece";

export default class OPiece extends Piece {
  constructor(pivot?: PieceInterface["pivot"]) {
    const id = "O";
    const color = "#ffff00";
    let matrix = [
      [-1, 0],
      [0, 0],
      [-1, -1],
      [0, -1],
    ];
    super({
      id,
      color,
      pivot,
      matrix,
    });
  }

  public rotate = (): void => {
    return;
  };
}
