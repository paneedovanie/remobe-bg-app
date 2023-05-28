export const isColorMatch = (
  pixel1: number,
  pixel2: number,
  threshold: number
) => {
  if (pixel1 === 0) return false;
  const r1 = (pixel1 >> 16) & 0xff;
  const g1 = (pixel1 >> 8) & 0xff;
  const b1 = pixel1 & 0xff;

  const r2 = (pixel2 >> 16) & 0xff;
  const g2 = (pixel2 >> 8) & 0xff;
  const b2 = pixel2 & 0xff;

  const deltaR = Math.abs(r1 - r2);
  const deltaG = Math.abs(g1 - g2);
  const deltaB = Math.abs(b1 - b2);

  return deltaR <= threshold && deltaG <= threshold && deltaB <= threshold;
};
