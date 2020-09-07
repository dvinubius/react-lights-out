import React, { useEffect } from "react";
import { gameConfig, boxSize } from "../gameInit";
import "./Gallery.css";

export const Gallery: React.FC = ({ children }) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--duration",
      gameConfig.durationInSec + ""
    );
  }, []);

  const style = {
    "--size": boxSize * gameConfig.numberOfBoxesPerSide + "px",
  } as React.CSSProperties;

  return (
    <div className="GalleryLayout" style={style}>
      {children}
    </div>
  );
};
