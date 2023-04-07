import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";

import UserCanvas from "../components/UserCanvas";
import UserCanvasOccupied from "../components/UserCanvasOccupied";
import UserCanvasSubmitButton from "../components/UserCanvasSubmitButton";
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";
import UserEntry from "../components/pixi/UserEntry";

const SIZE = 5;

export default function UserSubmitPage() {
  const initialEntry = useMemo(() => {
    const ne = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        ne.push(0);
      }
    }
    return ne;
  }, []);

  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [board, setBoard] = useState(null);
  const [occupied, setOccupied] = useState(null);
  const [location, setLocation] = useState([]);
  const entry = useRef(initialEntry);

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
          {board != null && <UserEntry entry={entry} />}
          {board != null && occupied != null && (
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
