import { isColorMatch } from "./is-color-match";
import { Color, Coordinates } from "./types";

export const removeConnectedPixels = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  targetColor: Color = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  },
  threshold: number
) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = new Uint32Array(imageData.data.buffer);
  const targetIndex = y * canvas.width + x;
  const targetPixel = pixels[targetIndex];
  const color =
    (targetColor.a << 24) |
    (targetColor.b << 16) |
    (targetColor.g << 8) |
    targetColor.r;

  if (targetPixel === 0) return;

  const queue: Coordinates[] = [];
  const visited = new Array(canvas.width * canvas.height).fill(false);

  queue.push({ x, y });

  while (queue.length > 0) {
    const { x, y } = queue.shift() as Coordinates;
    const index = y * canvas.width + x;
    const pixel = pixels[index];

    if (isColorMatch(pixel, targetPixel, threshold)) {
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
          isColorMatch(pixels[neighborIndex], targetPixel, threshold)
        ) {
          queue.push(neighbor);
        }
      }
    }
  }

  // Update the image data with the modified pixels
  ctx.putImageData(imageData, 0, 0);
};
