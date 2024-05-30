"use client";

import React from "react";
import styles from "./game.module.css";
import GameComponent from "../../Components/GameComponent";
import { useSearchParams } from "next/navigation";

export default function Game() {
  return (
    <div className={styles.gameContainer}>
      <GameComponent />
    </div>
  );
}
