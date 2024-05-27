import Piece from "../Classes/Game/Piece/Piece";
import { PieceData } from "../Types/GameTypes";

export default (piece: Piece): PieceData => {
  const shapes = [0, 0, 0, 0].map(() => {
    const matrix = piece.getMatrix();
    piece.freeRotate(1);
    return matrix;
  });

  return {
    id: piece.getId(),
    shapes: shapes,
    color: piece.getColor(),
  };
};
