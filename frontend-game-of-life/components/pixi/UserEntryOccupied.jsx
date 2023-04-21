import { useCallback, useEffect, useState, useMemo } from "react";
import { Stage, Graphics } from "@inlet/react-pixi";

import useWindowDimensions from "../../src/useWindowDimensions";

const SIZE = 5;

function UserEntryOccupiedCell(props) {
  const { x, y, height, width, rows, columns, submission, setLocation, val } =
    props;

  const xDim = width / columns;
  const yDim = height / rows;
  const location = submission.current.location;
  const fillVal =
    val == 1 || (location.length == 2 && x == location[0] && y == location[1])
      ? 0x000000
      : 0xffffff;

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(fillVal, 1);
      g.drawRect(x * xDim, y * yDim, xDim, yDim);
      g.endFill();
      g.interactive = true;
      g.on("click", (e) => {
        if (val == 0) {
          setLocation(x, y);
        }
      });
    },
    [props]
  );
  return <Graphics draw={draw} />;
}

export default function UserEntryOccupied(props) {
  const { submission, dimensions } = props;
  let { rows, columns } = dimensions.current;
  rows /= SIZE;
  columns /= SIZE;

  const [mounted, setMounted] = useState(false);
  const [rerender, setRerender] = useState(false);

  let { height } = useWindowDimensions();
  height *= 0.5;
  const width = (columns / rows) * height;

  useEffect(() => {
    setMounted(true);
    setRerender(true);
  }, []);

  function handleUpdateLocation(x, y) {
    submission.current.location = [x, y];

    // forced rerender;
    setRerender(false);
    setRerender(true);
  }

  const drawBorder = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(5, 0x000000, 1);
      g.drawRect(0, 0, width, height);
    },
    [props]
  );

  return (
    <>
      {mounted && (
        <Stage width={width} height={height}>
          {rerender &&
            submission.current.occupied.map((e, i) => {
              return (
                <UserEntryOccupiedCell
                  key={i}
                  submission={submission}
                  setLocation={handleUpdateLocation}
                  x={i % columns}
                  y={parseInt(i / columns)}
                  height={height}
                  width={width}
                  columns={columns}
                  rows={rows}
                  val={e}
                />
              );
            })}
          <Graphics draw={drawBorder} />
        </Stage>
      )}
    </>
  );
}
