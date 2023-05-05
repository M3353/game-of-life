import { useMemo } from "react";
import axios from "axios";
import { CircularProgress, Typography, Tooltip } from "@mui/material";

import { PrimaryButton } from "./StyledComponents";
import { useGameContext } from "../src/GameContext";
import withErrorBoundary from "./toasts/ErrorBoundary";

const UserEntrySubmitButton = (props) => {
  const {
    id,
    submission,
    fetchData,
    dimensions,
    file,
    setSubmitted,
    loading,
    setLoading,
    location,
    numFilled,
  } = props;
  const { board, occupied, entry, palette } = submission.current;
  const { rows, columns } = dimensions.current;
  const { s3 } = useGameContext();

  const isDisabled = useMemo(() => {
    return (
      loading ||
      location.length === 0 ||
      numFilled == 0 ||
      file.img === undefined
    );
  }, [file.img, numFilled, loading, location]);

  async function handleSubmit() {
    const url = process.env.NEXT_PUBLIC_URL;
    const endpoint = `${url}/boards/${id}`;
    const data = {
      boardOccupied: occupied,
      board,
      entry,
      coords: location,
      rows,
      columns,
      palette,
      file: file.key,
      id,
    };

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      Key: id + "/" + file.key,
      Body: file.img,
    };

    setLoading(true);
    try {
      await s3.upload(uploadParams).promise();

      await axios
        .put(endpoint, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .then(({ data }) => {
          setSubmitted(true);
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
    <Tooltip
      title="remember to fill out entry, location, and upload an image"
      placement="bottom"
    >
      <span>
        <PrimaryButton
          disabled={isDisabled}
          sx={{ width: "50vw" }}
          onClick={handleSubmit}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h6">submit</Typography>
          )}
        </PrimaryButton>
      </span>
    </Tooltip>
  );
};

export default withErrorBoundary(UserEntrySubmitButton);
