import React from "react";
import Grid from "@mui/material/Grid";

const cellStyle = {
  border: "3px, black",
};

const UserGridCanvasRow = ({ row, rowIndex, entry, setEntry }) => {
  return (
    <>
      {row.map((item, columnIndex) => (
        <Grid
          item
          key={rowIndex * columnIndex}
          xs={2.4}
          sx={{ border: "3px, solid, black" }}
          onMouseDown={() => {
            // create duplicate of entry and replace
            const updatedEntry = entry.map((row) => row.slice());
            updatedEntry[rowIndex][columnIndex] ^= 1;
            setEntry(updatedEntry);
          }}
        >
          {item}
        </Grid>
      ))}
    </>
  );
};

const UserCanvas = ({ entry, setEntry }) => {
  return (
    <Grid container columns={8}>
      <Grid container>
        {entry.map((row, i) => {
          return (
            <UserGridCanvasRow
              row={row}
              rowIndex={i}
              entry={entry}
              setEntry={setEntry}
            />
          );
        })}
      </Grid>
    </Grid>
  );
};

export default UserCanvas;
