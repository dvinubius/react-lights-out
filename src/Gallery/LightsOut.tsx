import React, { useMemo } from "react";
import Box from "../ColorBoxLightsOut/Box";
import "./LightsOut.css";
import { Gallery } from "../Gallery-Layout/Gallery";
import { totalNumberOfBoxes, boxSize } from "../gameInit";
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

  const gameOn = useMemo(() => {
    return gameState.activeBoxes.some((boxActive: boolean) => boxActive);
  }, [gameState]);

  const boxes = useMemo(() => {
    return new Array(totalNumberOfBoxes)
      .fill("")
      .map((_, index) => (
        <Box
          frozen={!gameOn}
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
  }, [
    gameState, // the only thing that'll change between renders
    gameOn, // memo-ed
    handleClicked, // callback-ed
    handleEntered, // callback-ed
    handleLeft, // callback-ed
    toggleTargetedBox, // callback-ed
  ]);

  const message = gameOn ? "Lights Out" : "Totally Nailed It!";
  const titleClass = "lightsout" + (gameOn ? "" : " finished");
  return (
    <>
      <h1 className={titleClass}>{message}</h1>
      <Gallery>{boxes}</Gallery>
    </>
  );
};

export default LightsOut;
