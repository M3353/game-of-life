import { Box } from "@mui/system";
import React, { useEffect } from "react";
import BoardGraphics from "./pixi/BoardGraphics";

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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <div>{entry.name}</div>
              <BoardGraphics data={entry} key={i} />
            </Box>
          )
      )}
    </Box>
  );
};

export default BoardsContainer;
