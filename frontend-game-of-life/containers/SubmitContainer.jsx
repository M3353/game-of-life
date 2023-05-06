import { useEffect, useState, useMemo, useRef } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
} from "@mui/material";

import UserEntrySubmitButton from "../components/UserEntrySubmitButton";
import UserEntry from "../components/pixi/UserEntry";
import UserEntryOccupied from "../components/pixi/UserEntryOccupied";
import { PrimaryButton, BorderBox } from "../components/StyledComponents";
import { homeLinks } from "../src/links";
import { NavLinks } from "../components/links";
import { useGameContext } from "../src/GameContext";
import { instructions } from "../src/text";

import styles from "../styles/submit.module.css";
import Toast from "../components/toasts/ToastModule";

const SIZE = 5;

export default function SubmitContainer(props) {
  const { data, fetchData } = props;
  const { colors } = useGameContext();
  const { primary, highlight, background } = colors;

  const initialSubmission = useMemo(() => {
    const ne = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        ne.push(0);
      }
    }
    return {
      entry: ne,
      occupied: [],
      board: [],
      palette: [],
    };
  }, []);

  const [id, setId] = useState("");
  const [image, setImage] = useState({
    img: undefined,
    key: "",
    url: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stageWidth, setStageWidth] = useState();
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState([]);
  const [numFilled, setNumFilled] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(undefined);

  // use Ref to avoid rerender on update
  const submission = useRef(initialSubmission);
  const dimensions = useRef({});

  const selectStyle = {
    boxShadow: "none",
    ".MuiOutlinedInput-notchedOutline": {
      border: `3px solid ${primary}`,
      borderRadius: 0,
    },
    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      border: `3px solid ${highlight}`,
      borderRadius: 0,
    },
    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: `3px solid ${highlight}`,
      borderRadius: 0,
    },
    ".MuiSvgIcon-root ": {
      fill: `${primary} !important`,
    },
  };

  const selectMenuStyle = {
    MenuListProps: {
      sx: {
        backgroundColor: background,
      },
    },
    sx: {
      ".MuiMenu-paper": {
        borderRadius: 0,
        border: `3px solid ${primary}`,
        boxShadow: "none",
      },
      ".MuiMenu-list": {
        paddingTop: 0,
        paddingBottom: 0,

        "& li:hover": {
          color: background,
          background: highlight,
        },
        "& li.Mui-selected": {
          color: background,
          background: highlight,
        },
        "& li.Mui-selected:hover": {
          color: background,
          background: highlight,
        },
      },
    },
  };

  useEffect(() => {
    getSelectedData(id);
  }, [data]);

  function getSelectedData(selectedId) {
    data.every((ele) => {
      if (ele.id === selectedId) {
        submission.current.board = ele.board.data;
        submission.current.occupied = ele.occupied.data;
        submission.current.palette = ele.palette.data;
        dimensions.current = {
          rows: ele.rows,
          columns: ele.columns,
        };
        setReady(ele.ready);
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
    <>
      {!submitted ? (
        <Box>
          <Box sx={{ minWidth: 150 }}>
            <FormControl fullWidth disabled={loading} required>
              <InputLabel id="select-board-label">Select Board</InputLabel>
              <Select
                labelId="select-board-label"
                id="select-board"
                value={id}
                label="Id"
                onChange={handleSelectBoard}
                sx={selectStyle}
                MenuProps={selectMenuStyle}
              >
                {data.map((entry) => {
                  return (
                    <MenuItem value={entry.id} key={entry.id}>
                      {entry.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          {id != "" && submission.current.occupied != [] && !ready && (
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
                <Typography variant="body1" sx={{ m: 1 }}>
                  {instructions.entry}
                </Typography>
                <UserEntry
                  submission={submission}
                  id={id}
                  loading={loading}
                  setStageWidth={setStageWidth}
                  numFilled={numFilled}
                  setNumFilled={setNumFilled}
                />
              </div>
              <div className={styles.submitChildren}>
                <Typography variant="body1" sx={{ m: 1 }}>
                  {instructions.occupied}
                </Typography>
                <UserEntryOccupied
                  submission={submission}
                  dimensions={dimensions}
                  id={id}
                  loading={loading}
                  width={stageWidth}
                  location={location}
                  setLocation={setLocation}
                />
              </div>
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                id="image-input"
                onChange={handleUploadImage}
              />
              <label htmlFor="image-input">
                <Typography variant="body1" sx={{ m: 1 }}>
                  {instructions.image}
                </Typography>
                <PrimaryButton
                  sx={{ width: "50vw" }}
                  component="span"
                  disabled={loading}
                >
                  <Typography variant="h6">Upload Image</Typography>
                </PrimaryButton>
              </label>
              <img
                src={image.url}
                width="70vw"
                height="auto"
                className={styles.submitChildren}
              />
              <div className={styles.submitChildren}>
                <UserEntrySubmitButton
                  id={id}
                  submission={submission}
                  fetchData={fetchData}
                  dimensions={dimensions}
                  file={image}
                  setSubmitted={setSubmitted}
                  loading={loading}
                  setLoading={setLoading}
                  numFilled={numFilled}
                  location={location}
                  setError={setError}
                  setOpen={setOpen}
                />
              </div>
            </Box>
          )}
          {error !== undefined && (
            <Toast
              message={`An error occurred: ${error.toString()}. Please try again`}
              open={open}
              setOpen={setOpen}
              severity="error"
            />
          )}
          {ready && (
            <Typography variant="body1" sx={{ m: 1 }}>
              this board has already been filled!
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100vw",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1"> thank you for submitting! </Typography>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <NavLinks isPrimary linkSx={{ m: ".5em" }} links={homeLinks} />
          </Box>
        </Box>
      )}
    </>
  );
}
