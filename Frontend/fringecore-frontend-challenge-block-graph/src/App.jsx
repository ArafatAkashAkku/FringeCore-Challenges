import React, { useState } from "react";
import Block from "./Block";

export default function App() {
  const [blocks, setBlocks] = useState([
    { id: 0, x: Math.random() * window.innerWidth * 0.7, y: Math.random() * window.innerHeight * 0.7, parentId: null },
  ]);

  const addBlock = (parentId) => {
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        id: prevBlocks.length,
        x: Math.random() * window.innerWidth * 0.7,
        y: Math.random() * window.innerHeight * 0.7,
        parentId,
      },
    ]);
  };

  const updateBlockPosition = (id, x, y) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, x, y } : block
      )
    );
  };

  return (
    <div className="relative w-screen h-screen bg-pink-200 overflow-hidden">
      {blocks.map((block) =>
        block.parentId !== null ? (
          <svg
            className="absolute w-full h-full pointer-events-none"
            key={`line-${block.id}`}
          >
            <line
              x1={blocks[block.parentId].x + 50} 
              y1={blocks[block.parentId].y + 50}
              x2={block.x + 50}
              y2={block.y + 50}
              stroke="black"
              strokeDasharray="4"
              strokeWidth="2"
            />
          </svg>
        ) : null
      )}
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          onAddChild={() => addBlock(block.id)}
          onMove={updateBlockPosition}
        />
      ))}
    </div>
  );
}