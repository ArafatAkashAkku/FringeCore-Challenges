import React, { useState } from "react";

export default function Block({ block, onAddChild, onMove }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - block.x, y: e.clientY - block.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    onMove(block.id, e.clientX - offset.x, e.clientY - offset.y);
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      className="absolute w-24 h-24 bg-pink-500 rounded-lg shadow-md text-center flex flex-col items-center justify-center text-white font-bold cursor-pointer select-none"
      style={{ top: block.y, left: block.x }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="text-2xl">{block.id}</div>
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onAddChild();
        }}
        className="mt-2 px-4 py-2 bg-pink-700 hover:bg-pink-800 rounded-md"
      >
        +
      </button>
    </div>
  );
}
