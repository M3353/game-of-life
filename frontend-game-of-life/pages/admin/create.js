import React, { useState } from "react";
import axios from "axios";

import { TextField, Button, Box, Typography } from "@mui/material";
import { useSession, signIn } from "next-auth/react";

import Header from "../../containers/Header";
import { BorderBox, PrimaryButton } from "../../components/StyledComponents";

export default function Create() {
  const [row, setRow] = useState("");
  const [col, setCol] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [error, setError] = useState(false);

  const { data: session } = useSession();

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
    const url =
      process.env.NODE_ENV == "production"
        ? `https://${process.env.NEXT_PUBLIC_URL}`
        : `http://${process.env.NEXT_PUBLIC_URL}`;
    const id = 0;
    const body = {
      id,
      name,
      rows: parseInt(row),
      columns: parseInt(col),
      board: { data: [] },
      occupied: { data: [] },
    };

    const endpoint = `${url}/admin/${id}`;
    axios.post(endpoint, body).then((res) => {
      console.log(res);
    });
  };

  return (
    <Box>
      <div style={{ position: "sticky", top: 0 }}>
        <Header />
      </div>
      <BorderBox center>
        <Typography variant="body1">create game of life board</Typography>
        {session ? (
          <>
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
            <PrimaryButton onClick={createNewBoard}>
              <Typography varaint="body1">create!</Typography>
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton sx={{ minWidth: "70vw" }} onClick={signIn}>
            <Typography variant="h6">Sign in</Typography>
          </PrimaryButton>
        )}
      </BorderBox>
    </Box>
  );
}
