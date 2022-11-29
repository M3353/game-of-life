import { useEffect, useState } from "react";
import axios from "axios";

import UserGridCanvas from "../components/UserGridCanvas";
import UserOccupiedGrid from "../components/UserOccupiedGrid";
import UserSubmitCanvasButton from "../components/UserSubmitCanvasButton";
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

const SIZE = 5;

export default function UserSubmitPage() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [board, setBoard] = useState(null);
  const [occupied, setOccupied] = useState(null);
  const [entry, setEntry] = useState(
    new Array(SIZE).fill(new Array(SIZE).fill(0))
  );

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const port = 5431;
    const url = `http://localhost:${port}/boards/`;
    axios.get(url).then((res) => {
      console.log(res);
      setData(res.data);
    });
  }

  const handleSelectBoard = (event) => {
    const selectedId = event.target.value;
    setId(selectedId);

    data.forEach((entry) => {
      if (entry.id == selectedId) {
        setOccupied(entry.occupied);
        setBoard(entry.board);
      }
    });
  };

  return (
    <Box>
      {data != null && (
        <Box>
          <Box sx={{ minWidth: 150 }}>
            <FormControl fullWidth>
              <InputLabel id="select-board-label">Select Board ID</InputLabel>
              <Select
                labelId="select-board-label"
                id="select-board"
                value={id}
                label="Id"
                onChange={handleSelectBoard}
              >
                {data.map((entry) => {
                  console.log(entry);
                  return <MenuItem value={entry.id}>{entry.id}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>
          <UserGridCanvas entry={entry} setEntry={setEntry} />
          {occupied != null && board != null && (
            <Box>
              <UserOccupiedGrid occupied={occupied} setOccupied={setOccupied} />
              <UserSubmitCanvasButton
                board={board}
                occupied={occupied}
                entry={entry}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
