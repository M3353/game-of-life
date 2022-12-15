import React from "react";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { adminLinks } from "../src/links";
import { NextLinkComposed } from "../src/Link";

export default function Admin() {
  return (
    <Box>
      <div>welcome admin</div>
      {adminLinks.map((link) => (
        <Button
          component={NextLinkComposed}
          to={{
            pathname: link.path,
          }}
          variant="outlined"
        >
          {link.name}
        </Button>
      ))}
    </Box>
  );
}
