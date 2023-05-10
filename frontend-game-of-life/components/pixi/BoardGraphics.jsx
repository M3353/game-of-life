import { Graphics, Stage } from "@pixi/react";
import React, { useState, useEffect, useCallback } from "react";
import { Container } from "@mui/material";
import { useGameContext } from "../../src/GameContext";
import {
  GameOfLifeGrid,
  GameOfLifeImages,
  GameOfLifeCircles,
  GameOfLifeSquares,
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
  const { primary, background } = ctx.colors;
  let { width, height } = ctx;

  width = width > height ? (columns / rows) * height : width;
  height = height > width ? (rows / columns) * width : height;
  width *= 0.85;
  height *= 0.85;
  const xDim = width / columns;
  const yDim = height / rows;

  const draw = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(6, primary, 1);
      g.drawRect(0, 0, width, height);
    },
    [props, height]
  );

  return (
    <Container>
      {mounted && imageUrls.size > 0 && (
        <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
          <GameOfLifeGrid
            data={data}
            xDim={xDim}
            yDim={yDim}
            defaultColor={background}
          />
          {data.ready && (
            <>
              <GameOfLifeImages
                id={id}
                data={data}
                imageUrls={imageUrls}
                xDim={xDim}
                yDim={yDim}
              />
              <GameOfLifeSquares data={data} xDim={xDim} yDim={yDim} />
              <GameOfLifeCircles data={data} xDim={xDim} yDim={yDim} />
              <GameOfLifeTruncatedCircles data={data} xDim={xDim} yDim={yDim} />
            </>
          )}
          <Graphics draw={draw} />
        </Stage>
      )}
    </Container>
  );
};

export default BoardGraphics;
