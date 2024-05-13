export default class Level {
  private currentLevel: number;
  private startingLevel: number;
  private linesForNextLevelUp: number;
  private levelSpeedList: number[];
  private display: HTMLElement;

  constructor(startingLevel: number, display: HTMLElement) {
    this.display = display;
    this.startingLevel = startingLevel;
    this.currentLevel = startingLevel;
    this.updateDisplay();
    this.linesForNextLevelUp = Math.min(
      this.startingLevel * 10 + 10,
      Math.max(100, this.startingLevel * 10 - 50)
    );
    this.levelSpeedList = [
      800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67,
      50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17,
    ];
  }

  private updateDisplay = (): void => {
    this.display.innerText = this.currentLevel.toString();
  };

  public getCurrentLevel = (): number => this.currentLevel;

  public updateLevel = (totalLinesCleared: number): void => {
    if (totalLinesCleared >= this.linesForNextLevelUp) {
      this.currentLevel++;
      this.linesForNextLevelUp += 10;

      this.updateDisplay();
    }
  };

  public getCurrentSpeed = (): number =>
    this.currentLevel >= 29
      ? this.levelSpeedList[29]
      : this.levelSpeedList[this.currentLevel];
}
