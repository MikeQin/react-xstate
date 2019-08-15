import { Machine } from "xstate";

// Use for xState design and visualization
// xState Visualizer: https://statecharts.github.io/xstate-viz/
const machine = Machine({
  id: "Simple State Machine",
  initial: "idle",
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: "loading"
        }
      }
    },
    loading: {
      on: {
        SUCCESS: {
          target: "success"
        },
        ERROR: {
          target: "failure"
        }
      }
    },
    success: {
      type: "finish"
    },
    failure: {
      on: {
        SUBMIT: {
          target: "loading"
        }
      }
    }
  }
});

export default machine;
