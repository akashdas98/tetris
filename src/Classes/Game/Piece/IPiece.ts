import Piece, { PieceInterface } from "./Piece";

export default class IPiece extends Piece {
  constructor(position?: PieceInterface["position"]) {
    const id = "I";
    const color = "#00ffff";
    let matrix = [
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    super({
      id,
      color,
      position,
      matrix,
    });
    this.kickData = [
      [
        [0, 0],
        [-1, 0],
        [2, 0],
        [-1, 0],
        [2, 0],
      ],
      [
        [-1, 0],
        [0, 0],
        [0, 0],
        [0, 1],
        [0, -2],
      ],
      [
        [-1, 1],
        [1, 1],
        [-2, 1],
        [1, 0],
        [-2, 0],
      ],
      [
        [0, 1],
        [0, 1],
        [0, 1],
        [0, -1],
        [0, 2],
      ],
    ];
  }
}
