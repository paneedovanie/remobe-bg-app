import { useRef, useState, useEffect, useCallback } from "react";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const init = useCallback(
    (file: File) => {
      const canvas = canvasRef.current;

      if (!canvas) return;
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = function (event) {
          const img = new Image();
          img.onload = function () {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            setHistory([imageData]);
            setActiveIndex(0);
            resolve(undefined);
          };
          img.src = event.target?.result as string;
        };

        reader.readAsDataURL(file);
      });
    },
    [ctx]
  );

  const save = () => {
    const canvas = canvasRef.current;

    if (!ctx || !canvas) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    setHistory((v) => {
      v.splice(activeIndex + 1);
      return [...v, imageData];
    });
    setActiveIndex((v) => v + 1);
  };

  const undo = () => {
    const index = activeIndex > 0 ? activeIndex - 1 : activeIndex;
    setActiveIndex(index);
    ctx?.putImageData(history[index], 0, 0);
  };

  const redo = () => {
    const index =
      activeIndex < history.length - 1 ? activeIndex + 1 : activeIndex;
    setActiveIndex(index);
    ctx?.putImageData(history[index], 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    setCtx(ctx);
  }, []);

  useEffect(() => {
    const index = history.length - 1;
    setActiveIndex(index > -1 ? index : 0);
  }, [history]);

  return { canvasRef, history, init, save, undo, redo };
};
