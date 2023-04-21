import React, { useState, useCallback, useEffect } from "react";
import { Graphics, Sprite } from "@inlet/react-pixi";

const RGBMAX = 255;

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
        imageUrls.map((ele, i) => {
          const { idx } = highDensityRegions.data[i];
          const x = idx / columns;
          const y = idx % columns;
          return (
            <Sprite
              image={ele.url}
              scale={{ x: 1, y: 1 }}
              anchor={0.5}
              x={x * xDim}
              y={y * yDim}
              alpha={0.8}
            />
          );
        })}
    </>
  );
};

function normalize(val, minFrom, maxFrom, minTo) {
  return ((val - minFrom) / (maxFrom - minFrom)) * (RGBMAX - minTo) + minTo;
}

function valueToHex(val) {
  return (val & 0x00ffffff).toString(16);
}

function rgbToHex(r, g, b) {
  return valueToHex(r) + valueToHex(g) + valueToHex(b);
}

function toColor(val, maxFrom, minFrom, palette) {
  const { r, g, b } = palette;
  const normalized = normalize(val, minFrom, maxFrom, r);
  const hexColor = rgbToHex(normalized, g, b);
  return "0x" + hexColor.padStart(6, "0");
}

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
              x={parseInt(i / columns)}
              y={i % columns}
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
