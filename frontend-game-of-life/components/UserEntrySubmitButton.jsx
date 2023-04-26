import axios from "axios";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

import { PrimaryButton } from "./styled/StyledComponents";
import { useGameContext } from "../src/GameContext";
import withErrorBoundary from "./toasts/ErrorBoundary";

const UserEntrySubmitButton = (props) => {
  const { id, submission, fetchData, dimensions, file, setOpenToast } = props;
  const { s3 } = useGameContext();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const url = process.env.NEXT_PUBLIC_URL;
    const endpoint = `${url}/boards/${id}`;
    const { board, occupied, entry, location } = submission.current;
    const { rows, columns } = dimensions.current;

    const data = {
      boardOccupied: occupied,
      board,
      entry,
      coords: location,
      rows,
      columns,
      file: file.key,
    };

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      Key: file.key,
      Body: file.img,
    };

    setLoading(true);
    try {
      // await s3.upload(uploadParams).promise();

      await axios
        .put(endpoint, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .then(({ data }) => {
          setOpenToast(true);
          fetchData();
        })
        .catch((e) => {
          if (e.response) console.log(e.response.data);
          else if (e.request) console.log(e.request);
          else console.log(e);
        });
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }

  return (
    <PrimaryButton
      disabled={loading}
      sx={{ width: "70vw" }}
      onClick={handleSubmit}
    >
      {loading ? <CircularProgress /> : "submit"}
    </PrimaryButton>
  );
};

export default withErrorBoundary(UserEntrySubmitButton);
