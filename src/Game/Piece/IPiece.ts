import Piece from "./Piece";

export default class IPiece extends Piece {
  constructor(x: number, y: number) {
    const id = "I";
    const color = "#00ffff";
    let matrix = [
      [-1.5, 0.5],
      [-0.5, 0.5],
      [0.5, 0.5],
      [1.5, 0.5],
    ];
    super({
      id,
      color,
      pivot: [x, y],
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
