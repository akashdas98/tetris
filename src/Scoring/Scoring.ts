export default class Scoring {
  private score: number;
  private baseScoreMap: Record<number, number>;
  private display: HTMLElement;

  constructor(display: HTMLElement) {
    this.display = display;
    this.score = 0;
    this.updateDisplay();
    this.baseScoreMap = {
      0: 0,
      1: 40,
      2: 100,
      3: 200,
      4: 1200,
    };
  }

  private updateDisplay = (): void => {
    this.display.innerText = this.score.toString();
  };

  public getScore = (): number => this.score;

  public addScore = (clearedLines: number, level: number) => {
    this.score += this.baseScoreMap[clearedLines] * (level + 1);
    this.updateDisplay();
  };
}
