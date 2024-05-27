export type PieceId = "O" | "I" | "S" | "Z" | "J" | "L" | "T";

export type PieceMatrix = number[][];

export type PieceData = {
  id: PieceId;
  shapes: PieceMatrix[];
  color: string;
};

export type ShapeData = { shape: PieceMatrix; color: string };

export type Tile = { value: number; color: string | null };

export type CanvasMatrix = Tile[][];
