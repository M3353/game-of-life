import "pixi.js";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import * as PIXI from "pixi.js";
import { Graphics, Sprite } from "@pixi/react";
import { toColor } from "./utils";

const GameOfLifeImages = (props) => {
  const { data, imageUrls, xDim, yDim } = props;
  const { columns, highDensityRegions } = data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted &&
        imageUrls !== undefined &&
        imageUrls.length > 0 &&
        highDensityRegions.data !== undefined &&
        highDensityRegions.data.map((val, i) => {
          const { idx } = val;
          const image = imageUrls[i % imageUrls.length];
          const x = idx % columns;
          const y = parseInt(idx / columns);

          return (
            <Sprite
              key={idx}
              image={image.url}
              scale={{ x: 1, y: 1 }}
              anchor={{ x: 0.5, y: 0.5 }}
              x={x * xDim}
              y={y * yDim}
              alpha={0.5}
            />
          );
        })}
    </>
  );
};

function Cell(props) {
  const { x, y, val, maxFrom, minFrom, palette, xDim, yDim } = props;

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(toColor(val, maxFrom, minFrom, palette));
      g.drawRect(xDim * x, yDim * y, xDim, yDim);
      g.endFill();
    },
    [props]
  );

  return <Graphics draw={draw} />;
}

const GameOfLifeGrid = (props) => {
  const { data, palette, xDim, yDim } = props;
  const { columns, board } = data;

  const [mounted, setMounted] = useState(false);
  const [maxVal, setMaxVal] = useState();
  const [minVal, setMinVal] = useState();

  useEffect(() => {
    setMounted(true);
  }, []);

  // reset maxVal on rerender
  useEffect(() => {
    setMaxVal(0);
    setMinVal(Number.MAX_SAFE_INTEGER);
  }, [data]);

  return (
    <>
      {mounted &&
        board.data.map((ele, i) => {
          if (ele > maxVal) setMaxVal(ele);
          if (ele < minVal) setMinVal(ele);
          return (
            <Cell
              key={i}
              x={i % columns}
              y={parseInt(i / columns)}
              val={ele}
              palette={palette}
              maxFrom={maxVal}
              minFrom={minVal}
              xDim={xDim}
              yDim={yDim}
            />
          );
        })}
    </>
  );
};

module.exports = {
  GameOfLifeGrid,
  GameOfLifeImages,
};
