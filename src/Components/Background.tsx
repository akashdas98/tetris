"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import styles from "../style/background.module.css";
import BackgroundCanvas from "./BackgroundCanvas";
import { areValuesClosePercentage } from "../utils";

type Props = {};

export default function Background({}: Props) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (!canvasContainerRef.current) return;
    canvasContainerRef.current.style.visibility = "visible";
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width >= 1200) {
      if (areValuesClosePercentage(width, height, 25)) {
        const minDim = Math.min(width, height);
        canvasContainerRef.current.style.width = `${0.9 * minDim}px`;
        canvasContainerRef.current.style.height = `${0.9 * minDim}px`;
        canvasContainerRef.current.style.border = "15px solid #cd712e";
      } else if (width > height) {
        canvasContainerRef.current.style.width = `${0.7 * width}px`;
        canvasContainerRef.current.style.height = `${0.9 * height}px`;
        canvasContainerRef.current.style.border = "15px solid #cd712e";
      } else {
        canvasContainerRef.current.style.width = `${0.9 * width}px`;
        canvasContainerRef.current.style.height = `${0.9 * height}px`;
        canvasContainerRef.current.style.border = "15px solid #cd712e";
      }
    } else {
      canvasContainerRef.current.style.width = "100%";
      canvasContainerRef.current.style.height = "100%";
      canvasContainerRef.current.style.border = "none";
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.background}>
      <div
        className={styles.canvasContainer}
        ref={canvasContainerRef}
        style={{ visibility: "hidden" }}
      >
        <BackgroundCanvas />
      </div>
    </div>
  );
}
