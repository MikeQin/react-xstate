import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

const promiseMachine = Machine({
  id: "promise",
  initial: "pending",
  states: {
    pending: {
      on: {
        RESOLVE: "resolved",
        REJECT: "rejected"
      }
    },
    resolved: {
      type: "final"
    },
    rejected: {
      type: "final"
    }
  }
});

export const PromiseButton = () => {
  const [current, send] = useMachine(promiseMachine);

  useEffect(() => {
    console.log("promise state", current);
  }, [current]);

  return (
    <div className="button">
      <h1>Promise Machine</h1>
      <button onClick={() => send("RESOLVE")}>Send 'RESOLVE'</button>
      <p>State: {current.value}</p>
    </div>
  );
};
