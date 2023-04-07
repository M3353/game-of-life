import {
  Stage,
  Container,
  AnimatedSprite,
  useApp,
  useTick,
  PixiComponent,
  Graphics,
  SimpleRope,
} from "@inlet/react-pixi";

import * as PIXI from "pixi.js";

import { useState, useCallback, useEffect } from "react";
import useWindowDimensions from "../../src/useWindowDimensions";

const MAX_POINTS = 10;

function Line(props) {
  const { x, y, val, width, height, rows, columns } = props;

  const xDim = height / columns;
  const yDim = width / rows;
  const p = { x: xDim * x + xDim / 2, y: yDim * y + yDim / 2 };

  const sprite = PIXI.Sprite.from("pixijs.io/examples/assets/bg_rotate.jpg");

  const draw = useCallback((g) => {
    g.clear();

    const xCell = Math.floor(Math.random() * rows);
    const yCell = Math.floor(Math.random() * columns);
    const xOffset = Math.random() * xDim;
    const yOffset = Math.random() * yDim;

    g.lineStyle(5, 0xaa0000, 1);
    g.bezierCurveTo(
      width * Math.random(),
      height * Math.random(),
      width * Math.random(),
      height * Math.random(),
      xCell * xDim - p.x - xOffset,
      yCell * yDim - p.y - yOffset
    );
    g.position.x = p.x + xOffset;
    g.position.y = p.y + yOffset;
  });

  return <Graphics draw={draw} />;
}

const Lines = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  const { rows, columns } = data;
  const { width } = useWindowDimensions();
  const height = (rows / columns) * width;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <Stage
          width={width}
          height={height}
          options={{ backgroundColor: 0xeef1f5, antialias: true }}
        >
          <Line
            x={5}
            y={5}
            val={10}
            width={width}
            height={height}
            columns={columns}
            rows={rows}
          />
          {/* {data.board.data.map((row, i) => {
            return row.map((item, j) => {
              return (
                <Line
                  x={j}
                  y={i}
                  val={item}
                  width={width}
                  height={height}
                  columns={columns}
                  rows={rows}
                  key={(i + 1) * (j + 1)}
                />
              );
            });
          })} */}
        </Stage>
      )}
    </>
  );
};

module.exports = {
  Lines,
};
