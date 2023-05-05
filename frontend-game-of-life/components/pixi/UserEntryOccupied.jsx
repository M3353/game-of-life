import "@pixi/events";
import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Stage, Graphics } from "@pixi/react";

import { useGameContext } from "../../src/GameContext";

const SIZE = 5;

function UserEntryOccupiedCell(props) {
  const { x, y, xDim, yDim, location, setLocation, val, id, loading, colors } =
    props;
  const { primary, background } = colors;

  const fillVal =
    val == 1 || (location.length == 2 && x == location[0] && y == location[1])
      ? primary
      : background;

  const sizeOffset = xDim / (SIZE * Math.pow(Math.log(SIZE), 2));

  const draw = useCallback(
    (g) => {
      g.clear();
      g.removeAllListeners();

      g.beginFill(fillVal, 1);
      g.drawRect(
        x * xDim + sizeOffset,
        y * yDim + sizeOffset,
        xDim - 2 * sizeOffset,
        yDim - 2 * sizeOffset
      );
      g.endFill();

      g.eventMode = loading ? "none" : "static";
      g.addEventListener("click", (e) => {
        if (val == 0) {
          setLocation([x, y]);
        }
      });

      g.addEventListener("touchstart", (e) => {
        if (val == 0) {
          setLocation([x, y]);
        }
      });
    },
    [xDim, yDim, location, id, loading]
  );
  return <Graphics draw={draw} />;
}

export default function UserEntryOccupied(props) {
  const { submission, dimensions, id, width, location, setLocation } = props;
  let { rows, columns } = dimensions.current;
  rows /= SIZE;
  columns /= SIZE;

  const [mounted, setMounted] = useState(false);

  const ctx = useGameContext();
  const { colors } = ctx;
  const { primary } = colors;

  const height = (rows / columns) * width;

  const xDim = width / columns;
  const yDim = height / rows;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    handleUpdateLocation();
  }, [id]);

  function handleUpdateLocation(location) {
    setLocation(location === undefined ? [] : location);
  }

  const drawBorder = useCallback(
    (g) => {
      const lineSize = 6;
      g.clear();
      g.lineStyle(lineSize, primary, 1);
      g.drawRect(0, 0, width, height);

      g.lineStyle(lineSize / 2, primary, 1);
      for (let x = 0; x < width; x += xDim) {
        g.moveTo(x, 0);
        g.lineTo(x, height);
      }

      for (let y = 0; y < height; y += yDim) {
        g.moveTo(0, y);
        g.lineTo(width, y);
      }
    },
    [props, height]
  );

  return (
    <Box>
      {mounted && (
        <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
          {submission.current.occupied.map((e, i) => {
            return (
              <UserEntryOccupiedCell
                id={id}
                key={i}
                location={location}
                setLocation={handleUpdateLocation}
                x={i % columns}
                y={parseInt(i / columns)}
                xDim={xDim}
                yDim={yDim}
                val={e}
                colors={colors}
              />
            );
          })}
          <Graphics draw={drawBorder} />
        </Stage>
      )}
    </Box>
  );
}
