import { BaseEraserOptions } from "./types";

export abstract class BaseEraser {
  constructor(
    public x: number,
    public y: number,
    protected options: BaseEraserOptions
  ) {}

  get longPress() {
    return this.options.longPress ?? false;
  }

  get size() {
    return this.options.size ?? 10;
  }

  get threshold() {
    return this.options.threshold ?? 25;
  }

  get radius() {
    return this.options.radius ?? 10;
  }

  erase(_: HTMLCanvasElement) {
    console.log(_);
  }
}
