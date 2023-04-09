import { Stage, Graphics } from "@inlet/react-pixi";
import React, { useCallback, useState, useEffect } from "react";
import useWindowDimensions from "../../src/useWindowDimensions";
import { palettes } from "../../src/colors";

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
  const { x, y, val, maxFrom, minFrom, palette, width, height, rows, columns } =
    props;
  const xDim = height / columns;
  const yDim = width / rows;

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
  const { width } = useWindowDimensions();
  const height = (rows / columns) * width;

  return (
    <>
      {mounted && (
        <Stage width={width} height={height}>
          {data.board.data.map((ele, i) => {
            if (ele > maxVal) setMaxVal(ele);
            if (ele < minVal) setMinVal(ele);
            return (
              <Cell
                key={i}
                x={parseInt(i / rows)}
                y={i % rows}
                val={ele}
                palette={palette}
                maxFrom={maxVal}
                minFrom={minVal}
                width={width}
                height={height}
                rows={rows}
                columns={columns}
              />
            );
          })}
        </Stage>
      )}
    </>
  );
};

export default BoardGraphics;
