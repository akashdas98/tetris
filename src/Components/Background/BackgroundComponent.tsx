"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import styles from "./background.module.css";
import BackgroundCanvasComponent from "./BackgroundCanvasComponent";
import { areValuesClosePercentage } from "../../utils";

type Props = {
  children?: ReactNode;
};

export default function Background({ children }: Props) {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.background}>
        <div className={styles.canvasContainer}>
          <BackgroundCanvasComponent />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
