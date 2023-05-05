import { useCallback, useEffect, useState } from "react";
import { Stage } from "@pixi/react";
import { Grid, Typography, Box } from "@mui/material";

import { homeLinks } from "../src/links";
import { useGameContext } from "../src/GameContext";
import { NavLinks } from "../components/links";

const HomeContainer = (props) => {
  const [isMount, setIsMount] = useState(false);

  const { width, height } = useGameContext();

  useEffect(() => {
    setIsMount(true);
  }, []);

  return (
    <>
      {isMount && (
        <Grid>
          <Grid
            item
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Stage
              width={width}
              height={height}
              options={{ backgroundAlpha: 0 }}
            ></Stage>
          </Grid>
          <Grid
            container
            spacing={0}
            direction="column"
            position="absolute"
            left={0}
            bottom={0}
            margin="1em"
          >
            <Typography variant="h3" sx={{ paddingBottom: 1 }}>
              Game of Life
            </Typography>
            <NavLinks
              linkSx={{ justifyContent: "flex-start" }}
              links={homeLinks}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomeContainer;
