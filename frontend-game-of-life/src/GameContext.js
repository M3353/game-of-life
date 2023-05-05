import React, { createContext, useContext, useEffect, useState } from "react";
import AWS from "aws-sdk";

import * as colors from "../styles/colors";

AWS.config.update({
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET,
  region: process.env.NEXT_PUBLIC_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
});

const GameContext = createContext();

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function GameProvider({ children }) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [galleryView, setGalleryView] = useState(false);

  const s3 = new AWS.S3();

  const handleResize = () => {
    setWindowDimensions(getWindowDimensions());
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const values = {
    s3,
    isMobile,
    colors,
    galleryView,
    setGalleryView,
    width: windowDimensions.width,
    height: windowDimensions.height,
  };

  return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
}

function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("Context must be used within provider");
  }
  return context;
}

module.exports = { GameProvider, useGameContext };
