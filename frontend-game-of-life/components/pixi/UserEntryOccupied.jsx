import "@pixi/events";
import { useCallback, useEffect, useState } from "react";
import { Stage, Graphics } from "@pixi/react";

import useWindowDimensions from "../../src/useWindowDimensions";

const SIZE = 5;

function UserEntryOccupiedCell(props) {
  const { x, y, height, width, rows, columns, location, setLocation, val, id } =
    props;

  const xDim = width / columns;
  const yDim = height / rows;
  const fillVal =
    val == 1 || (location.length == 2 && x == location[0] && y == location[1])
      ? 0x000000
      : 0xffffff;

  const draw = useCallback(
    (g) => {
      g.clear();
      g.removeAllListeners();

      g.beginFill(fillVal, 1);
      g.drawRect(x * xDim, y * yDim, xDim, yDim);
      g.endFill();

      g.eventMode = "static";
      g.addEventListener("click", (e) => {
        if (val == 0) {
          setLocation([x, y]);
        }
      });

      g.addEventListener("touchstart", (e) => {
        if (val == 0) {
          setLocation([x, y]);
        }
      });
    },
    [height, width, location, id]
  );
  return <Graphics draw={draw} />;
}

export default function UserEntryOccupied(props) {
  const { submission, dimensions, id } = props;
  let { rows, columns } = dimensions.current;
  rows /= SIZE;
  columns /= SIZE;

  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState([]);

  let { width } = useWindowDimensions();
  width *= 0.7;
  const height = (rows / columns) * width;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    handleUpdateLocation();
  }, [id]);

  function handleUpdateLocation(location) {
    submission.current.location = location === undefined ? [] : location;
    setLocation(location === undefined ? [] : location);
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
    <div>
      {mounted && (
        <Stage width={width} height={height}>
          {submission.current.occupied.map((e, i) => {
            return (
              <UserEntryOccupiedCell
                id={id}
                key={i}
                location={location}
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
    </div>
  );
}
