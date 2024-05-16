"use client";

import React, { useRef, useEffect } from "react";
import { mutifyHexColor } from "../utils";

interface TetrisPiece {
  shapes: number[][][];
  color: string;
}

const TETRIS_PIECES: TetrisPiece[] = [
  // I piece (color: cyan)
  { shapes: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]], color: "#00ffff" },
  // O piece (color: yellow)
  {
    shapes: [
      [
        [1, 1],
        [1, 1],
      ],
    ],
    color: "#ffff00",
  },
  // T piece (color: purple)
  {
    shapes: [
      [
        [0, 1, 0],
        [1, 1, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 0],
      ],
      [
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [0, 1],
      ],
    ],
    color: "#ff00ff",
  },
  // L piece (color: orange)
  {
    shapes: [
      [
        [1, 0, 0],
        [1, 1, 1],
      ],
      [
        [1, 1],
        [1, 0],
        [1, 0],
      ],
      [
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
    ],
    color: "#ff7f00",
  },
  // J piece (color: blue)
  {
    shapes: [
      [
        [0, 0, 1],
        [1, 1, 1],
      ],
      [
        [1, 0],
        [1, 0],
        [1, 1],
      ],
      [
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1],
        [0, 1],
        [0, 1],
      ],
    ],
    color: "#0000ff",
  },
  // S piece (color: green)
  {
    shapes: [
      [
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    ],
    color: "#00ff00",
  },
  // Z piece (color: red)
  {
    shapes: [
      [
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
    ],
    color: "#ff0000",
  },
];

const scale = 30; // Adjust scale as needed

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createEmptyGrid = (rows: number, cols: number): (string | null)[][] => {
    let grid: (string | null)[][] = [];
    for (let i = 0; i < rows; i++) {
      grid.push(new Array(cols).fill(null));
    }
    return grid;
  };

  const canPlacePiece = (
    grid: (string | null)[][],
    piece: { shape: number[][]; color: string },
    row: number,
    col: number
  ): boolean => {
    const shape = piece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (
          shape[r][c] &&
          (grid[row + r] === undefined ||
            grid[row + r][col + c] === undefined ||
            grid[row + r][col + c])
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const placePiece = (
    grid: (string | null)[][],
    piece: { shape: number[][]; color: string },
    row: number,
    col: number,
    value: boolean
  ): void => {
    const shape = piece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          grid[row + r][col + c] = value ? piece.color : null;
        }
      }
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const isPieceUsedTooOften = (
    grid: (string | null)[][],
    pieceColor: string,
    row: number,
    col: number,
    proximity: number
  ): boolean => {
    let count = 0;
    for (
      let r = Math.max(0, row - proximity);
      r <= Math.min(grid.length - 1, row + proximity);
      r++
    ) {
      for (
        let c = Math.max(0, col - proximity);
        c <= Math.min(grid[0].length - 1, col + proximity);
        c++
      ) {
        if (grid[r][c] === pieceColor) {
          count++;
          if (count > 2) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const fillGrid = (rows: number, cols: number): (string | null)[][] => {
    let grid = createEmptyGrid(rows, cols);
    const proximity = 2; // Using an integer value for proximity

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] === null) {
          let piecePlaced = false;
          let pieceIndices = Array.from(Array(TETRIS_PIECES.length).keys());
          pieceIndices = shuffleArray(pieceIndices);

          for (let pieceIndex of pieceIndices) {
            const piece = TETRIS_PIECES[pieceIndex];
            let shapeIndices = Array.from(Array(piece.shapes.length).keys());
            shapeIndices = shuffleArray(shapeIndices);

            for (let shapeIndex of shapeIndices) {
              const shape = piece.shapes[shapeIndex];
              if (
                canPlacePiece(grid, { shape, color: piece.color }, row, col) &&
                !isPieceUsedTooOften(grid, piece.color, row, col, proximity)
              ) {
                placePiece(grid, { shape, color: piece.color }, row, col, true);
                piecePlaced = true;
                break;
              }
            }

            if (piecePlaced) break;
          }
        }
      }
    }

    return grid;
  };

  const drawGrid = (
    canvas: HTMLCanvasElement,
    grid: (string | null)[][],
    scale: number
  ): void => {
    const context = canvas.getContext("2d")!;
    canvas.width = canvas.parentElement!.clientWidth;
    canvas.height = canvas.parentElement!.clientHeight;

    const strokeWidth = 1.5; // Adjust the stroke width as needed
    const innerScale = scale - strokeWidth - 1;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col]) {
          context.strokeStyle = mutifyHexColor(grid[row][col]!, 0.3, 0.3);
          context.lineWidth = strokeWidth;
          context.strokeRect(
            col * scale + strokeWidth / 2,
            row * scale + strokeWidth / 2,
            innerScale,
            innerScale
          );
        }
      }
    }
  };

  const updateCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const cols = Math.ceil(canvas.parentElement!.clientWidth / scale);
    const rows = Math.ceil(canvas.parentElement!.clientHeight / scale);
    const filledGrid = fillGrid(rows, cols);
    drawGrid(canvas, filledGrid, scale);
  };

  useEffect(() => {
    updateCanvas();
    window.addEventListener("resize", updateCanvas);
    return () => window.removeEventListener("resize", updateCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "#000000",
      }}
    />
  );
}
