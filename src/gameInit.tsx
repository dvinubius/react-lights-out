const gameConfig = {
  numberOfBoxesPerSide: 10,
  margin: 120,
  durationInSec: 0.2,
  allRounded: false,
};

const totalNumberOfBoxes = gameConfig.numberOfBoxesPerSide ** 2;

export { gameConfig, totalNumberOfBoxes };
