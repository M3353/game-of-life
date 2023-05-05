import { useState } from "react";
import { IconButton, Drawer, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import { BorderBox } from "../components/StyledComponents";
import { navLinks } from "../src/links";
import { NavLinks } from "../components/links";
import { useGameContext } from "../src/GameContext";

const HeaderDrawer = () => {
  const { colors } = useGameContext();
  const { background } = colors;
  const [open, setOpen] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    //changes the function state according to the value of open
    setOpen(open);
  };
  return (
    <BorderBox
      sx={{ minWidth: "100vw", display: "flex", justifyContent: "flex-end" }}
    >
      <IconButton
        edge="start"
        color="inherit"
        size="medium"
        onClick={toggleDrawer(true)}
        sx={{ mr: 2 }}
      >
        <DragHandleIcon fontSize="inherit" />
      </IconButton>
      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { backgroundColor: background } }}
      >
        <IconButton sx={{ mb: 2 }} onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
        <NavLinks
          isPrimary
          linkSx={{ flexGrow: 1, mb: ".2em" }}
          links={navLinks}
        />
      </Drawer>
    </BorderBox>
  );
};

export default HeaderDrawer;
