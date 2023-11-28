import React, { useMemo, useCallback } from "react";
import "./Box.css";
import { useBoxState } from "./useBoxState";

export enum Corner {
  TL,
  TR,
  BL,
  BR,
  NONE,
  ALL,
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

const Box: React.FC<BoxProps> = (props: BoxProps) => {
  const {
    width,
    height,
    active,
    isTargeted,
    turnTrigger,
    sinkTrigger,
    index,
    rounded,
    frozen,
    beenClicked,
    beenEntered,
    beenLeft,
    toggleMe,
  } = props;

  const toggleTargeted = useCallback(() => toggleMe(index), [toggleMe, index]);

  const {
    handleTransitionEnd,
    canShowAsTargeted,
    isTurning,
    isSunk,
  } = useBoxState(toggleTargeted, turnTrigger, sinkTrigger);

  const enterHandler = () => {
    beenEntered(index);
  };
  const leaveHandler = () => {
    beenLeft(index);
  };

  const clickHandler = () => {
    beenClicked(index);
  };

  const cornerRoundingClass = useMemo(() => {
    switch (rounded) {
      case Corner.TL:
        return " top-left-rounded";
      case Corner.TR:
        return " top-right-rounded";
      case Corner.BL:
        return " bottom-left-rounded";
      case Corner.BR:
        return " bottom-right-rounded";
      case Corner.ALL:
        return " all-rounded";
      case Corner.NONE:
        return "";
    }
  }, [rounded]);

  const sizeCss = useMemo(
    () => ({
      width: width + "px",
      height: height + "px",
    }),
    [width, height]
  );

  const showAsTargeted = isTargeted && canShowAsTargeted;
  const classes: string =
    "ColorBoxLightsOut" +
    (isTurning ? " turning" : "") +
    (isSunk ? " sunk" : "") +
    (showAsTargeted ? " targeted" : "") +
    cornerRoundingClass +
    (frozen ? " frozen" : "");
  return (
    <div
      className={classes}
      style={sizeCss}
      onMouseEnter={enterHandler}
      onMouseLeave={leaveHandler}
    >
      <div
        className={"inner" + (active ? "" : " transparent")}
        onClick={clickHandler}
        onTransitionEnd={handleTransitionEnd}
      ></div>
    </div>
  );
};

export default Box;
