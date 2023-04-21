import { Stage } from "@inlet/react-pixi";
import React, { useState, useEffect } from "react";
import useWindowDimensions from "../../src/useWindowDimensions";
import { palettes } from "../../src/colors";
import { GameOfLifeGrid, GameOfLifeImages } from "./BoardGraphicsComponents";

const BoardGraphics = (props) => {
  const { data, imageUrls } = props;
  const [mounted, setMounted] = useState(false);
  const [palette, setPalette] = useState({});

  useEffect(() => {
    setMounted(true);
    setPalette(palettes.lavender);
  }, []);

  const { rows, columns } = data;
  let { height } = useWindowDimensions();
  height *= 0.85;
  const width = (columns / rows) * height;
  const xDim = width / columns;
  const yDim = height / rows;

  return (
    <>
      {mounted && (
        <Stage width={width} height={height}>
          <GameOfLifeGrid
            data={data}
            palette={palette}
            xDim={xDim}
            yDim={yDim}
          />
          <GameOfLifeImages
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
