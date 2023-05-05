import React, { useState } from "react";
import { Box } from "@mui/material";

import { BorderBox } from "../components/StyledComponents";
import { useGameContext } from "../src/GameContext";
import HeaderDrawer from "../components/HeaderDrawer";
import { NavLinks } from "../components/links";
import { navLinks } from "../src/links";
import { background } from "../styles/colors";

const Header = () => {
  const { isMobile } = useGameContext();
  return (
    <Box>
      {isMobile ? (
        <HeaderDrawer />
      ) : (
        <BorderBox
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            minWidth: "100vw",
          }}
        >
          <NavLinks links={navLinks} />
        </BorderBox>
      )}
    </Box>
  );
};

export default Header;
