export type PieceId = "O" | "I" | "S" | "Z" | "J" | "L" | "T";

export type PieceMatrix = number[][];

export type PieceData = {
  id: PieceId;
  shapes: PieceMatrix[];
  color: string;
};
