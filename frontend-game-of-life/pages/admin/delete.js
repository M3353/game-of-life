import react, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";

export default function Delete() {
  const [data, setData] = useState();
  const [id, setId] = useState();
  const port = 5431;

  function fetchData() {
    const url = `http://localhost:${port}/boards`;
    axios.get(url).then((res) => {
      setData(res.data);
    });
  }

  function deleteBoard() {
    const url = `http://localhost:${port}/admin/${id}`;
    axios.delete(url).then((res) => {
      console.log(res.status);
    });
  }

  const handleSelectBoard = (event) => {
    const selectedId = event.target.value;
    setId(selectedId);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    data != null && (
      <Box sx={{ minWidth: 150, flexDirection: "column" }}>
        <FormControl fullWidth>
          <InputLabel id="select-board-label">Select Board ID</InputLabel>
          <Select
            labelId="select-board-label"
            id="select-board"
            value={id}
            label="Id"
            onChange={handleSelectBoard}
          >
            {data.map((entry, i) => {
              return (
                <MenuItem key={i} value={entry.id}>
                  {entry.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button onClick={deleteBoard} variant="outlined">
          Delete
        </Button>
      </Box>
    )
  );
}
