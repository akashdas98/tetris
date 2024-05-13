import Piece from "./Piece";

export default class OPiece extends Piece {
  constructor(x: number, y: number) {
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
      pivot: [x, y],
      matrix,
    });
  }

  public rotate = (): void => {
    return;
  };
}
