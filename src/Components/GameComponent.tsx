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
  const pieceCountRef = useRef<HTMLCanvasElement>(null);
  const nextPieceRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const startingLevelParam = Number(searchParams.get("startingLevel"));
  const startingLevel: number = isNaN(startingLevelParam)
    ? 6
    : startingLevelParam;
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(startingLevel);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(
    "landscape"
  );
  const [borderSettings, setBorderSettings] = useState({
    innerBorderThickness: "2px",
    outerBorderThickness: "4px",
    gap: "4px",
  });
  const [scale, setScale] = useState<number>(0);

  const getGameBoardScale = () => {
    const width = boardRef.current?.parentElement?.clientWidth ?? 300;
    const scale = width / 10;
    return scale;
  };

  const handleGameBoardResize = () => {
    const newScale = getGameBoardScale();
    if (Math.abs(newScale - scale) >= 1) {
      setScale(newScale);
    }
  };

  const initializeGame = () => {
    if (boardRef.current && nextPieceRef.current && pieceCountRef.current) {
      const newGame = new Game({
        boardCanvas: boardRef.current,
        startingLevel: level,
        scale: getGameBoardScale(),
        onChangeStats: setLinesCleared,
        onChangeScore: setScore,
        onChangeLevel: setLevel,
        nextPieceCanvas: nextPieceRef.current,
        pieceCountCanvas: pieceCountRef.current,
      });
      newGame.startGame();
      gameRef.current = newGame;
      handleGameBoardResize();
    }
  };

  const updateBorders = () => {
    const isSmallScreen = window.innerWidth <= 600 || window.innerHeight <= 400;
    setBorderSettings({
      innerBorderThickness: isSmallScreen ? "1px" : "2px",
      outerBorderThickness: isSmallScreen ? "2px" : "4px",
      gap: isSmallScreen ? "2px" : "4px",
    });
  };

  const updateUi = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const isPortrait = windowWidth / windowHeight <= 2.99 / 4;

    setOrientation(isPortrait ? "portrait" : "landscape");
  };

  const handleWindowResize = () => {
    updateBorders();
    updateUi();
  };

  useEffect(() => {
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    const resizeObserver = new ResizeObserver(() => {
      handleGameBoardResize();
    });

    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    if (!gameRef.current) {
      initializeGame();
    } else {
      gameRef.current.updateCanvases({
        boardCanvas: boardRef.current!,
        nextPieceCanvas: nextPieceRef.current!,
        pieceCountCanvas: pieceCountRef.current!,
      });
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      if (boardRef.current) {
        resizeObserver.unobserve(boardRef.current);
      }
    };
  }, [orientation, scale]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setScale(scale);
    }
  }, [scale]);

  const boardCanvas = (
    <canvas ref={boardRef} style={{ width: "100%", height: "100%" }} />
  );
  const nextPieceCanvas = <canvas ref={nextPieceRef} />;
  const pieceCountCanvas = <canvas ref={pieceCountRef} />;

  const DoubleBorderResponsive = (
    children: ReactNode,
    props: Record<string, any>
  ) => (
    <DoubleBorder {...borderSettings} {...props}>
      {children}
    </DoubleBorder>
  );

  const landscapeUi = (
    <>
      <div className={styles.leftStats}>
        {DoubleBorderResponsive(
          <Box className={styles.linesCleared}>
            <p style={{ marginBottom: "0.5em" }}>Lines Cleared</p>
            <p>{linesCleared}</p>
          </Box>,
          { className: styles.linesClearedContainer }
        )}
        {DoubleBorderResponsive(pieceCountCanvas, {
          className: styles.pieceCount,
        })}
      </div>

      {DoubleBorderResponsive(boardCanvas, {
        className: styles.gameBoardContainer,
      })}

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
        {DoubleBorderResponsive(nextPieceCanvas, {
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
    </>
  );

  const portraitUi = (
    <>
      <div className={styles.top}>
        {DoubleBorderResponsive(
          <>
            <Box className={styles.score}>
              <p style={{ marginBottom: "0.5em" }}>Score</p>
              <p>{score}</p>
            </Box>
            <Box className={styles.score}>
              <p style={{ marginBottom: "0.5em" }}>Highscore</p>
              <p>{score}</p>
            </Box>
          </>,
          { innerProps: { className: styles.scoreContainer } }
        )}
      </div>
      <div className={styles.main}>
        {DoubleBorderResponsive(boardCanvas, {
          className: styles.gameBoardContainer,
        })}
        <div className={styles.mainStats}>
          {DoubleBorderResponsive(nextPieceCanvas, {
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
      <div className={styles.bottom}>
        {DoubleBorderResponsive(
          <Box className={styles.linesCleared}>
            <p style={{ marginBottom: "0.5em" }}>Lines Cleared</p>
            <p>{linesCleared}</p>
          </Box>,
          { className: styles.linesClearedContainer }
        )}
      </div>
    </>
  );

  return (
    <div ref={containerRef} className={styles.gameComponent}>
      {orientation === "landscape" ? landscapeUi : portraitUi}
    </div>
  );
}
