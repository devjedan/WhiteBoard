import React, { useRef, useEffect, useState } from "react";
import "./CanvasComponent.css";

interface CanvasProps {
  width: number;
  height: number;
}

const CanvasComponent: React.FC<CanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [eraseMode, setEraseMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("2D context not supported");
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    setContext(ctx);
  }, []);

  const handleMouseDown = () => {
    setDrawing(true);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    if (context) context.beginPath();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!drawing) return;

    if (context) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;

      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = eraseMode ? 20 : 5;
      context.strokeStyle = eraseMode ? "white" : color;

      if (eraseMode) {
        context.globalCompositeOperation = "destination-out";
      } else {
        context.globalCompositeOperation = "source-over";
      }

      context.lineTo(x, y);
      context.stroke();
    }
  };

  const toggleEraseMode = () => {
    setEraseMode(!eraseMode);
  };

  const clearCanvas = () => {
    if (context) {
      context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
  };

  const changeColor = (newColor: string) => {
    setColor(newColor);
  };

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <h1>Whiteboard</h1>
        <div className="color-picker">
          <input
            type="color"
            value={color}
            onChange={(e) => changeColor(e.target.value)}
            className="color-input"
          />
          <button onClick={toggleEraseMode}>
            {eraseMode ? "Draw" : "Erase"}
          </button>
          <button onClick={clearCanvas}>Clear</button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="whiteboard-canvas"
      />
    </div>
  );
};

export default CanvasComponent;
