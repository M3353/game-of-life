import react, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";

import Header from "../../containers/Header";
import { BorderBox, PrimaryButton } from "../../components/StyledComponents";

export default function Delete() {
  const [data, setData] = useState();
  const [id, setId] = useState();
  const url = process.env.NEXT_PUBLIC_URL;

  const { data: session } = useSession();

  function fetchData() {
    const endpoint = `${url}/boards`;
    axios.get(endpoint).then((res) => {
      setData(res.data);
    });
  }

  function deleteBoard() {
    const endpoint = `${url}/admin/${id}`;
    axios.delete(endpoint).then((res) => {
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
        <div style={{ position: "sticky", top: 0 }}>
          <Header />
        </div>
        <BorderBox center>
          {session ? (
            <>
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
              <PrimaryButton onClick={deleteBoard} variant="outlined">
                Delete
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton sx={{ minWidth: "70vw" }} onClick={signIn}>
              <Typography variant="h6">Sign in</Typography>
            </PrimaryButton>
          )}
        </BorderBox>
      </Box>
    )
  );
}
