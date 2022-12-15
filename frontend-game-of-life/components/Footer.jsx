import React, { useState } from "react";
import { Button } from "@mui/material";
import { NextLinkComposed } from "../src/Link";
import { navLinks } from "../src/links";

const Footer = () => {
  return (
    <>
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
    </>
  );
};

export default Footer;
