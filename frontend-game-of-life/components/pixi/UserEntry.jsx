import { Stage, Graphics } from "@inlet/react-pixi";

import React, { useCallback, useState, useEffect, useRef } from "react";
import useWindowDimensions from "../../src/useWindowDimensions";

const COLS = 5;
const ROWS = 5;

function UserEntryCell(props) {
  const { x, y, width, height, mouseDown, entry } = props;
  const xDim = height / COLS;
  const yDim = width / ROWS;

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(0xffffff, 1);
      g.drawRect(xDim * x, yDim * y, xDim, yDim);
      g.endFill();

      const handleOnMouseDownOver = () => {
        entry.current[y * ROWS + x] ^= 1;
        g.tint = entry.current[y * ROWS + x] == 1 ? 0x000000 : 0xffffff;
      };
      g.interactive = true;

      g.on("mousedown", (e) => {
        handleOnMouseDownOver();
      });
      g.on("mouseover", (e) => {
        if (mouseDown.current) {
          handleOnMouseDownOver();
        }
      });
    },
    [props]
  );

  return <Graphics draw={draw} />;
}

export default function UserEntry({ entry }) {
  const [mounted, setMounted] = useState(false);
  const mouseDown = useRef(false);
  let { width } = useWindowDimensions();
  width *= 0.8;
  const height = (ROWS / COLS) * width;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseDown = () => {
    mouseDown.current = true;
  };
  const handleMouseUp = () => {
    mouseDown.current = false;
  };

  console.log(entry);

  return (
    <>
      {mounted && (
        <Stage
          width={width}
          height={height}
          options={{ backgroundColor: 0xffffff, antialias: true }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {entry.current.map((e, i) => (
            <UserEntryCell
              x={parseInt(i / ROWS)}
              y={i % ROWS}
              width={width}
              height={height}
              mouseDown={mouseDown}
              entry={entry}
            />
          ))}
        </Stage>
      )}
    </>
  );
}
