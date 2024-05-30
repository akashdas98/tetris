"use client";

import styles from "./mainMenu.module.css";
import { useRouter } from "next/navigation";
import RetroButton from "./UI/Buttons/RetroButton";
import { useEffect, useState } from "react";
import { bidirectionalModulo } from "../utils";
import theme from "../theme";
import { UiSize } from "../Types/UITypes";

export default function MainMenu() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [uiSize, setUiSize] = useState<UiSize>("small");

  const goToLevelSelect = (): void => {
    router.push("/levelSelect");
  };

  const buttons = [
    {
      content: "New Game",
      onClick: goToLevelSelect,
    },
    {
      content: "Placeholder",
      onClick: goToLevelSelect,
    },
  ];

  const selectNext = (): void =>
    setSelectedIndex(
      bidirectionalModulo((selectedIndex ?? -1) + 1, buttons.length)
    );

  const selectPrev = (): void =>
    setSelectedIndex(
      bidirectionalModulo((selectedIndex ?? -1) - 1, buttons.length)
    );

  const handleInput = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowDown":
        selectNext();
        break;
      case "ArrowUp":
        selectPrev();
        break;
      case "Enter":
        if (selectedIndex || selectedIndex === 0) {
          buttons[selectedIndex]?.onClick();
        }
        break;
      default:
        break;
    }
  };

  const handleResize = () => {
    const size =
      window.innerWidth > 2000
        ? "large"
        : window.innerWidth > 600
        ? "medium"
        : "small";
    setUiSize(size);
  };

  const handleHover = (index: number): void => setSelectedIndex(index);

  useEffect(() => {
    window.addEventListener("keydown", handleInput);
    return () => window.removeEventListener("keydown", handleInput);
  }, [selectedIndex]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.root}>
      {buttons.map((button, i) => (
        <RetroButton
          onClick={button.onClick}
          selected={i === selectedIndex}
          key={i}
          rootProps={{
            style: {
              margin: theme.size.medium.base,
            },
          }}
          onMouseEnter={() => handleHover(i)}
          size={uiSize}
        >
          {button.content}
        </RetroButton>
      ))}
    </div>
  );
}
