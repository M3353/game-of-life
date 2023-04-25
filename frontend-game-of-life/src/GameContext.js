import React, { createContext, useContext, useEffect, useState } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET,
  region: process.env.NEXT_PUBLIC_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
});

const GameContext = createContext();

function GameProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  const s3 = new AWS.S3();

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const value = { s3, isMobile };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("Context must be used within provider");
  }
  return context;
}

module.exports = { GameProvider, useGameContext };
