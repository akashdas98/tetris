import React, { useRef, useEffect, useState } from "react";
import { areValuesClosePercentage } from "../../utils";
import BackgroundCanvas from "../../Classes/BackgroundCanvas/BackgroundCanvas";

export default function BackgroundCanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<BackgroundCanvas | null>(null);

  const getCanvasScale = () => {
    const width = window.innerWidth;
    let scaleMultiplier = width >= 1200 ? 0.8 : 1;

    return Math.ceil(scaleMultiplier * 32);
  };

  const initializeCanvas = (): void => {
    const scale = getCanvasScale();
    const columns = Math.ceil(canvasRef.current!.clientWidth / scale);
    const rows = Math.ceil(canvasRef.current!.clientHeight / scale);
    bgCanvasRef.current = new BackgroundCanvas({
      canvas: canvasRef.current!,
      scale,
      rows,
      columns,
    });
    bgCanvasRef.current.generateBackground();
  };

  const handleResize = () => {
    const bgCanvas = bgCanvasRef.current;
    const scale = getCanvasScale();
    const cols = Math.ceil(canvasRef.current!.clientWidth / scale);
    const rows = Math.ceil(canvasRef.current!.clientHeight / scale);
    bgCanvas!.setScale(scale);
    bgCanvas!.resizeMatrix(rows, cols);
    bgCanvas!.generateBackground();
  };

  useEffect(() => {
    if (!bgCanvasRef.current) {
      initializeCanvas();
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        resizeObserver.unobserve(canvasRef.current);
      }
    };
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
