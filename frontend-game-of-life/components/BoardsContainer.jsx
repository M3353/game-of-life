import { Box } from "@mui/system";
import React, { useEffect } from "react";
import BoardGraphics from "./pixi/BoardGraphics";
import { Lines } from "./pixi/BoardGraphicsComponents";

const BoardsContainer = ({ data, fetchData, ws }) => {
  useEffect(() => {
    if (ws.data) {
      const { message } = ws.data;
      if (typeof message === "object") {
        fetchData();
      }
    }
  }, [ws.data]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {data.map(
        (entry, i) =>
          entry.ready && (
            <Box sx={{ display: "flex", flexDirection: "column" }} key={i}>
              <div>{entry.name}</div>
              <Lines data={entry} />
              <BoardGraphics data={entry} />
            </Box>
          )
      )}
    </Box>
  );
};

export default BoardsContainer;
