const gameConfig = {
  numberOfBoxesPerSide: 10,
  margin: 120,
  durationInSec: 0.2,
  allRounded: false,
};

const totalNumberOfBoxes = gameConfig.numberOfBoxesPerSide ** 2;

const paddingInPage = 2 * gameConfig.margin;

const boxSize = Math.floor(
  (Math.min(window.innerWidth, window.innerHeight) - paddingInPage) /
    gameConfig.numberOfBoxesPerSide
);

export { gameConfig, totalNumberOfBoxes, paddingInPage, boxSize };
