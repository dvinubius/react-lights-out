import { totalNumberOfBoxes } from "../gameInit";
import { Corner } from "../ColorBoxLightsOut/Box";
import { gameConfig } from "../gameInit";

const getRegionAroundIndex = (index: number): number[] => {
  const side = gameConfig.numberOfBoxesPerSide;
  const region = [index];
  if (index % side !== 0) {
    region.push(index - 1);
  }
  if (index % side !== side - 1) {
    region.push(index + 1);
  }
  if (index >= side) {
    region.push(index - side);
  }
  if (index + side < side ** 2) {
    region.push(index + side);
  }
  return region;
};

const initializeWinnableConfig = (): boolean[] => {
  const total = totalNumberOfBoxes;
  const result: boolean[] = new Array(total).fill(false);
  for (let i = 0; i < 18; i++) {
    const index = Math.floor(Math.random() * total);
    const region = getRegionAroundIndex(index);
    region.forEach((j) => (result[j] = !result[j]));
  }
  return result;
};

const cornerToRound = (i: number): Corner => {
  if (gameConfig.allRounded) {
    return Corner.ALL;
  }
  if (i === 0) {
    return Corner.TL;
  }
  if (i === gameConfig.numberOfBoxesPerSide - 1) {
    return Corner.TR;
  }
  if (i === totalNumberOfBoxes - gameConfig.numberOfBoxesPerSide) {
    return Corner.BL;
  }
  if (i === gameConfig.numberOfBoxesPerSide ** 2 - 1) {
    return Corner.BR;
  }
  return Corner.NONE;
};

export { getRegionAroundIndex, initializeWinnableConfig, cornerToRound };
