export interface GameUIInterface {
  cb?: (...args: any[]) => any;
}

export default abstract class GameUI {
  protected onChange?: GameUIInterface["cb"];

  constructor({ cb }: GameUIInterface) {
    this.onChange = cb;
  }
}
