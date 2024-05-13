export function matrixMultiply(a: number[][], b: number[]) {
  let c = [a[0][0] * b[0] + a[0][1] * b[1], a[1][0] * b[0] + a[1][1] * b[1]];
  return c;
}
