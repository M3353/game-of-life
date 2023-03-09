import { useEffect, useState } from "react";
import axios from "axios";

import UserCanvas from "../components/UserCanvas";
import UserCanvasOccupied from "../components/UserCanvasOccupied";
import UserCanvasSubmitButton from "../components/UserCanvasSubmitButton";
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

const SIZE = 5;

export default function UserSubmitPage() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [board, setBoard] = useState(null);
  const [occupied, setOccupied] = useState(null);
  const [location, setLocation] = useState([]);
  const [entry, setEntry] = useState(
    new Array(SIZE).fill(new Array(SIZE).fill(0))
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getBoard(id);
    getOccupied(id);
  }, [data]);

  function fetchData() {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL;
    const endpoint = `${url}/boards/`;
    axios.get(endpoint).then((res) => {
      console.log(res);
      setData(res.data);
    });
  }

  function getBoard(selectedId) {
    if (data != null) {
      data.every((entry) => {
        if (entry.id == selectedId) {
          setBoard(entry.board.data);
          return;
        }
      });
    }
  }

  function getOccupied(selectedId) {
    if (data != null) {
      data.every((entry) => {
        if (entry.id == selectedId) {
          setOccupied(entry.occupied.data);
          console.log(occupied);
          return;
        }
      });
    }
  }

  const handleSelectBoard = (event) => {
    const selectedId = event.target.value;
    setId(selectedId);

    getOccupied(selectedId);
    getBoard(selectedId);
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
                  return <MenuItem value={entry.id}>{entry.id}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>
          <UserCanvas entry={entry} setEntry={setEntry} />
          {occupied != null && board != null && (
            <Box>
              <UserCanvasOccupied
                occupied={occupied}
                setOccupied={setOccupied}
                setLocation={setLocation}
              />
              <UserCanvasSubmitButton
                board={board}
                occupied={occupied}
                entry={entry}
                id={id}
                location={location}
                fetchData={fetchData}
                getBoard={getBoard}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
