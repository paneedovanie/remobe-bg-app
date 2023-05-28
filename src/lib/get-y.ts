export const getY = (canvas: HTMLCanvasElement, clientY: number) => {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect) return;
  return Math.round((clientY - rect.top) * (canvas.height / rect.height));
};
