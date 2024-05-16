"use client";

import React, { useEffect, useRef } from "react";
import Game from "../Game";
import styles from "../style/gameComponent.module.css";

export default function GameComponent() {
  const game = useRef<Game | null>(null);
  const boardRef = useRef(null);

  useEffect(() => {
    if (!game.current && boardRef.current) {
      const newGame = new Game(boardRef.current, 6);
      newGame.startGame();
      game.current = newGame;
    }
  });

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
