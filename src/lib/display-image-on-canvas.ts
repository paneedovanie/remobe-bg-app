export const displayImageOnCanvas = (canvas: HTMLCanvasElement, file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(undefined);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
