import React, { useEffect, useRef } from "react";
import Game from "../../Game/Game";

export default function GameComponent() {
  const isGameInitialized = useRef(false);
  const boardRef = useRef(null);

  useEffect(() => {
    if (!isGameInitialized.current && boardRef.current) {
      const game = new Game(boardRef.current, 6);
      game.startGame();
      isGameInitialized.current = true;
    }
  });

  return (
    <div id="gameComponent">
      <canvas id="boardCanvas" ref={boardRef}></canvas>
      <div id="details">
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
