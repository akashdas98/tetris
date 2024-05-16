import "../style/global.css";

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
      <body>{children}</body>
    </html>
  );
}
