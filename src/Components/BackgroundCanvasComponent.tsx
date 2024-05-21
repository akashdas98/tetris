import React, { useRef, useEffect, useState } from "react";
import { areValuesClosePercentage } from "../utils";
import BackgroundCanvas from "../Classes/BackgroundCanvas/BackgroundCanvas";

export default function BackgroundCanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<BackgroundCanvas | null>(null);
  const [isClient, setIsClient] = useState(false);

  const getCanvasScale = () => {
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

  const initializeCanvas = (): void => {
    const scale = getCanvasScale();
    const cols = Math.ceil(canvasRef.current!.clientWidth / scale);
    const rows = Math.ceil(canvasRef.current!.clientHeight / scale);
    bgCanvasRef.current = new BackgroundCanvas(
      canvasRef.current!,
      scale,
      rows,
      cols
    );
    bgCanvasRef.current.generateBackground();
  };

  const updateCanvas = () => {
    const bgCanvas = bgCanvasRef.current;
    const scale = getCanvasScale();
    const cols = Math.ceil(canvasRef.current!.clientWidth / scale);
    const rows = Math.ceil(canvasRef.current!.clientHeight / scale);
    bgCanvas!.setScale(scale);
    bgCanvas!.resizeMatrix(rows, cols);
    bgCanvas!.generateBackground();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!bgCanvasRef.current) {
        initializeCanvas();
      }
      window.addEventListener("resize", updateCanvas);
      return () => {
        window.removeEventListener("resize", updateCanvas);
      };
    }
  }, [isClient]);

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
