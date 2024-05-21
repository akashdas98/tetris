"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import styles from "./background.module.css";
import BackgroundCanvasComponent from "./BackgroundCanvasComponent";
import { areValuesClosePercentage } from "../utils";

type Props = {
  children?: ReactNode;
};

export default function Background({ children }: Props) {
  const bgRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (!bgRef.current) return;
    bgRef.current.style.visibility = "visible";
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width >= 1200) {
      if (areValuesClosePercentage(width, height, 25)) {
        const minDim = Math.min(width, height);
        bgRef.current.style.width = `${0.9 * minDim}px`;
        bgRef.current.style.height = `${0.9 * minDim}px`;
        bgRef.current.style.border = "15px solid #cd712e";
      } else if (width > height) {
        bgRef.current.style.width = `${0.7 * width}px`;
        bgRef.current.style.height = `${0.9 * height}px`;
        bgRef.current.style.border = "15px solid #cd712e";
      } else {
        bgRef.current.style.width = `${0.9 * width}px`;
        bgRef.current.style.height = `${0.9 * height}px`;
        bgRef.current.style.border = "15px solid #cd712e";
      }
    } else {
      bgRef.current.style.width = "100%";
      bgRef.current.style.height = "100%";
      bgRef.current.style.border = "none";
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
    <div className={styles.backgroundContainer}>
      <div
        className={styles.background}
        ref={bgRef}
        style={{ visibility: "hidden" }}
      >
        <div className={styles.canvasContainer}>
          <BackgroundCanvasComponent />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
