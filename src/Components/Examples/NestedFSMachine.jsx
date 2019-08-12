import React, { useState, useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

const pedestrianStates = {
  initial: "walk",
  states: {
    walk: {
      on: {
        PED_TIMER: "wait"
      }
    },
    wait: {
      on: {
        PED_TIMER: "stop"
      }
    },
    stop: {}
  }
};

const lightMachine = Machine({
  key: "light",
  initial: "green",
  states: {
    green: {
      on: {
        TIMER: "yellow"
      }
    },
    yellow: {
      on: {
        TIMER: "red"
      }
    },
    red: {
      on: {
        TIMER: "green"
      },
      ...pedestrianStates
    }
  }
});

// const currentState = 'yellow';

// const nextState = lightMachine
//   .transition(currentState, 'TIMER')
//   .value;
// // => {
// //   red: 'walk'
// // }

// lightMachine.transition('red.walk', 'PED_TIMER')
//   .value;
// => {
//   red: 'wait'
// }

export const NestedFSMachine = () => {
  const [current, send] = useMachine(lightMachine);
  const [state, setState] = useState("");

  useEffect(() => {
    console.log("nested state", current);
  }, [current]);

  const handleClick = () => {
    console.log("current state", current.value, current.value.red);
    if (current.value.red) {
      send("PED_TIMER");
      setState(current.value.red);
      if (current.value.red === "stop") {
        send("TIMER");
        setState(current.value.red);
      }
    } else {
      send("TIMER");
      setState(current.value);
    }
  };

  return (
    <div className="button">
      <h1>Nested Finite State Machine</h1>
      <button onClick={handleClick}>Send 'TIMER' or 'PED_TIMER'</button>
      <p>State: {state}</p>
    </div>
  );
};
