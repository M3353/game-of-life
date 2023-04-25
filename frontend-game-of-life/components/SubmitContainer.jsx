import { useEffect, useState, useMemo, useRef } from "react";

import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

import UserEntrySubmitButton from "../components/UserEntrySubmitButton";
import UserEntry from "../components/pixi/UserEntry";
import UserEntryOccupied from "../components/pixi/UserEntryOccupied";
import { PrimaryButton } from "./styled/StyledComponents";

import styles from "../styles/submit.module.css";

const SIZE = 5;

export default function SubmitContainer(props) {
  const { data, fetchData } = props;

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
  const [image, setImage] = useState({
    img: null,
    key: "",
    url: "",
  });

  // use Ref to avoid rerender on update
  const submission = useRef(initialSubmission);
  const dimensions = useRef({});

  useEffect(() => {
    getSelectedData(id);
  }, [data]);

  function getSelectedData(selectedId) {
    data.every((ele) => {
      if (ele.id === selectedId) {
        submission.current.board = ele.board.data;
        submission.current.occupied = ele.occupied.data;
        dimensions.current = {
          rows: ele.rows,
          columns: ele.columns,
        };
        return false;
      }
      return true;
    });
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
      {id != "" && submission.current.occupied != [] && (
        <Box
          m={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className={styles.submitChildren}>
            <UserEntry submission={submission} id={id} />
          </div>
          <div className={styles.submitChildren}>
            <UserEntryOccupied
              submission={submission}
              dimensions={dimensions}
              id={id}
            />
          </div>
          <div className={styles.submitChildren}>
            <PrimaryButton sx={{ width: "70vw" }}>
              Upload Image
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={handleUploadImage}
              />
            </PrimaryButton>
          </div>
          <img
            src={image.url}
            width="400"
            height="auto"
            className={styles.submitChildren}
          />
          <div className={styles.submitChildren}>
            <UserEntrySubmitButton
              id={id}
              submission={submission}
              fetchData={fetchData}
              getSelectedData={getSelectedData}
              dimensions={dimensions}
              file={image}
            />
          </div>
        </Box>
      )}
    </Box>
  );
}
