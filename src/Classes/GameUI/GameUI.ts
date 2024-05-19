export default abstract class GameUI {
  protected onChange?: (...args: any[]) => any;

  constructor(cb?: (...args: any[]) => any) {
    this.onChange = cb;
  }
}
