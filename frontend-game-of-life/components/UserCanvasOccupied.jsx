import React, { useState } from "react";
import Grid from "@mui/material/Grid";

const UserCanvasOccupied = ({ occupied, setOccupied, setLocation }) => {
  const handleToggle = (i, j) => {
    // create duplicate of occupied and replace
    const updatedOccupied = occupied;
    updatedOccupied[i][j] ^= 1;
    setOccupied(updatedOccupied);
    setLocation([i, j]);
  };

  return (
    <>
      <div> Select where you would like to place drawing </div>
      <Grid container columns={8}>
        {occupied.map((row, i) => (
          <Grid container key={i}>
            {row.map((item, j) => {
              return (
                <Grid
                  item
                  key={(i + 1) * (j + 1)}
                  xs={2.4}
                  onMouseDown={() => handleToggle(i, j)}
                >
                  {item}
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default UserCanvasOccupied;
