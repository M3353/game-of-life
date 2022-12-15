import react from "react";
import axios from "axios";
import { Button } from "@mui/material";

const UserCanvasSubmitButton = ({ entry, occupied, board, id, location }) => {
  function handleSubmit() {
    const port = 5431;
    const url = `http://localhost:${port}/boards/${id}`;
    const data = {
      boardOccupied: occupied,
      board,
      entry,
      coords: location,
    };

    axios
      .put(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then(({ data }) => {
        console.log(data);
      });
  }

  return (
    <Button variant="outlined" onClick={handleSubmit}>
      submit
    </Button>
  );
};

export default UserCanvasSubmitButton;
