import {
  ChangeEventHandler,
  MouseEventHandler,
  SyntheticEvent,
  useState,
  useMemo,
  useCallback,
} from "react";
import { BoxEraser, CircleEraser, ConnectedEraser, getX, getY } from "./lib";
import { useCanvas } from "./lib/hooks";

const App = () => {
  const [uploaded, setUploaded] = useState(false);
  const [threshold, setThreshold] = useState<number>(25);
  const [size, setSize] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMouseTap, setIsMouseTap] = useState(false);
  const [selectedEraserIndex, setSelectedEraserIndex] = useState(0);

  const { canvasRef, init, save, undo, redo } = useCanvas();

  const canvas = canvasRef.current;

  const erasers = useMemo(() => [ConnectedEraser, CircleEraser, BoxEraser], []);

  const Eraser = erasers[selectedEraserIndex];

  const handleFileChange = useCallback(
    async (e: SyntheticEvent) => {
      const file = (e.target as HTMLInputElement & { files: FileList })
        .files?.[0];
      console.log(canvas, init);
      if (canvas && file) {
        await init(file);
        setUploaded(true);
      }
    },
    [canvas, init]
  );

  const handleCanvasClick: MouseEventHandler<HTMLCanvasElement> = async (e) => {
    if (isProcessing || !canvas) return;
    const x = getX(canvas, e.clientX);
    const y = getY(canvas, e.clientY);

    if (x && y) {
      setIsProcessing(true);
      const eraser = new Eraser(x, y, {
        threshold,
        size,
        radius: size,
      });
      await eraser.erase(canvas);
      save();
      setIsProcessing(false);
    }
  };

  const handleCanvasMouseMove: MouseEventHandler<HTMLCanvasElement> = async (
    e
  ) => {
    if (!isMouseTap || isProcessing || !canvas) return;
    const x = getX(canvas, e.clientX);
    const y = getY(canvas, e.clientY);

    if (x && y) {
      const eraser = new Eraser(x, y, {
        threshold,
        size,
        radius: size,
      });

      if (eraser.longPress) {
        setIsProcessing(true);
        await eraser.erase(canvas);
        save();
        setIsProcessing(false);
      }
    }
  };

  const handleThresholdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setThreshold(+e.target.value);
  };

  function saveCanvasAsImage() {
    if (!canvas) return;
    // Create an "a" element to act as a link for downloading the image
    const link = document.createElement("a");

    // Set the href attribute of the link to the data URL of the canvas image
    link.href = canvas.toDataURL();

    // Set the download attribute of the link to specify the filename
    link.download = "canvas_image.png";

    // Programmatically click the link to trigger the download
    link.click();
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `min-content auto`,
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <input type="file" onChange={handleFileChange} />
        <div>
          <span>Type</span>
          <select onChange={(e) => setSelectedEraserIndex(+e.target.value)}>
            {erasers.map((eraser, i) => {
              return <option value={i}>{eraser.name}</option>;
            })}
          </select>
        </div>
        <div>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>
        <div>
          <span>Size</span>
          <select value={size} onChange={(e) => setSize(+e.target.value)}>
            <option value="5">Small</option>
            <option value="10">Medium</option>
            <option value="20">Large</option>
          </select>
        </div>
        <div>
          <span>Threshold</span>
          <input
            type="number"
            value={threshold}
            onChange={handleThresholdChange}
          />
        </div>
        <button onClick={saveCanvasAsImage}>Save</button>
      </div>
      <main
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!uploaded && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ color: "white" }}>Upload your image</div>
          </div>
        )}
        <canvas
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={() => setIsMouseTap(true)}
          onMouseUp={() => setIsMouseTap(false)}
        />
      </main>
    </div>
  );
};

export default App;
