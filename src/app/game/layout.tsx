import React, { ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
};

export default function GameLayout({ children }: Props) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
