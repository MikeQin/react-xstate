import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

const toggleMachine = Machine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: { TOGGLE: "active" }
    },
    active: {
      on: { TOGGLE: "inactive" }
    }
  }
});

export const TogglerButton = () => {
  const [current, send] = useMachine(toggleMachine);

  useEffect(() => {
    console.log("toggle state", current);
  }, [current]);

  return (
    <div className="button">
      <h1>Toggle Machine</h1>
      <button onClick={() => send("TOGGLE")}>Send 'TOGGLE'</button>
      <p>State: {current.value}</p>
    </div>
  );
};
