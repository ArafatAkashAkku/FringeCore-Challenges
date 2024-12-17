import React, { useState } from "react";

const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Pane = ({ pane, onSplit, onRemove, onResize }) => {
  const handleMouseDown = (e, direction, paneIndex) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      onResize(pane.id, direction === "vertical" ? deltaX : deltaY, direction, paneIndex);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="relative flex items-center justify-center border"
      style={{
        flex: pane.size,
        backgroundColor: pane.color,
      }}
    >
      {!pane.children ? (
        <>
          <div className="absolute flex items-center justify-center top-0 left-0 right-0 bottom-0">
            <div className="flex space-x-2">
              <button
                className="bg-white text-black px-2 py-1 rounded-md shadow-md"
                onClick={() => onSplit(pane.id, "horizontal")}
              >
                h
              </button>
              <button
                className="bg-white text-black px-2 py-1 rounded-md shadow-md"
                onClick={() => onSplit(pane.id, "vertical")}
              >
                v
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md shadow-md"
                onClick={() => onRemove(pane.id)}
              >
                -
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          className={`w-full h-full flex ${
            pane.direction === "horizontal" ? "flex-col" : "flex-row"
          }`}
        >
          {pane.children.map((child, index) => (
            <React.Fragment key={child.id}>
              <Pane
                pane={child}
                onSplit={onSplit}
                onRemove={onRemove}
                onResize={onResize}
              />
              {index < pane.children.length - 1 && (
                <div
                  className={`${
                    pane.direction === "horizontal"
                      ? "h-2 cursor-row-resize"
                      : "w-2 cursor-col-resize"
                  } bg-gray-500`}
                  onMouseDown={(e) =>
                    handleMouseDown(
                      e,
                      pane.direction === "horizontal" ? "horizontal" : "vertical",
                      index
                    )
                  }
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [panes, setPanes] = useState([
    { id: 1, size: 1, color: randomColor(), children: null, direction: null },
  ]);

  const splitPane = (id, direction) => {
    const updatePane = (pane) => {
      if (pane.id === id) {
        return {
          ...pane,
          direction,
          children: [
            {
              id: Date.now(),
              size: 1,
              color: randomColor(),
              children: null,
              direction: null,
            },
            {
              id: Date.now() + 1,
              size: 1,
              color: randomColor(),
              children: null,
              direction: null,
            },
          ],
        };
      }
      if (pane.children) {
        return {
          ...pane,
          children: pane.children.map(updatePane),
        };
      }
      return pane;
    };

    setPanes((prevPanes) => prevPanes.map(updatePane));
  };

  const removePane = (id) => {
    const updatePane = (pane) => {
      if (pane.children) {
        const filteredChildren = pane.children.filter((child) => child.id !== id);
        if (filteredChildren.length === 0) {
          return {
            ...pane,
            children: null,
            direction: null,
          };
        }
        return {
          ...pane,
          children: filteredChildren.map(updatePane),
        };
      }
      return pane;
    };

    setPanes((prevPanes) => prevPanes.map(updatePane));
  };

  const resizePane = (id, delta, direction, index) => {
    const updatePane = (pane) => {
      if (pane.children) {
        const updatedChildren = [...pane.children];
        if (direction === "horizontal") {
          updatedChildren[index].size = Math.max(
            0.1,
            updatedChildren[index].size + delta / 100
          );
        } else {
          updatedChildren[index + 1].size = Math.max(
            0.1,
            updatedChildren[index + 1].size - delta / 100
          );
        }
        return {
          ...pane,
          children: updatedChildren.map(updatePane),
        };
      }
      return pane;
    };

    setPanes((prevPanes) => prevPanes.map(updatePane));
  };

  return (
    <div className="w-screen h-screen flex">
      {panes.map((pane) => (
        <Pane
          key={pane.id}
          pane={pane}
          onSplit={splitPane}
          onRemove={removePane}
          onResize={resizePane}
        />
      ))}
    </div>
  );
};

export default App;
