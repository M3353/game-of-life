import react from "react";
import axios from "axios";
import { Button } from "@mui/material";

const UserCanvasSubmitButton = ({
  entry,
  occupied,
  board,
  id,
  location,
  fetchData,
  getBoard,
}) => {
  function handleSubmit() {
    console.log(board);
    const url = process.env.NEXT_PUBLIC_VERCEL_URL;
    const endpoint = `${url}/boards/${id}`;
    const data = {
      boardOccupied: occupied,
      board,
      entry,
      coords: location,
    };

    axios
      .put(endpoint, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then(({ data }) => {
        console.log(data);
        fetchData();
      });
  }

  return (
    <Button variant="outlined" onClick={handleSubmit}>
      submit
    </Button>
  );
};

export default UserCanvasSubmitButton;
