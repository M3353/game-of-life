import React, { useState } from "react";
import Grid from "@mui/material/Grid";

const cellStyle = {
  border: "3px, black",
};

const UserOccupiedGrid = ({ occupied, setOccupied }) => {
  // hax rerender
  const [render, setRender] = useState(false);

  const handleToggle = (index) => {
    // create duplicate of occupied and replace
    const updatedOccupied = occupied;
    updatedOccupied[index] ^= 1;
    setOccupied(updatedOccupied);
    setRender(!render);
  };

  return (
    <>
      <div> This is the occupied grid </div>
      <Grid container columns={8}>
        {occupied.map((item, index) => (
          <Grid
            item
            key={index}
            xs={2.4}
            sx={{ border: "3px, solid, black" }}
            onMouseDown={() => handleToggle(index)}
          >
            {item}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default UserOccupiedGrid;
