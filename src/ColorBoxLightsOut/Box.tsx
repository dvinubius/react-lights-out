import React from 'react';
import './Box.css';

export enum Corner {
  TL, TR, BL, BR, NONE, ALL
}

export interface BoxProps {
  width: number;
  height: number;
  active: boolean;
  isTargeted: boolean;
  turnTrigger: number;
  sinkTrigger: number;
  beenClicked: (index: number) => void;
  beenEntered: (index: number) => void;
  beenLeft: (index: number) => void;
  toggleMe: (index: number) => void;
  index: number;
  rounded: Corner;
  frozen: boolean;
}

interface BoxState {
  innerState: InnerMachineState,
  outerState: OuterMachineState,
}

enum InnerMachineState {
  ABSENT = 'absent',
  SINKING = 'sinking',
  SUNK = 'sunk',
  TURNING = 'turning',
  RETURNING = 'returning'
}

enum OuterMachineState {
  IN = 'in',
  OUT = 'out'
}

class Box extends React.Component<BoxProps> {
  state: BoxState = {
    innerState: InnerMachineState.ABSENT,
    outerState: OuterMachineState.OUT,
  }

  get sunkStates(): InnerMachineState[] {
    return [
      InnerMachineState.SINKING,
      InnerMachineState.SUNK,
      InnerMachineState.RETURNING
    ]
  };


  render() {
    const isTurning = this.state.innerState === InnerMachineState.TURNING;
    const isSunk = this.sunkStates.includes(this.state.innerState);
    const showAsTargeted = this.props.isTargeted
      && isSunk
      && ![
        InnerMachineState.RETURNING,
        InnerMachineState.RETURNING,
        InnerMachineState.ABSENT
      ].includes(this.state.innerState);
    const classes: string = "ColorBoxLightsOut" 
      + (isTurning ? " turning" : "")
      + (isSunk  ? " sunk" : "")
      + (showAsTargeted ? " targeted" : "")
      + (this.getCornerRoundingClass())
      + (this.props.frozen ? ' frozen' : '');
    return (
      <div className={classes}
        style={this.computeSizeCss()}
        onMouseEnter={this.enterHandler}
        onMouseLeave={this.leaveHandler}
        >
        <div className={"inner" + (this.props.active ? '' : ' transparent')}
          onClick={this.clickHandler}
          onTransitionEnd={this.handleTransitionEnd}></div>
        </div>
      )
  }

  componentDidUpdate(prevProps: BoxProps, prevState: BoxState){
    if (prevProps.turnTrigger < this.props.turnTrigger){
      this.turn();
    }
    if (prevProps.sinkTrigger < this.props.sinkTrigger){
      this.sink();
    }
    if (prevProps.sinkTrigger > this.props.sinkTrigger){
      this.unSink();
    }
  }
  
  computeSizeCss = () => ({
    width: this.props.width+'px',
    height: this.props.height+'px'
  });

  enterHandler = () => {
    this.props.beenEntered(this.props.index);
  }
  leaveHandler = () => {
    this.props.beenLeft(this.props.index);
  }
  
  sink = () => {
    switch (this.state.innerState) {
      case InnerMachineState.ABSENT:
      case InnerMachineState.RETURNING:
        this.setState({
          innerState: InnerMachineState.SINKING,
          outerState: OuterMachineState.IN
        });
        return;
      default:
        this.setState({
          outerState: OuterMachineState.IN
        });
        return;
    }
  }

  unSink = () => {
    if (
      [InnerMachineState.SINKING, InnerMachineState.SUNK].includes(
        this.state.innerState
      )
    ) {
      this.setState({
        innerState: InnerMachineState.ABSENT,
        outerState: OuterMachineState.OUT
      });
      return;
    }
    this.setState({ outerState: OuterMachineState.OUT });
  }

  clickHandler = () => {
    this.props.beenClicked(this.props.index);
  }

  turn = () => {
    switch (this.state.innerState) {
      case InnerMachineState.SINKING:
      case InnerMachineState.SUNK:
        this.setState({innerState: InnerMachineState.TURNING});
        return;
      default:
        return;
    }
  }

  handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    event.persist();
    const update = (currState: BoxState) => {
      if (event.propertyName === 'font-size') {
        switch (currState.innerState) {
          case InnerMachineState.SINKING:
            return {innerState: InnerMachineState.SUNK}
          default:
            break;
        }
      }
      
      if (event.propertyName === 'font-weight') {
        switch (currState.innerState) {
          case InnerMachineState.TURNING:
            this.props.toggleMe(this.props.index);
            return {innerState: InnerMachineState.RETURNING};
          case InnerMachineState.RETURNING:
            return currState.outerState === OuterMachineState.OUT
              ? {innerState: InnerMachineState.ABSENT}
              : {innerState: InnerMachineState.SUNK};
          default:
            break;
        }
      }
    }
    this.setState(update);
  };

  getCornerRoundingClass() {
    switch (this.props.rounded) {
      case Corner.TL:
        return ' top-left-rounded';
      case Corner.TR:
        return ' top-right-rounded';
      case Corner.BL:
        return ' bottom-left-rounded';
      case Corner.BR:
        return ' bottom-right-rounded';
      case Corner.ALL:
        return ' all-rounded';
      case Corner.NONE:
        return '';
    }
  }
}


export default Box;