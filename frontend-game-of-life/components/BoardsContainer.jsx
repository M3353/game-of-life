import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

const cellStyle = {
  border: "3px, black",
};

const BoardRow = ({ row, rowIndex }) => {
  return (
    <>
      {row.map((item, columnIndex) => (
        <Grid
          item
          key={rowIndex * columnIndex}
          xs={2.4}
          sx={{ border: "3px, solid, black" }}
        >
          {item}
        </Grid>
      ))}
    </>
  );
};

const TestButton = ({ board, fetchData, index }) => {
  function updateData() {
    const id = index;
    const port = 5431;
    const url = `http://localhost:${port}/boards/${id}`;

    axios.post(url, { board }).then((res) => {
      console.log(res);
      fetchData();
    });
  }

  return (
    <Button variant="outlined" onClick={updateData}>
      increment
    </Button>
  );
};

const BoardsContainer = ({ data, fetchData }) => {
  return (
    <>
      {data.map((entry) => {
        return (
          <>
            <Grid container columns={8}>
              <Grid container>
                {entry.board.map((row, i) => (
                  <BoardRow row={row} rowIndex={i} />
                ))}
              </Grid>
            </Grid>
            <TestButton
              board={entry.board}
              fetchData={fetchData}
              index={entry.id}
            />
          </>
        );
      })}
    </>
  );
};

export default BoardsContainer;
