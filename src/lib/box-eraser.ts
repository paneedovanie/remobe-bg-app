import { BaseEraser } from ".";
import { BaseEraserOptions } from "./types";

export class BoxEraser extends BaseEraser {
  private left: number;
  private top: number;
  private right: number;
  private bottom: number;

  constructor(x: number, y: number, options?: BaseEraserOptions) {
    options = {
      threshold: 25,
      radius: 10,
      size: 10,
      longPress: true,
      ...options,
    };
    super(x, y, options);
    this.left = x - this.size / 2;
    this.top = y - this.size / 2;
    this.right = x + this.size / 2;
    this.bottom = y + this.size / 2;
  }

  erase(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(
      this.left,
      this.top,
      this.right - this.left,
      this.bottom - this.top
    );

    const data = imageData.data;
    const length = data.length;

    for (let i = 3; i < length; i += 4) {
      data[i] = 0; // Set alpha value to 0 (transparent)
    }

    ctx.putImageData(imageData, this.left, this.top);
  }
}
