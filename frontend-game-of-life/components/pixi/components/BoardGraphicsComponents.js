import React, { useState, useCallback, useEffect } from "react";
import { Graphics, Sprite } from "@pixi/react";
import { toColor, toInvertedColor } from "./utils";

const GameOfLifeTruncatedCircles = (props) => {
  const { data, xDim, yDim } = props;
  const { columns, highDensityRegions, palette, occupied } = data;
  const [mounted, setMounted] = useState(false);

  highDensityRegions.data.slice(
    Math.max(highDensityRegions.data.length - occupied.data.length, 1)
  );

  const draw = useCallback(
    (x, y, color, sum) => (g) => {
      const xCoord = x * xDim;
      const yCoord = y * yDim;
      const radius = sum % (xDim * Math.log(xDim));
      g.clear();
      g.lineStyle(5, color);
      g.arc(xCoord, yCoord, radius, 0, (3 / 2) * Math.PI);
      g.moveTo(xCoord, yCoord);
      g.lineTo(xCoord + radius, yCoord);
      g.moveTo(xCoord, yCoord);
      g.lineTo(xCoord, yCoord + radius);
      g.endFill();
    },
    [xDim, yDim, data]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted &&
        highDensityRegions.data.map((val, i) => {
          const { idx, sum } = val;
          const x = idx % columns;
          const y = parseInt(idx / columns);
          const color = palette.data[i % palette.data.length].color;
          return <Graphics draw={draw(x, y, toInvertedColor(color), sum)} />;
        })}
    </>
  );
};

const GameOfLifeCircles = (props) => {
  const { data, xDim, yDim } = props;
  const { columns, highDensityRegions, palette, occupied } = data;
  const [mounted, setMounted] = useState(false);

  if (highDensityRegions.data.length > occupied.data.length) {
    highDensityRegions.data.splice(occupied.data.length);
  }

  const draw = useCallback(
    (x, y, color, sum) => (g) => {
      const xCoord = x * xDim;
      const yCoord = y * yDim;
      g.clear();
      g.lineStyle(5, color);
      g.drawCircle(xCoord, yCoord, sum % (xDim * Math.log(xDim)));
      g.endFill();
    },
    [xDim, yDim, data]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted &&
        highDensityRegions.data.map((val, i) => {
          const { idx, sum } = val;
          const x = idx % columns;
          const y = parseInt(idx / columns);
          const color = palette.data[i % palette.data.length].color;
          return <Graphics draw={draw(x, y, toInvertedColor(color), sum)} />;
        })}
    </>
  );
};

const GameOfLifeImages = (props) => {
  const { data, imageUrls, xDim, yDim, id } = props;
  const { columns, highDensityRegions, occupied } = data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (highDensityRegions.data.length > occupied.data.length) {
    highDensityRegions.data.splice(occupied.data.length);
  }

  return (
    <>
      {mounted &&
        imageUrls !== undefined &&
        imageUrls.size > 0 &&
        highDensityRegions.data !== undefined &&
        highDensityRegions.data.map((val, i) => {
          const { idx } = val;
          const images = imageUrls.get(id);
          const image = images[i % images.length];
          const x = idx % columns;
          const y = parseInt(idx / columns);

          return (
            <Sprite
              key={idx}
              image={image.url}
              scale={{ x: Math.log(xDim) / 2, y: Math.log(yDim) / 2 }}
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
  const { data, xDim, yDim } = props;
  const { columns, board, palette } = data;

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
              palette={palette.data[i % palette.data.length].color}
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
  GameOfLifeCircles,
  GameOfLifeTruncatedCircles,
};
