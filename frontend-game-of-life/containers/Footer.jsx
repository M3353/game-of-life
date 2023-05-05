import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { NextLinkComposed } from "../src/Link";
import { navLinks } from "../src/links";

const Footer = () => {
  return (
    <Box>
      {navLinks.map((link, i) => (
        <Button
          component={NextLinkComposed}
          to={{
            pathname: link.path,
          }}
          key={i}
        >
          {link.name}
        </Button>
      ))}
    </Box>
  );
};

export default Footer;
