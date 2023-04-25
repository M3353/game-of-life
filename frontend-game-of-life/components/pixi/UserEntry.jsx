import { Stage, Graphics } from "@inlet/react-pixi";
import { Box } from "@mui/material";

import React, { useCallback, useState, useEffect, useRef } from "react";
import useWindowDimensions from "../../src/useWindowDimensions";

const COLS = 5;
const ROWS = 5;

function UserEntryCell(props) {
  const { x, y, width, height, mouseDown, lastTouches, submission, id } = props;
  const [changedBoard, setChangedBoard] = useState(false);

  const xDim = width / COLS;
  const yDim = height / ROWS;
  const entry = submission.current.entry;
  const idx = y * COLS + x;

  useEffect(() => {
    entry[idx] = 0;
    setChangedBoard(true);
  }, [id]);

  const draw = useCallback(
    (g) => {
      g.clear();
      g.removeAllListeners();

      // clear on board resubmission, but not resize
      if (changedBoard) {
        g.tint = 0xffffff;
        setChangedBoard(false);
      }

      g.beginFill(0xffffff, 1);
      g.drawRect(xDim * x, yDim * y, xDim, yDim);
      g.endFill();

      const handleToggleCell = () => {
        entry[idx] ^= 1;
        g.tint = entry[idx] == 1 ? 0x000000 : 0xffffff;
      };

      g.interactive = true;
      // mouse events
      g.on("mousedown", (e) => {
        handleToggleCell();
      });
      g.on("mouseover", (e) => {
        if (mouseDown.current) {
          handleToggleCell();
        }
      });
      // touch events
      g.on("touchstart", (e) => {
        const touchEvent = e.data.originalEvent;
        touchEvent.preventDefault();
        [...touchEvent.changedTouches].forEach((touch) => {
          handleToggleCell();
        });
      });

      if ([...lastTouches.values()].includes(idx)) handleToggleCell();
    },
    [width, height, changedBoard, lastTouches]
  );

  return <Graphics draw={draw} />;
}

export default function UserEntry(props) {
  const { submission, id } = props;
  const [mounted, setMounted] = useState(false);
  const [lastTouches, setLastTouches] = useState(new Map());
  const mouseDown = useRef(false);
  let { width } = useWindowDimensions();
  width *= 0.7;
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

  const handleOnTouchMove = (e) => {
    const stageOffsetX = e.target.offsetLeft;
    const stageOffsetY = e.target.offsetTop;
    [...e.touches].forEach((touch) => {
      const idx =
        parseInt((touch.pageY - stageOffsetY) / (height / ROWS)) * COLS +
        parseInt((touch.pageX - stageOffsetX) / (width / COLS));
      if (lastTouches.get(touch.identifier) != idx) {
        setLastTouches(new Map([...lastTouches, [touch.identifier, idx]]));
      }
    });
  };

  const handleOnTouchEnd = (e) => {
    setLastTouches(new Map());
  };

  const drawBorder = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(5, 0x000000, 1);
      g.drawRect(0, 0, width, height);
    },
    [props, height]
  );

  return (
    <Box>
      {mounted && (
        <Stage
          width={width}
          height={height}
          options={{ backgroundColor: 0xffffff, antialias: true }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchMove={handleOnTouchMove}
          onTouchEnd={handleOnTouchEnd}
        >
          {submission.current.entry.map((e, i) => (
            <UserEntryCell
              id={id}
              key={i}
              y={parseInt(i / COLS)}
              x={i % COLS}
              width={width}
              height={height}
              mouseDown={mouseDown}
              lastTouches={lastTouches}
              submission={submission}
            />
          ))}
          <Graphics draw={drawBorder} />
        </Stage>
      )}
    </Box>
  );
}
