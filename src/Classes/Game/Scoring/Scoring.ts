import GameUI, { GameUIInterface } from "../../GameUI/GameUI";

export interface ScoringInterface extends GameUIInterface {
  cb?: (score: number) => any;
}
export default class Scoring extends GameUI {
  private score: number;
  private baseScoreMap: Record<number, number>;

  constructor({ cb }: ScoringInterface) {
    super({ cb });
    this.score = 0;
    this.baseScoreMap = {
      0: 0,
      1: 40,
      2: 100,
      3: 200,
      4: 1200,
    };
    this.onChange?.(this.score);
  }

  public getScore = (): number => this.score;

  public addScore = (clearedLines: number, level: number) => {
    this.score += this.baseScoreMap[clearedLines] * (level + 1);
    this.onChange?.(this.score);
  };
}
