import { DocumentContext } from "next/document";
import Background from "../Components/Background/BackgroundComponent";
import "./global.css";
import { getCssVars } from "../utils";
import theme from "../theme";

export const metadata = {
  title: "Tetris",
  description: "Unofficial Tetris Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{getCssVars(theme)}</style>
      </head>
      <body>
        <Background>{children}</Background>
      </body>
    </html>
  );
}
