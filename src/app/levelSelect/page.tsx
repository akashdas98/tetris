"use client";

import Button from "../../Components/UI/Buttons/Button";
import Heading from "../../Components/UI/Heading";
import styles from "./levelSelect.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const router = useRouter();

  const goToLevelSelect = (level: number) => {
    const query = { startingLevel: level.toString() };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/game?${queryString}`);
  };

  const selectLevel = (lv: number) => setSelectedLevel(lv);

  return (
    <div className={styles.root}>
      <Heading>Level Select</Heading>
      <div className={styles.levelSelect}>
        {Array.from({ length: 10 }, (_, i) => (
          <Button
            key={i}
            onClick={() => goToLevelSelect(i)}
            onMouseEnter={() => selectLevel(i)}
            className={styles.levelButton}
          >
            {i.toString()}
          </Button>
        ))}
      </div>
    </div>
  );
}
