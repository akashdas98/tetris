"use client";

import React, { Suspense } from "react";
import styles from "./game.module.css";
import GameComponent from "../../Components/GameComponent";
import { useSearchParams } from "next/navigation";

export default function Game() {
  const searchParams = useSearchParams();
  const startingLevelParam = searchParams.get("startingLevel");
  const startingLevel: number = Number(startingLevelParam);

  return (
    <div className={styles.gameContainer}>
      <GameComponent
        startingLevel={!Number.isNaN(startingLevel) ? startingLevel : 6}
      />
    </div>
  );
}
