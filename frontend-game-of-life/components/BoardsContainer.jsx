import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";

import BoardGraphics from "./pixi/BoardGraphics";
import { Lines } from "./pixi/BoardGraphicsComponents";
import { useGameContext } from "../src/GameContext";

function getS3FileURL(key) {
  return `${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${key}`;
}

const BoardsContainer = ({ data, fetchData, ws }) => {
  const { s3 } = useGameContext();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (ws.data) {
      const { message } = ws.data;
      if (typeof message === "object") {
        fetchData();
      }
    }
  }, [ws.data]);

  // get bucket images
  useEffect(() => {
    const retrieveParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
    };
    s3.listObjectsV2(retrieveParams, function (err, data) {
      if (err) console.log(err, err.stack);
      else {
        const { Contents } = data;
        const imageData = Contents.map((file) => {
          return {
            url: getS3FileURL(file.Key),
            size: file.size,
          };
        });
        setImageUrls(imageData);
      }
    });
  }, []);

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
