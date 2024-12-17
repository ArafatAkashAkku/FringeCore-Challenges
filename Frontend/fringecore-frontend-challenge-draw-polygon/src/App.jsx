import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [polygons, setPolygons] = useState([]); 
  const [currentPolygon, setCurrentPolygon] = useState([]); 
  const [draggingVertex, setDraggingVertex] = useState(null); 
  const [currentPolygonIndex, setCurrentPolygonIndex] = useState(null); 
  const canvasRef = useRef(null);

  const isNear = (x1, y1, x2, y2, threshold = 10) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) < threshold;
  };

  const handleCanvasClick = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };

    if (currentPolygon.length > 2 && isNear(newPoint.x, newPoint.y, currentPolygon[0].x, currentPolygon[0].y)) {
      setPolygons([...polygons, [...currentPolygon]]);
      setCurrentPolygon([]);
    } else {
      setCurrentPolygon([...currentPolygon, newPoint]);
    }
  };

  const handleMouseMove = (e) => {
    if (currentPolygon.length === 0 || draggingVertex !== null) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    setCurrentPolygon((prev) => {
      const previewPolygon = [...prev];
      previewPolygon.push(newPoint);
      return previewPolygon;
    });
    
  };

  const startDragging = (polygonIndex, vertexIndex, e) => {
    e.preventDefault();
    setDraggingVertex(vertexIndex);
    setCurrentPolygonIndex(polygonIndex);
  };

  const handleMouseMoveDuringDrag = (e) => {
    if (draggingVertex === null) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const updatedPolygons = [...polygons];
    const updatedPolygon = [...updatedPolygons[currentPolygonIndex]];

    updatedPolygon[draggingVertex] = { x: offsetX, y: offsetY };
    updatedPolygons[currentPolygonIndex] = updatedPolygon;

    setPolygons(updatedPolygons);
    handleMouseMove()
  };

  const stopDragging = () => {
    setDraggingVertex(null);
    setCurrentPolygonIndex(null);
  };

  const renderPolygons = () => {
    return polygons.map((polygon, polygonIndex) => {
      const points = polygon.map(point => `${point.x},${point.y}`).join(" ");
      return (
        <g key={polygonIndex}>
          <polygon
            points={points}
            fill="rgba(0, 0, 255, 0.3)"
            stroke="black"
            strokeWidth="2"
          />
          {polygon.map((point, vertexIndex) => (
            <circle
              key={vertexIndex}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="red"
              onMouseDown={(e) => startDragging(polygonIndex, vertexIndex, e)}
            />
          ))}
        </g>
      );
    });
  };

  const renderPreview = () => {
    if (currentPolygon.length > 1) {
      const points = currentPolygon.map(point => `${point.x},${point.y}`).join(" ");
      const lastPoint = currentPolygon[currentPolygon.length - 1];
      return (
        <polyline
          points={`${points} ${lastPoint.x},${lastPoint.y}`}
          fill="none"
          stroke="gray"
          strokeDasharray="5,5"
          strokeWidth="2"
        />
      );
    }
    return null;
  };

  return (
    <div className="App">
      <svg
        ref={canvasRef}
        className="drawing-area"
        width="100vw"
        height="100vh"
        onClick={handleCanvasClick}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onMouseMove={handleMouseMoveDuringDrag}
      >
        {renderPreview()}
        {renderPolygons()}
      </svg>
    </div>
  );
}

export default App;
