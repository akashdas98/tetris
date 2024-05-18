"use client";

import React, { useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import styles from "../style/gameComponent.module.css";

export default function GameComponent() {
  const game = useRef<Game | null>(null);
  const boardRef = useRef(null);

  const getGameBoardScale = () => Math.min(window.innerHeight / 35, window.innerWidth / 1.5)

  const handleResize = () => {
    game.current?.resizeGameBoard(getGameBoardScale());
  };

  const initializeGame = () => {
    if(!boardRef.current) return;
    const newGame = new Game(boardRef.current, 6, getGameBoardScale());
    newGame.startGame();
    game.current = newGame;
  }

  useEffect(() => {
    if (!game.current) {
      initializeGame()
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
          <span id="score"></span>
        </p>
        <p id="level">
          <span>Level: </span>
          <span id="currentLevel"></span>
        </p>
      </div>
    </div>
  );
}
