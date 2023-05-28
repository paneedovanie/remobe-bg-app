export const getX = (canvas: HTMLCanvasElement, clientX: number) => {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect) return;
  return Math.round((clientX - rect.left) * (canvas.width / rect.width));
};
