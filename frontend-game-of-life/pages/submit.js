import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Button,
} from "@mui/material";

import UserEntrySubmitButton from "../components/UserEntrySubmitButton";
import UserEntry from "../components/pixi/UserEntry";
import UserEntryOccupied from "../components/pixi/UserEntryOccupied";

const SIZE = 5;

export default function UserSubmitPage() {
  const initialSubmission = useMemo(() => {
    const ne = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        ne.push(0);
      }
    }
    return {
      entry: ne,
      location: [],
      occupied: [],
      board: [],
    };
  }, []);

  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [image, setImage] = useState({
    img: null,
    key: "",
    url: "",
  });

  // use Ref to avoid rerender on update
  const submission = useRef(initialSubmission);
  const dimensions = useRef({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getSelectedData(id);
  }, [data]);

  function fetchData() {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL;
    const endpoint = `${url}/boards/`;
    axios.get(endpoint).then((res) => {
      setData(res.data);
    });
  }

  function getSelectedData(selectedId) {
    if (data != null) {
      data.every((ele) => {
        if (ele.id == selectedId) {
          submission.current.board = ele.board.data;
          submission.current.occupied = ele.occupied.data;
          dimensions.current = {
            rows: ele.rows,
            columns: ele.columns,
          };
          return;
        }
      });
    }
  }

  const handleSelectBoard = (event) => {
    const selectedId = event.target.value;
    setId(selectedId);

    getSelectedData(selectedId);
  };

  const handleUploadImage = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      const imgFile = event.target.files[0];
      setImage({
        img: imgFile,
        url: URL.createObjectURL(imgFile),
        key: imgFile.name,
      });
    }
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
          {id != "" && <UserEntry submission={submission} />}
          {id != "" && submission.current.occupied != [] && (
            <Box>
              <UserEntryOccupied
                submission={submission}
                dimensions={dimensions}
              />
              <Button variant="contained" component="label">
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleUploadImage}
                />
              </Button>
              <img
                alt="preview image"
                src={image.url}
                width="400"
                height="auto"
              />
              <UserEntrySubmitButton
                id={id}
                submission={submission}
                fetchData={fetchData}
                getSelectedData={getSelectedData}
                dimensions={dimensions}
                file={image}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
