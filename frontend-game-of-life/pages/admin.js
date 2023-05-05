import React from "react";
import { Box, Typography } from "@mui/material";
import { signOut, useSession, signIn } from "next-auth/react";

import Header from "../containers/Header";
import { adminLinks } from "../src/links";
import { NavLinks } from "../components/links";
import { BorderBox, PrimaryButton } from "../components/StyledComponents";

export default function Admin() {
  const { data: session } = useSession();

  return (
    <Box>
      <div style={{ position: "sticky", top: 0 }}>
        <Header />
      </div>

      <BorderBox center>
        <Typography variant="body1">welcome admin!</Typography>
        {session ? (
          <>
            <NavLinks
              links={adminLinks}
              isPrimary
              linkSx={{ minWidth: "70vw", m: 1 }}
            />
            <PrimaryButton sx={{ minWidth: "70vw", m: 1 }} onClick={signOut}>
              <Typography variant="h6">Sign out</Typography>
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton sx={{ minWidth: "70vw" }} onClick={signIn}>
            <Typography variant="h6">Sign in</Typography>
          </PrimaryButton>
        )}
      </BorderBox>
    </Box>
  );
}
