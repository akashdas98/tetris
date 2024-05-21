"use client";

import { useRouter } from "next/navigation";
import Button from "./UI/Buttons/Button";

export default function MainMenu() {
  const router = useRouter();

  const goToLevelSelect = () => {
    router.push("/levelSelect");
  };

  return (
    <div>
      <Button onClick={goToLevelSelect}>New Game</Button>
    </div>
  );
}
