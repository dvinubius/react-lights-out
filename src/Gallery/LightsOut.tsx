import React from "react";
import Box from "../ColorBoxLightsOut/Box";
import "./LightsOut.css";
import Gallery, { GalleryProps } from "../Gallery-Layout/Gallery";
import { gameConfig, totalNumberOfBoxes } from "../gameInit";
import { cornerToRound } from "./aux";
import useGameState from "./useGameState";

const LightsOut = () => {
  const {
    gameState,
    handleClicked,
    handleEntered,
    handleLeft,
    toggleTargetedBox,
  } = useGameState();

  const gameOn = (): boolean => {
    return gameState.activeBoxes.some((boxActive: boolean) => boxActive);
  };

  const renderBoxes = (boxSize: number) => {
    return new Array(totalNumberOfBoxes)
      .fill("")
      .map((_, index) => (
        <Box
          frozen={!gameOn()}
          width={boxSize}
          height={boxSize}
          index={index}
          active={gameState.activeBoxes[index]}
          rounded={cornerToRound(index)}
          isTargeted={gameState.targetedBoxes[index]}
          turnTrigger={gameState.turnTriggeredBoxes[index]}
          sinkTrigger={gameState.sinkTriggeredBoxes[index]}
          beenClicked={handleClicked}
          beenEntered={handleEntered}
          beenLeft={handleLeft}
          toggleMe={toggleTargetedBox}
          key={index}
        ></Box>
      ));
  };

  const props: GalleryProps = {
    renderBoxes,
    ...gameConfig,
  };
  const message = gameOn() ? "Lights Out" : "Totally Nailed It!";
  const titleClass = "lightsout" + (gameOn() ? "" : " finished");
  return (
    <>
      <h1 className={titleClass}>{message}</h1>
      <Gallery {...props} />
    </>
  );
};

export default LightsOut;
