import React, { createContext, useContext } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET,
  region: process.env.NEXT_PUBLIC_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
});

const GameContext = createContext();

function GameProvider({ children }) {
  const s3 = new AWS.S3();
  const value = { s3 };
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
