import GameUI from "../../Classes/GameUI/GameUI";

export default class Level extends GameUI {
  private currentLevel: number;
  private startingLevel: number;
  private linesForNextLevelUp: number;
  private levelSpeedList: number[];

  constructor(startingLevel: number, cb?: (...args: any[]) => any) {
    super(cb);
    this.startingLevel = startingLevel;
    this.currentLevel = startingLevel;
    this.linesForNextLevelUp = Math.min(
      this.startingLevel * 10 + 10,
      Math.max(100, this.startingLevel * 10 - 50)
    );
    this.levelSpeedList = [
      800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67,
      50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17,
    ];
    this.onChange?.(this.currentLevel);
  }

  public getCurrentLevel = (): number => this.currentLevel;

  public updateLevel = (totalLinesCleared: number): void => {
    if (totalLinesCleared >= this.linesForNextLevelUp) {
      this.currentLevel++;
      this.linesForNextLevelUp += 10;
      this.onChange?.(this.currentLevel);
    }
  };

  public getCurrentSpeed = (): number =>
    this.currentLevel >= 29
      ? this.levelSpeedList[29]
      : this.levelSpeedList[this.currentLevel];
}
