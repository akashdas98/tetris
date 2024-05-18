"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import styles from "../style/background.module.css";
import BackgroundCanvas from "./BackgroundCanvas";

type Props = {};

export default function Background({}: Props) {
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (!backgroundContainerRef.current) return;
    backgroundContainerRef.current.style.visibility = "visible";
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const marginX = windowWidth / 6;
    const marginY = windowHeight / 12;
    backgroundContainerRef.current.style.margin = `${marginY}px ${marginX}px`;
    backgroundContainerRef.current.style.width = `calc(100% - ${
      2 * marginX
    }px)`;
    backgroundContainerRef.current.style.height = `calc(100% - ${
      2 * marginY
    }px)`;
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={styles.backgroundContainer}
      ref={backgroundContainerRef}
      style={{ visibility: "hidden" }}
    >
      <BackgroundCanvas />
    </div>
  );
}
