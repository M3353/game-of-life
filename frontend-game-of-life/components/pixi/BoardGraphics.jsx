import { Stage } from "@pixi/react";
import React, { useState, useEffect } from "react";
import { useGameContext } from "../../src/GameContext";
import {
  GameOfLifeGrid,
  GameOfLifeImages,
  GameOfLifeCircles,
  GameOfLifeTruncatedCircles,
} from "./components/BoardGraphicsComponents";

const BoardGraphics = (props) => {
  const { data, imageUrls, id } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { rows, columns } = data;
  const ctx = useGameContext();
  let { width, height } = ctx;

  width = width > height ? (columns / rows) * height : width;
  height = height > width ? (rows / columns) * width : height;
  width *= 0.85;
  height *= 0.85;
  const xDim = width / columns;
  const yDim = height / rows;

  return (
    <>
      {mounted && (
        <Stage width={width} height={height}>
          <GameOfLifeGrid data={data} xDim={xDim} yDim={yDim} />
          <GameOfLifeCircles data={data} xDim={xDim} yDim={yDim} />
          <GameOfLifeTruncatedCircles data={data} xDim={xDim} yDim={yDim} />
          <GameOfLifeImages
            id={id}
            data={data}
            imageUrls={imageUrls}
            xDim={xDim}
            yDim={yDim}
          />
        </Stage>
      )}
    </>
  );
};

export default BoardGraphics;
