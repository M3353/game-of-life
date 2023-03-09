import { Stage, Graphics } from "@inlet/react-pixi";
import React, { useCallback, useState, useEffect } from "react";
import { palettes } from "../../src/colors";

const HEIGHT_FACTOR = 30;
const WIDTH_FACTOR = 30;
const RGBMAX = 255;

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
  const { x, y, val, maxFrom, minFrom, palette } = props;
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(toColor(val, maxFrom, minFrom, palette));
      g.drawRect(
        WIDTH_FACTOR * x,
        HEIGHT_FACTOR * y,
        HEIGHT_FACTOR,
        WIDTH_FACTOR
      );
      g.endFill();
    },
    [props]
  );

  return <Graphics draw={draw} />;
}

const BoardGraphics = ({ data }) => {
  const [mounted, setMounted] = useState(false);
  const [palette, setPalette] = useState({});
  const [maxVal, setMaxVal] = useState();
  const [minVal, setMinVal] = useState();

  useEffect(() => {
    setMounted(true);
    setPalette(palettes.lavender);
  }, []);

  // reset maxVal on rerender
  useEffect(() => {
    setMaxVal(0);
    setMinVal(Number.MAX_SAFE_INTEGER);
  }, [data]);

  const { rows, columns } = data;
  const stageHeight = rows * HEIGHT_FACTOR;
  const stageWidth = columns * WIDTH_FACTOR;

  return (
    <>
      {mounted && (
        <Stage width={stageWidth} height={stageHeight}>
          {data.board.data.map((row, i) => {
            return row.map((item, j) => {
              if (item > maxVal) setMaxVal(item);
              if (item < minVal) setMinVal(item);
              return (
                <Cell
                  key={(i + 1) * (j + 1)}
                  x={j}
                  y={i}
                  val={item}
                  palette={palette}
                  maxFrom={maxVal}
                  minFrom={minVal}
                />
              );
            });
          })}
        </Stage>
      )}
    </>
  );
};

export default BoardGraphics;
