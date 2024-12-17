import React, { useRef, useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tool, setTool] = useState();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const drawing = useRef(false);
  const lines = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 40; 
    canvas.height = window.innerHeight - 100; 
    contextRef.current = canvas.getContext("2d");
    contextRef.current.lineCap = "round";
    contextRef.current.lineJoin = "round";
    contextRef.current.lineWidth = 5;
  }, []);

  const startDrawing = (e) => {
    if (tool === "pen") {
      drawing.current = true;
      const { offsetX, offsetY } = e.nativeEvent;
      lines.current.push([{ x: offsetX, y: offsetY }]);
    } else if (tool === "erase") {
      const { offsetX, offsetY } = e.nativeEvent;
      eraseLine(offsetX, offsetY); 
    }
  };

  const draw = (e) => {
    if (!drawing.current) return;

    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pen") {
      const currentLine = lines.current[lines.current.length - 1];
      currentLine.push({ x: offsetX, y: offsetY });
      contextRef.current.beginPath();
      contextRef.current.moveTo(currentLine[currentLine.length - 2].x, currentLine[currentLine.length - 2].y);
      contextRef.current.lineTo(currentLine[currentLine.length - 1].x, currentLine[currentLine.length - 1].y);
      contextRef.current.stroke();
    } else if (tool === "erase") {
      const { offsetX, offsetY } = e.nativeEvent;
      eraseLine(offsetX, offsetY); 
    }
  };

  const eraseLine = (x, y) => {
    for (let i = 0; i < lines.current.length; i++) {
      const line = lines.current[i];
      for (let j = 1; j < line.length; j++) {
        const start = line[j - 1];
        const end = line[j];
        const dist = distanceToLine(x, y, start.x, start.y, end.x, end.y);
        if (dist < 10) {
          lines.current.splice(i, 1); 
          redrawCanvas(); 
          return;
        }
      }
    }
  };

  const distanceToLine = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;
    let closestX, closestY;

    if (param < 0) {
      closestX = x1;
      closestY = y1;
    } else if (param > 1) {
      closestX = x2;
      closestY = y2;
    } else {
      closestX = x1 + param * C;
      closestY = y1 + param * D;
    }

    const dx = x - closestX;
    const dy = y - closestY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const redrawCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    lines.current.forEach((line) => {
      contextRef.current.beginPath();
      contextRef.current.moveTo(line[0].x, line[0].y);
      line.forEach((point, index) => {
        if (index > 0) {
          contextRef.current.lineTo(point.x, point.y);
          contextRef.current.stroke();
        }
      });
    });
  };

  const stopDrawing = () => {
    if (tool === "pen") {
      drawing.current = false;
    }
  };

  const handleToolChange = (newTool) => {
    setTool(newTool);
  };

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={() => handleToolChange("pen")}>🖊️ Pen</button>
        <button onClick={() => handleToolChange("erase")}>🧹 Erase</button>
      </div>
      <canvas
        ref={canvasRef}
        className="canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

export default App;
