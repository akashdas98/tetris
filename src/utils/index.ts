export { mutifyHexColor, lightenHexColor } from "./colorUtil";

export function shuffle(array: any[]): any[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function areValuesClosePercentage(
  value1: number,
  value2: number,
  percentageTolerance: number = 1
) {
  if (value1 === 0 && value2 === 0) return true;
  if (value1 === 0 || value2 === 0) return false;

  const difference = Math.abs(value1 - value2);
  const average = (Math.abs(value1) + Math.abs(value2)) / 2;
  const percentageDifference = (difference / average) * 100;

  return percentageDifference <= percentageTolerance;
}

export function bidirectionalModulo(n: number, mod: number) {
  return ((n % mod) + mod) % mod;
}

export function importantStyleString(styles: React.CSSProperties): string {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value} !important;`)
    .join(" ");
}
