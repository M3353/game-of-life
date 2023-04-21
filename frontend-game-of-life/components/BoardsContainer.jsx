import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";

import BoardGraphics from "./pixi/BoardGraphics";
import { MovingImages } from "./pixi/BoardGraphicsComponents";
import { useGameContext } from "../src/GameContext";
import { getS3FileURL } from "../utils/utils";

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
            size: file.Size,
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
              <BoardGraphics data={entry} imageUrls={imageUrls} />
            </Box>
          )
      )}
    </Box>
  );
};

export default BoardsContainer;
