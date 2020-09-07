import { useState, Dispatch, SetStateAction } from "react";
import { totalNumberOfBoxes } from "../gameInit";
import { initializeWinnableConfig, getRegionAroundIndex } from "./aux";

export interface LightsOutState {
  activeBoxes: boolean[];
  targetedBoxes: boolean[];
  turnTriggeredBoxes: number[];
  sinkTriggeredBoxes: number[];
}

const useGameState = (): {
  gameState: LightsOutState;
  handleClicked: (i: number) => void;
  handleEntered: (i: number) => void;
  handleLeft: (i: number) => void;
  toggleTargetedBox: (i: number) => void;
} => {
  const [gameState, setGameState]: [
    LightsOutState,
    Dispatch<SetStateAction<LightsOutState>>
  ] = useState({
    activeBoxes: initializeWinnableConfig(),
    targetedBoxes: new Array(totalNumberOfBoxes).fill(false),
    turnTriggeredBoxes: new Array(totalNumberOfBoxes).fill(0),
    sinkTriggeredBoxes: new Array(totalNumberOfBoxes).fill(0),
  });

  const modifyAroundIndex = (modifier: (val: number) => number) => (
    oldState: LightsOutState,
    index: number
  ): LightsOutState => {
    const triggerVals = oldState.sinkTriggeredBoxes.slice();
    const targetedFlags = oldState.targetedBoxes.slice();
    getRegionAroundIndex(index).forEach((i: number) => {
      triggerVals[i] = modifier(triggerVals[i]);
      targetedFlags[i] = true;
    });
    return {
      ...oldState,
      sinkTriggeredBoxes: triggerVals,
      targetedBoxes: targetedFlags,
    };
  };

  const sinkAroundIndex = modifyAroundIndex((v) => v + 1);

  const unSinkAroundIndex = modifyAroundIndex((v) => v - 1);

  const handleEntered = (i: number) =>
    setGameState((currSt: LightsOutState) => sinkAroundIndex(currSt, i));
  const handleLeft = (i: number) =>
    setGameState((currSt: LightsOutState) => unSinkAroundIndex(currSt, i));

  const turnAroundIndex = (
    oldState: LightsOutState,
    index: number
  ): LightsOutState => {
    const triggerVals = oldState.turnTriggeredBoxes.slice();
    const targetedFlags = oldState.targetedBoxes.slice();
    getRegionAroundIndex(index).forEach((i: number) => {
      triggerVals[i]++;
    });
    return {
      ...oldState,
      turnTriggeredBoxes: triggerVals,
      targetedBoxes: targetedFlags,
    };
  };
  const handleClicked = (i: number) =>
    setGameState((currSt: LightsOutState) => turnAroundIndex(currSt, i));

  const toggleTargetedBox = (i: number) => {
    const update = (oldState: LightsOutState) => {
      const activeBoxes = oldState.activeBoxes.slice();
      activeBoxes[i] = !activeBoxes[i];
      return { ...oldState, activeBoxes };
    };
    setGameState(update);
  };

  return {
    gameState,
    handleClicked,
    handleEntered,
    handleLeft,
    toggleTargetedBox,
  };
};

export default useGameState;
