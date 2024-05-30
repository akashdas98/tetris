"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Game from "../Classes/Game/Game";
import styles from "./gameComponent.module.css";
import DoubleBorder from "./UI/DoubleBorder";
import Box from "./UI/Box";
import { useSearchParams } from "next/navigation";

export default function GameComponent() {
  const gameRef = useRef<Game | null>(null);
  const boardRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pieceCountRef = useRef(null);
  const nextPieceRef = useRef(null);
  const searchParams = useSearchParams();
  const startingLevelParam = Number(searchParams.get("startingLevel"));
  const startingLevel: number = isNaN(startingLevelParam)
    ? 6
    : startingLevelParam;
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(startingLevel);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [borderSettings, setBorderSettings] = useState({
    innerBorderThickness: "2px",
    outerBorderThickness: "4px",
    gap: "4px",
  });

  const getGameBoardScale = () => {
    const width = boardRef.current?.parentElement?.clientWidth ?? 300;
    const scale = Math.floor(width / 10);
    return scale;
  };

  const handleResize = () => {
    gameRef.current?.setScale(getGameBoardScale());
  };

  const initializeGame = () => {
    const newGame = new Game({
      boardCanvas: boardRef.current!,
      startingLevel: level,
      scale: getGameBoardScale(),
      onChangeStats: setLinesCleared,
      onChangeScore: setScore,
      onChangeLevel: setLevel,
      nextPieceCanvas: nextPieceRef.current!,
      pieceCountCanvas: pieceCountRef.current!,
    });
    newGame.startGame();
    gameRef.current = newGame;
    handleResize();
  };

  const updateBorders = () => {
    const isSmallScreen = window.innerWidth <= 600;
    setBorderSettings({
      innerBorderThickness: isSmallScreen ? "1px" : "2px",
      outerBorderThickness: isSmallScreen ? "2px" : "4px",
      gap: isSmallScreen ? "2px" : "4px",
    });
  };

  useEffect(() => {
    updateBorders();

    window.addEventListener("resize", updateBorders);

    if (!gameRef.current) {
      initializeGame();
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
      if (containerRef.current?.style.visibility === "hidden") {
        containerRef.current.style.visibility = "visible";
      }
    });

    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateBorders);
      if (boardRef.current) {
        resizeObserver.unobserve(boardRef.current);
      }
    };
  }, []);

  const DoubleBorderResponsive = (
    children: ReactNode,
    props: Record<string, any>
  ) => (
    <DoubleBorder {...borderSettings} {...props}>
      {children}
    </DoubleBorder>
  );

  return (
    <div
      ref={containerRef}
      className={styles.gameComponent}
      style={{ visibility: "hidden" }}
    >
      <div className={styles.leftStats}>
        {DoubleBorderResponsive(
          <Box className={styles.level}>
            <p style={{ marginBottom: "0.5em" }}>Level</p>
            <p>{level}</p>
          </Box>,
          { className: styles.levelContainer }
        )}
        {DoubleBorderResponsive(
          <Box className={styles.linesCleared}>
            <p style={{ marginBottom: "0.5em" }}>Lines Cleared</p>
            <p>{linesCleared}</p>
          </Box>,
          { className: styles.linesClearedContainer }
        )}
        {DoubleBorderResponsive(<canvas ref={pieceCountRef} />, {
          className: styles.pieceCount,
        })}
      </div>

      {DoubleBorderResponsive(
        <canvas ref={boardRef} style={{ width: "100%", height: "100%" }} />,
        { className: styles.gameBoardContainer }
      )}

      <div className={styles.rightStats}>
        {DoubleBorderResponsive(
          <Box className={styles.score}>
            <p style={{ marginBottom: "0.5em" }}>Score</p>
            <p style={{ marginBottom: "0.5em" }}>{score}</p>
            <p style={{ marginBottom: "0.5em" }}>Highscore</p>
            <p>{score}</p>
          </Box>,
          { className: styles.scoreContainer }
        )}
        {DoubleBorderResponsive(<canvas ref={nextPieceRef} />, {
          className: styles.nextPieceContainer,
          innerProps: { className: styles.nextPieceContainerInner },
        })}
        {DoubleBorderResponsive(
          <Box className={styles.level}>
            <p style={{ marginBottom: "0.5em" }}>Level</p>
            <p>{level}</p>
          </Box>,
          { className: styles.levelContainer }
        )}
      </div>
    </div>
  );
}
