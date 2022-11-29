import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link, NextLinkComposed } from "../src/Link";
import { navLinks } from "../src/links";

const Footer = () => {
  return (
    <>
      {navLinks.map((link) => (
        <Button
          component={NextLinkComposed}
          to={{
            pathname: link.path,
          }}
        >
          {link.name}
        </Button>
      ))}
    </>
  );
};

export default Footer;
