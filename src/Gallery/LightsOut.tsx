import React from 'react';
import Box, { Corner } from '../ColorBoxLightsOut/Box';
import './LightsOut.css';
import Gallery, { GalleryProps } from '../Gallery-Layout/Gallery';

interface LightsOutState {
  active: boolean[];
  targetedBoxes: boolean[];
  turnTriggers: number[];
  sinkTriggers: number[];
}

class LightsOut extends React.Component {
  config = {
    numberOfBoxesPerSide: 10,
    margin: 120,
    durationInSec: 0.2,
    allRounded: false,
  }
  state = {
    active: this.initializeWinnableConfig(this.config.numberOfBoxesPerSide * 2),
    targetedBoxes: new Array(this.config.numberOfBoxesPerSide**2).fill(false),
    turnTriggers: new Array(this.config.numberOfBoxesPerSide**2).fill(0),
    sinkTriggers: new Array(this.config.numberOfBoxesPerSide**2).fill(0),
  }

  private initializeWinnableConfig(n: number): boolean[] {
    const total = this.config.numberOfBoxesPerSide**2;
    const result: boolean[] = new Array(total).fill(false);
    for (let i = 0; i < 13; i++) {
      const index = Math.floor(Math.random()*total);
      const region = this.getRegionAroundIndex(index);
      region.forEach(j => result[j] = !result[j]);
    }
    return result;
  }

  renderBoxes = (boxSize: number) => {
    return new Array(this.config.numberOfBoxesPerSide**2).fill('').map((_, index) =>
      <Box
        frozen={!this.gameOn}
        width={boxSize}
        height={boxSize}
        index={index}
        active={this.state.active[index]}
        rounded={this.cornerToRound(index)}
        isTargeted={this.state.targetedBoxes[index]}

        turnTrigger={this.state.turnTriggers[index]}
        sinkTrigger={this.state.sinkTriggers[index]}
        beenClicked={this.handleClicked}
        beenEntered={this.handleEntered}
        beenLeft={this.handleLeft}
        toggleMe={this.toggleTargetedBox}
        key={index}></Box>)
  
  }
  render() {
    const props: GalleryProps = {
      renderBoxes: this.renderBoxes,
      ...this.config
    }
    const message = this.gameOn ? 'Lights Out' : 'Nailed it!'
    return <>
      <h1 className="lightsout">{message}</h1>
      <Gallery {...props}/>
    </>;
  }

  get gameOn(): boolean {
    return this.state.active.some(boxActive => boxActive);
  }
  
  handleEntered = (i: number) => this.setState((currSt: LightsOutState) => this.sinkAroundIndex(currSt, i));
  handleLeft = (i: number) => this.setState((currSt: LightsOutState) => this.unSinkAroundIndex(currSt, i));
  handleClicked = (i: number) => this.setState((currSt: LightsOutState) => this.turnAroundIndex(currSt, i));
  
  toggleTargetedBox = (i: number) => {
    const update = (currSt: LightsOutState) => {
      const newVals = currSt.active.slice();
      newVals[i] = !newVals[i];
      return {active: newVals};
    }
    this.setState(update);
  }
  
  private getRegionAroundIndex(index: number): number[] {
      const side = this.config.numberOfBoxesPerSide;
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
      if (index + side < side**2) {
        region.push(index + side);
      }
      return region;
  }

  private sinkAroundIndex(currSt: LightsOutState, index: number): Partial<LightsOutState> {
    const triggerVals = currSt.sinkTriggers.slice();
    const targetedFlags = currSt.targetedBoxes.slice();
    this.getRegionAroundIndex(index).forEach(i => {
      triggerVals[i]++;
      targetedFlags[i] = true;
    });
    return {
      sinkTriggers: triggerVals,
      targetedBoxes: targetedFlags
    };
  }
  
  private unSinkAroundIndex(currSt: LightsOutState, index: number): Partial<LightsOutState> {
    const triggerVals = currSt.sinkTriggers.slice();
    const targetedFlags = currSt.targetedBoxes.slice();
    this.getRegionAroundIndex(index).forEach(i => {
      triggerVals[i]--;
      targetedFlags[i] = false;
    });
    return {
      sinkTriggers: triggerVals,
      targetedBoxes: targetedFlags
    };
  }
  
  private turnAroundIndex(currSt: LightsOutState, index: number): Partial<LightsOutState> {
    const triggerVals = currSt.turnTriggers.slice();
    const targetedFlags = currSt.targetedBoxes.slice();
    this.getRegionAroundIndex(index).forEach(i => {
      triggerVals[i]++;
    });
    return {
      turnTriggers: triggerVals,
      targetedBoxes: targetedFlags
    };
  }

  private cornerToRound(i: number): Corner {
    if (this.config.allRounded) {
      return Corner.ALL;
    }
    if (i === 0) {
      return Corner.TL;
    }
    if (i === this.config.numberOfBoxesPerSide - 1) {
      return Corner.TR;
    }
    if (i === this.config.numberOfBoxesPerSide**2 - this.config.numberOfBoxesPerSide) {
      return Corner.BL;
    }
    if (i === this.config.numberOfBoxesPerSide**2 - 1) {
      return Corner.BR;
    }
    return Corner.NONE;
  }
}

export default LightsOut;