import React, { useCallback, useState, useEffect, useRef } from "react";

import "@pixi/events";
import { Stage, Graphics } from "@pixi/react";
import { Box } from "@mui/material";

import { useGameContext } from "../../src/GameContext";

const COLS = 5;
const ROWS = 5;

function UserEntryCell(props) {
  const {
    x,
    y,
    xDim,
    yDim,
    mouseDown,
    lastTouches,
    submission,
    id,
    loading,
    numFilled,
    setNumFilled,
    ctx,
  } = props;
  const { primary, background } = ctx.colors;
  const [changedBoard, setChangedBoard] = useState(false);

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
        setNumFilled(0);
      }

      g.beginFill(background, 1);
      g.drawRect(xDim * x, yDim * y, xDim, yDim);
      g.endFill();

      const handleToggleCell = () => {
        entry[idx] ^= 1;
        g.tint = entry[idx] === 1 ? primary : 0xffffff;
        if (entry[idx] === 1) {
          setNumFilled((numFilled) => numFilled + 1);
        } else {
          setNumFilled((numFilled) => numFilled - 1);
        }
      };

      g.eventMode = loading ? "none" : "static";
      g.addEventListener("mousedown", (e) => {
        handleToggleCell();
      });
      g.addEventListener("mouseover", (e) => {
        if (mouseDown.current) {
          handleToggleCell();
        }
      });

      if ([...lastTouches.values()].includes(idx)) handleToggleCell();
    },
    [xDim, yDim, changedBoard, lastTouches, loading]
  );

  return <Graphics draw={draw} />;
}

export default function UserEntry(props) {
  const { submission, id, setStageWidth, loading, numFilled, setNumFilled } =
    props;
  const [lastTouches, setLastTouches] = useState(new Map());
  const mouseDown = useRef(false);
  const ctx = useGameContext();
  let { width, height, colors } = ctx;
  const { primary } = colors;

  width = width > height ? (COLS / ROWS) * height : width;
  height = height > width ? (ROWS / COLS) * width : height;
  width *= 0.7;
  height *= 0.7;

  setStageWidth(width);

  const handleMouseDown = () => {
    mouseDown.current = true;
  };
  const handleMouseUp = () => {
    mouseDown.current = false;
  };

  const handleOnTouchStartMove = (e) => {
    const stageOffsetX = e.target.offsetLeft;
    const stageOffsetY = e.target.offsetTop;
    [...e.changedTouches].forEach((touch) => {
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
      g.lineStyle(6, primary, 1);
      g.drawRect(0, 0, width, height);
    },
    [props, height]
  );

  return (
    <Box>
      <Stage
        width={width}
        height={height}
        options={{ backgroundAlpha: 0, antialias: true }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleOnTouchStartMove}
        onTouchStart={handleOnTouchStartMove}
        onTouchEnd={handleOnTouchEnd}
      >
        {submission.current.entry.map((e, i) => {
          const xDim = width / COLS;
          const yDim = height / ROWS;
          return (
            <UserEntryCell
              id={id}
              key={i}
              y={parseInt(i / COLS)}
              x={i % COLS}
              xDim={xDim}
              yDim={yDim}
              mouseDown={mouseDown}
              lastTouches={lastTouches}
              submission={submission}
              loading={loading}
              numFilled={numFilled}
              setNumFilled={setNumFilled}
              ctx={ctx}
            />
          );
        })}
        <Graphics draw={drawBorder} />
      </Stage>
    </Box>
  );
}
