import { BaseEraser, isColorMatch } from ".";
import { BaseEraserOptions, Coordinates } from "./types";

export class ConnectedEraser extends BaseEraser {
  constructor(x: number, y: number, options?: BaseEraserOptions) {
    options = {
      threshold: 25,
      radius: 10,
      size: 10,
      longPress: false,
      ...options,
    };
    super(x, y, options);
  }

  erase(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = new Uint32Array(imageData.data.buffer);
    const targetIndex = this.y * canvas.width + this.x;
    const targetPixel = pixels[targetIndex];

    if (targetPixel === 0) return;

    const queue: Coordinates[] = [];
    const visited = new Array(canvas.width * canvas.height).fill(false);

    queue.push({ x: this.x, y: this.y });

    while (queue.length > 0) {
      const { x, y } = queue.shift() as Coordinates;
      const index = y * canvas.width + x;
      const pixel = pixels[index];

      if (isColorMatch(pixel, targetPixel, this.threshold)) {
        // Remove the color of the connected pixel
        pixels[index] = 0; // Set alpha to 0

        visited[index] = true;

        const neighbors = [
          { x: x - 1, y }, // Left
          { x: x + 1, y }, // Right
          { x, y: y - 1 }, // Top
          { x, y: y + 1 }, // Bottom
        ];

        for (const neighbor of neighbors) {
          const { x: nx, y: ny } = neighbor;
          const neighborIndex = ny * canvas.width + nx;
          if (
            nx >= 0 &&
            nx < canvas.width &&
            ny >= 0 &&
            ny < canvas.height &&
            !visited[neighborIndex] &&
            isColorMatch(pixels[neighborIndex], targetPixel, this.threshold)
          ) {
            queue.push(neighbor);
          }
        }
      }
    }

    // Update the image data with the modified pixels
    ctx.putImageData(imageData, 0, 0);
  }
}
