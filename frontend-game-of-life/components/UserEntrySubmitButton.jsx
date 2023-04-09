import axios from "axios";
import { Button } from "@mui/material";

import { useGameContext } from "../src/GameContext";

const UserEntrySubmitButton = (props) => {
  const { id, submission, fetchData, getSelectedData, dimensions, file } =
    props;
  const { s3 } = useGameContext();

  async function handleSubmit() {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL;
    const endpoint = `${url}/boards/${id}`;
    const { board, occupied, entry, location } = submission.current;
    const { rows, columns } = dimensions.current;

    const data = {
      boardOccupied: occupied,
      board,
      entry,
      coords: location,
      rows,
    };

    axios
      .put(endpoint, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then(({ data }) => {
        fetchData();
      });

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      Key: file.key,
      Body: file.img,
    };

    await s3.upload(uploadParams).promise();
  }

  return (
    <Button variant="outlined" onClick={handleSubmit}>
      submit
    </Button>
  );
};

export default UserEntrySubmitButton;
