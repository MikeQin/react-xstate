import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

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
      }
    }
  }
});

export const LightButton = () => {
  const [current, send] = useMachine(lightMachine);

  useEffect(() => {
    console.log("light state", current);
  }, [current]);

  return (
    <div className="button">
      <h1>Light Machine</h1>
      <button onClick={() => send("TIMER")}>Send 'TIMER' Event</button>
      <p>State: {current.value}</p>
    </div>
  );
};
