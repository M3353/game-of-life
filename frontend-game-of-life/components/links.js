import react from "react";
import { useRouter } from "next/router";

import { Typography } from "@mui/material";
import { PrimaryButton, TextButton } from "../components/StyledComponents";

import { homeLinks, navLinks } from "../src/links";
import { NextLinkComposed } from "../src/Link";

const NavLinks = (props) => {
  const { linkSx, isPrimary, links } = props;
  const router = useRouter();
  const Button = isPrimary ? PrimaryButton : TextButton;

  return (
    <>
      {links.map((link, i) => (
        <Button
          component={NextLinkComposed}
          to={{
            pathname: link.path,
          }}
          key={i}
          onClick={() => {
            if (router.pathname === link.path) {
              router.reload();
            }
          }}
          sx={linkSx}
        >
          <Typography variant="h6">{link.name}</Typography>
        </Button>
      ))}
    </>
  );
};

module.exports = {
  NavLinks,
};
