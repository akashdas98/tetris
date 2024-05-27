import Piece, { PieceInterface } from "./Piece";

export default class OPiece extends Piece {
  constructor(position?: PieceInterface["position"]) {
    const id = "O";
    const color = "#ffe000";
    let matrix = [
      [0, -1],
      [1, -1],
      [0, 0],
      [1, 0],
    ];
    super({
      id,
      color,
      position,
      matrix,
    });
  }

  public rotate = (): void => {
    return;
  };
}
