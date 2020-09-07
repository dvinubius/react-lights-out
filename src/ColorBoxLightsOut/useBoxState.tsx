import { useState, useRef, useEffect, useCallback } from "react";

export interface BoxState {
  inner: InnerMachineState;
  outer: OuterMachineState;
}

export enum InnerMachineState {
  ABSENT = "absent",
  SINKING = "sinking",
  SUNK = "sunk",
  TURNING = "turning",
  RETURNING = "returning",
}

export enum OuterMachineState {
  IN = "in",
  OUT = "out",
}

const sunkStates: InnerMachineState[] = [
  InnerMachineState.SINKING,
  InnerMachineState.SUNK,
  InnerMachineState.RETURNING,
];

const useBoxState = (
  toggleTargeted: () => void,
  turnTrigger: number,
  sinkTrigger: number
): {
  handleTransitionEnd: (event: React.TransitionEvent<HTMLDivElement>) => void;
  canShowAsTargeted: boolean;
  isTurning: boolean;
  isSunk: boolean;
} => {
  const [boxState, setBoxState] = useState({
    inner: InnerMachineState.ABSENT,
    outer: OuterMachineState.OUT,
  });

  const sink = useCallback(() => {
    switch (boxState.inner) {
      case InnerMachineState.ABSENT:
      case InnerMachineState.RETURNING:
        setBoxState({
          inner: InnerMachineState.SINKING,
          outer: OuterMachineState.IN,
        });
        return;
      default:
        setBoxState((oldBoxState: BoxState) => ({
          ...oldBoxState,
          outer: OuterMachineState.IN,
        }));
        return;
    }
  }, [boxState.inner]);

  const unSink = useCallback(() => {
    if (
      [InnerMachineState.SINKING, InnerMachineState.SUNK].includes(
        boxState.inner
      )
    ) {
      setBoxState({
        inner: InnerMachineState.ABSENT,
        outer: OuterMachineState.OUT,
      });
      return;
    }
    setBoxState((oldState: BoxState) => ({
      ...oldState,
      outer: OuterMachineState.OUT,
    }));
  }, [boxState.inner]);

  const turn = useCallback(() => {
    switch (boxState.inner) {
      case InnerMachineState.SINKING:
      case InnerMachineState.SUNK:
        setBoxState((oldBoxState: BoxState) => ({
          ...oldBoxState,
          inner: InnerMachineState.TURNING,
        }));
        return;
      default:
        return;
    }
  }, [boxState.inner]);

  const prevTurnTrigger = useRef(0);
  const prevSinkTrigger = useRef(0);

  useEffect(() => {
    if (prevTurnTrigger.current < turnTrigger) {
      turn();
    }
    if (prevSinkTrigger.current < sinkTrigger) {
      sink();
    }
    if (prevSinkTrigger.current > sinkTrigger) {
      unSink();
    }

    prevTurnTrigger.current = turnTrigger;
    prevSinkTrigger.current = sinkTrigger;
  }, [turnTrigger, sinkTrigger, turn, sink, unSink]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>
  ) => {
    event.persist();
    const update = (oldBoxState: BoxState) => {
      if (event.propertyName === "font-size") {
        switch (oldBoxState.inner) {
          case InnerMachineState.SINKING:
            return { ...oldBoxState, inner: InnerMachineState.SUNK };
          default:
            break;
        }
      }

      if (event.propertyName === "font-weight") {
        switch (oldBoxState.inner) {
          case InnerMachineState.TURNING:
            toggleTargeted();
            return { ...oldBoxState, inner: InnerMachineState.RETURNING };
          case InnerMachineState.RETURNING:
            return {
              ...oldBoxState,
              inner:
                oldBoxState.outer === OuterMachineState.OUT
                  ? InnerMachineState.ABSENT
                  : InnerMachineState.SUNK,
            };
          default:
            break;
        }
      }
      return oldBoxState;
    };
    setBoxState(update);
  };

  const isSunk = sunkStates.includes(boxState.inner);
  const canShowAsTargeted =
    isSunk &&
    ![
      InnerMachineState.RETURNING,
      InnerMachineState.RETURNING,
      InnerMachineState.ABSENT,
    ].includes(boxState.inner);

  const isTurning = boxState.inner === InnerMachineState.TURNING;

  return {
    handleTransitionEnd,
    canShowAsTargeted,
    isTurning,
    isSunk,
  };
};

export { useBoxState, sunkStates };
