"use client";

import Button from "../../Components/UI/Buttons/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const [level, setLevel] = useState<number>(0);
  const router = useRouter();
  const levels = new Array(30);

  const goToLevelSelect = () => {
    const query = { startingLevel: level.toString() };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/game?${queryString}`);
  };

  const selectLevel = (lv: number) => setLevel(lv);

  return (
    <div>
      {Array.from({ length: 10 }, (_, i) => (
        <Button
          key={i}
          onClick={goToLevelSelect}
          onMouseEnter={() => selectLevel(i)}
        >
          {i.toString()}
        </Button>
      ))}
    </div>
  );
}
