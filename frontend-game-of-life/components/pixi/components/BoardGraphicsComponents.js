import React, { useState, useCallback, useEffect } from "react";
import { Graphics, Sprite } from "@pixi/react";
import { toColor, toInvertedColor } from "./utils";

const GameOfLifeSquares = (props) => {
  const { data, xDim, yDim } = props;
  const { columns, highDensityRegions, palette } = data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const draw = useCallback(
    (x, y, color, sum) => (g) => {
      const xCoord = x * xDim;
      const yCoord = y * yDim;
      const width = (sum * sum * Math.log(xDim)) % (xDim * Math.log(xDim));
      const height = (sum * sum * Math.log(yDim)) % (yDim * Math.log(yDim));
      g.clear();
      g.lineStyle(Math.log(xDim), color);
      g.drawRect(xCoord - width / 2, yCoord - height / 2, width, height);
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
          return (
            <Graphics key={i} draw={draw(x, y, toInvertedColor(color), sum)} />
          );
        })}
    </>
  );
};

const GameOfLifeTruncatedCircles = (props) => {
  const { data, xDim, yDim } = props;
  const { columns, highDensityRegions, palette, occupied } = data;
  const [mounted, setMounted] = useState(false);

  const draw = useCallback(
    (x, y, color, sum) => (g) => {
      const xCoord = x * xDim;
      const yCoord = y * yDim;
      const radius = (sum * Math.log(xDim)) % (xDim * Math.log(xDim));
      g.clear();
      g.lineStyle(Math.log(xDim), color);
      g.arc(xCoord, yCoord, radius, 0, (3 / 2) * Math.PI);
      g.moveTo(xCoord, yCoord);
      g.lineTo(xCoord + radius, yCoord);
      g.moveTo(xCoord, yCoord);
      g.lineTo(xCoord, yCoord - radius);
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
        highDensityRegions.data.slice(0, occupied.data.length).map((val, i) => {
          const { idx, sum } = val;
          const x = idx % columns;
          const y = parseInt(idx / columns);
          const color = palette.data[i % palette.data.length].color;
          return (
            <Graphics key={i} draw={draw(x, y, toInvertedColor(color), sum)} />
          );
        })}
    </>
  );
};

const GameOfLifeCircles = (props) => {
  const { data, xDim, yDim } = props;
  const { columns, highDensityRegions, palette, occupied } = data;
  const [mounted, setMounted] = useState(false);

  const draw = useCallback(
    (x, y, color, sum) => (g) => {
      const xCoord = x * xDim;
      const yCoord = y * yDim;
      g.clear();
      g.lineStyle(Math.log(xDim), color);
      g.drawCircle(
        xCoord,
        yCoord,
        (sum * Math.log(xDim)) % (xDim * Math.log(xDim))
      );
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
        highDensityRegions.data
          .slice(highDensityRegions.data.length - occupied.data.length)
          .map((val, i) => {
            const { idx, sum } = val;
            const x = idx % columns;
            const y = parseInt(idx / columns);
            const color = palette.data[i % palette.data.length].color;
            return (
              <Graphics
                key={i}
                draw={draw(x, y, toInvertedColor(color), sum)}
              />
            );
          })}
    </>
  );
};

const GameOfLifeImages = (props) => {
  const { data, imageUrls, xDim, yDim, id } = props;
  const { columns, highDensityRegions, occupied } = data;
  const [mounted, setMounted] = useState(false);
  const [imageSet, setImageSet] = useState([]);

  useEffect(() => {
    setMounted(true);
    setImageSet(imageUrls.get(id));
  }, []);

  return (
    <>
      {mounted &&
        imageSet.length > 0 &&
        highDensityRegions.data !== undefined &&
        highDensityRegions.data
          .slice(highDensityRegions.data.length - occupied.data.length)
          .map((val, i) => {
            const { idx } = val;
            const image = imageSet[i % imageSet.length];
            const x = idx % columns;
            const y = parseInt(idx / columns);

            return (
              <Sprite
                key={idx}
                image={image.url}
                scale={{ x: xDim / 40, y: yDim / 40 }}
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

  const color =
    typeof palette === "string"
      ? palette
      : toColor(val, maxFrom, minFrom, palette);

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(color);
      g.drawRect(xDim * x, yDim * y, xDim, yDim);
      g.endFill();
    },
    [props, color]
  );

  return <Graphics draw={draw} />;
}

const GameOfLifeGrid = (props) => {
  const { data, xDim, yDim, defaultColor } = props;
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

          const idx =
            Math.floor(i / columns) % 2 == 0
              ? i % palette.data.length
              : palette.data.length - (i % palette.data.length) - 1;
          const color =
            palette.data.length > 0 ? palette.data[idx].color : defaultColor;
          return (
            <Cell
              key={i}
              x={i % columns}
              y={parseInt(i / columns)}
              val={ele}
              palette={color}
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
  GameOfLifeSquares,
  GameOfLifeTruncatedCircles,
};
