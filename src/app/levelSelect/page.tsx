"use client";

import Button from "../../Components/UI/Buttons/Button";
import Heading from "../../Components/UI/Heading";
import { bidirectionalModulo } from "../../utils";
import styles from "./levelSelect.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LevelSelect() {
  const router = useRouter();
  const [selectionIndex, setSelectionIndex] = useState<number | null>(null);
  const numLevels = 10;
  const numColumns = 5;

  const handleKeyDown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowUp":
        setSelectionIndex((prevIndex) =>
          prevIndex || prevIndex === 0
            ? bidirectionalModulo(prevIndex - numColumns + numLevels, numLevels)
            : 0
        );
        break;
      case "ArrowDown":
        setSelectionIndex((prevIndex) =>
          prevIndex || prevIndex === 0
            ? bidirectionalModulo(prevIndex + numColumns, numLevels)
            : 0
        );
        break;
      case "ArrowLeft":
        setSelectionIndex((prevIndex) =>
          prevIndex || prevIndex === 0
            ? bidirectionalModulo(prevIndex - 1 + numLevels, numLevels)
            : 0
        );
        break;
      case "ArrowRight":
        setSelectionIndex((prevIndex) =>
          prevIndex || prevIndex === 0
            ? bidirectionalModulo(prevIndex + 1, numLevels)
            : 0
        );
        break;
      case "Enter":
        if (selectionIndex) goToLevelSelect(selectionIndex);
        break;
      default:
        break;
    }
  };

  const handleMouseEnter = (index: number): void => {
    setSelectionIndex(index);
  };

  const goToLevelSelect = (level: number) => {
    const query = { startingLevel: level.toString() };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/game?${queryString}`);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectionIndex]);

  return (
    <div className={styles.root}>
      <Heading className={styles.heading}>Level Select</Heading>
      <div className={styles.levelSelect}>
        {Array.from({ length: 10 }, (_, i) => (
          <Button
            key={i}
            onMouseEnter={() => handleMouseEnter(i)}
            onClick={() => goToLevelSelect(i)}
            className={styles.levelButton}
            selectClassName={styles.selectedLevelButton}
            selected={i === selectionIndex}
          >
            {i.toString()}
          </Button>
        ))}
      </div>
    </div>
  );
}
