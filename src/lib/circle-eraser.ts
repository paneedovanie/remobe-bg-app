import { BaseEraser } from ".";
import { BaseEraserOptions } from "./types";

export class CircleEraser extends BaseEraser {
  constructor(x: number, y: number, options?: BaseEraserOptions) {
    options = {
      threshold: 25,
      radius: 10,
      size: 10,
      longPress: true,
      ...options,
    };
    super(x, y, options);
  }

  erase(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );

    const data = imageData.data;
    const centerX = this.radius;
    const centerY = this.radius;
    const radiusSquared = this.radius * this.radius;

    for (let x = 0; x < this.radius * 2; x++) {
      for (let y = 0; y < this.radius * 2; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared <= radiusSquared) {
          const index = (y * this.radius * 2 + x) * 4;
          data[index + 3] = 0; // Set alpha value to 0 (transparent)
        }
      }
    }

    ctx.putImageData(imageData, this.x - this.radius, this.y - this.radius);
  }
}
