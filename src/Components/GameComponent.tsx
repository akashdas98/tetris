"use client";

import React, { useEffect, useRef, useState } from "react";
import Game from "../Classes/Game/Game";
import styles from "./gameComponent.module.css";
import { areValuesClosePercentage } from "../utils";
import DoubleBorder from "./UI/DoubleBorder";
import Box from "./UI/Box";

interface GameComponentPropTypes {
  startingLevel?: number;
}

export default function GameComponent({
  startingLevel = 6,
}: GameComponentPropTypes) {
  const gameRef = useRef<Game | null>(null);
  const boardRef = useRef(null);
  const pieceCountRef = useRef(null);
  const nextPieceRef = useRef(null);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(startingLevel);

  const getGameBoardScale = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const minDim = Math.min(width, height);
    let scaleFactor = width >= 1200 ? 0.7 : 0.8;

    if (areValuesClosePercentage(width, height, 25)) {
      return (scaleFactor * minDim) / 20;
    }

    if (width > height) {
      return (scaleFactor * height) / 20;
    }

    scaleFactor =
      height > 2 * width ? scaleFactor : width >= 1200 ? 0.65 : 0.75;

    return height > 2 * width
      ? (scaleFactor * width) / 10
      : (scaleFactor * height) / 20;
  };

  const handleResize = () => {
    gameRef.current?.setScale(getGameBoardScale());
  };

  const initializeGame = () => {
    const newGame = new Game({
      boardCanvas: boardRef.current!,
      startingLevel: level,
      scale: getGameBoardScale(),
      onChangeScore: setScore,
      onChangeLevel: setLevel,
      nextPieceCanvas: nextPieceRef.current!,
      pieceCountCanvas: pieceCountRef.current!,
    });
    newGame.startGame();
    gameRef.current = newGame;
  };

  useEffect(() => {
    if (!gameRef.current) {
      initializeGame();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.gameComponent}>
      <div className={styles.leftStats}>
        <DoubleBorder>
          <Box className={styles.linesCleared} />
        </DoubleBorder>
        <DoubleBorder className={styles.pieceCount}>
          <canvas ref={pieceCountRef} />
        </DoubleBorder>
      </div>
      <DoubleBorder className={styles.gameBoardContainer}>
        <canvas ref={boardRef} />
      </DoubleBorder>
      <div className={styles.rightStats}>
        <DoubleBorder>
          <Box className={styles.score} />
        </DoubleBorder>
        <DoubleBorder className={styles.nextPiece}>
          <canvas ref={nextPieceRef} />
        </DoubleBorder>
        <DoubleBorder>
          <Box className={styles.level} />
        </DoubleBorder>
      </div>
    </div>
  );
}
