"use client";

import React, { useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import styles from "./gameComponent.module.css";
import { areValuesClosePercentage } from "../utils";

interface GameComponentPropTypes {
  startingLevel?: number;
}

export default function GameComponent({
  startingLevel = 6,
}: GameComponentPropTypes) {
  const gameRef = useRef<Game | null>(null);
  const boardRef = useRef(null);
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
    gameRef.current?.resizeGameBoard(getGameBoardScale());
  };

  const initializeGame = () => {
    const newGame = new Game(
      boardRef.current!,
      level,
      getGameBoardScale(),
      setScore,
      setLevel
    );
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
    <div id="gameComponent">
      <canvas
        style={{
          background: "#000000",
          display: "block",
        }}
        ref={boardRef}
      />
      <div id={styles.details}>
        <p id="scoring">
          <span>Score: </span>
          <span id="score">{score}</span>
        </p>
        <p id="level">
          <span>Level:</span>
          <span id="currentLevel">{level}</span>
        </p>
      </div>
    </div>
  );
}
