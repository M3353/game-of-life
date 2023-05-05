import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Typography, IconButton } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";

import BoardGraphics from "../components/pixi/BoardGraphics";
import { useGameContext } from "../src/GameContext";
import { getS3FileURL } from "../components/utils";
import { TextButton } from "../components/StyledComponents";

const BoardsContainer = (props) => {
  const { data, fetchData, ws } = props;
  const { s3, galleryView, setGalleryView } = useGameContext();
  const [imageUrls, setImageUrls] = useState(new Map());

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
        const imageMap = new Map();
        Contents.forEach((file) => {
          const folder = file.Key.substring(0, file.Key.indexOf("/"));
          const id = parseInt(folder);
          if (!imageMap.has(id)) {
            imageMap.set(id, []);
          }
          imageMap.get(id).push({
            url: getS3FileURL(file.Key),
            size: file.Size,
          });
        });
        setImageUrls(imageMap);
      }
    });
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {data.map(
        (entry, i) =>
          entry.ready && (
            <Box
              sx={{ display: "flex", flexDirection: "column", m: 1 }}
              key={i}
            >
              <BoardGraphics data={entry} imageUrls={imageUrls} id={entry.id} />
            </Box>
          )
      )}
      <IconButton
        sx={{ width: "1em", position: "sticky", bottom: 0 }}
        onClick={() => setGalleryView(!galleryView)}
      >
        <CollectionsIcon />
      </IconButton>
    </Box>
  );
};

export default BoardsContainer;
