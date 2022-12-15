import React, { useState, useId } from "react";
import axios from "axios";

import { TextField, Button } from "@mui/material";
import { Box } from "@mui/system";

export default function Create() {
  const [row, setRow] = useState("");
  const [col, setCol] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [error, setError] = useState(false);

  const handleChangeRow = (event) => {
    setRow(event.target.value);
    const rowSize = parseInt(event.target.value);
    if (rowSize < 5 || rowSize % 5 != 0) {
      setError(true);
    } else {
      setError(false);
    }
  };
  const handleChangeCol = (event) => {
    setCol(event.target.value);
    const colSize = parseInt(event.target.value);
    if (colSize < 5 || colSize % 5 != 0) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChangeName = (event) => {
    const newName = event.target.value;
    setName(newName);
    if (!newName) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const createNewBoard = () => {
    const port = 5431;
    const id = 0;
    const body = {
      id,
      name,
      rows: parseInt(row),
      columns: parseInt(col),
      board: [],
      occupied: [],
    };

    const url = `http://localhost:${port}/admin/${id}`;
    axios.post(url, body).then((res) => {
      console.log(res);
      setData(res.data);
    });
  };

  return (
    <Box>
      <div>set the size of the game of life board</div>
      <TextField
        error={error}
        id="row"
        label="Num Rows"
        variant="outlined"
        value={row}
        onChange={handleChangeRow}
        defaultValue="5"
      />
      <TextField
        error={error}
        id="col"
        label="Num Cols"
        variant="outlined"
        value={col}
        onChange={handleChangeCol}
        defaultValue="5"
      />
      <TextField
        error={nameError}
        label="Name"
        variant="outlined"
        value={name}
        onChange={handleChangeName}
      />
      <Button variant="outlined" onClick={createNewBoard}>
        create!
      </Button>
    </Box>
  );
}
