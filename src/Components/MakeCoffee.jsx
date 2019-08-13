import React, { useState, useEffect } from 'react';
import { RadioGroup, Radio, FormGroup, InputGroup, Button, Intent } from "@blueprintjs/core";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

const machine = Machine({
  id: "makeCoffee",
  context: {
    message: ''
  },
  initial: "ready",
  states: {
    ready: {
      on: {
        SUBMIT: [
          {
            target: "processing",
            cond: (context, event) => (
              event.data.cupSize && event.data.creamer >= 0
              && event.data.sugar >= 0 && event.data.flavor
            )
          },
          {
            target: "failure"
          }
        ]
      }
    },
    processing: {
      invoke: {
        id: "doProcess",
        src: () => {
          return coffeeMachine();
        },
        onDone: {
          target: 'success',
          actions: assign({ message: (context, event) => (event.data) })
        },
        onError: {
          target: 'failure',
          actions: assign({ message: (context, event) => (event.data) })
        }
      }
    },
    success: {
      type: 'finish'
    },
    failure: {
      on: {
        SUBMIT: {
          target: "processing",
          cond: (context, event) => (
            event.data.cupSize && event.data.creamer >= 0
            && event.data.sugar >= 0 && event.data.flavor
          )
        }
      }
    }
  }
});

function coffeeMachine() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('Coffee is ready...');
      }
      else {
        reject('Sorry, there is a problem... please call support.');
      }
    }, 3000);
  });
};

const MakeCoffee = () => {
  const [state, send] = useMachine(machine);
  const [form, setForm] = useState({
    cupSize: '',
    creamer: 0,
    sugar: 0,
    flavor: ''
  });

  useEffect(() => {
    console.log("[* COFFEE.form] ", form);
    console.log("[* COFFEE.state] ", state.value);
  }, [state, form]);

  const handleSubmit = (e) => {
    e.preventDefault();
    send({
      type: 'SUBMIT',
      data: { ...form }
    });
  }

  return (
    <div style={{ marginLeft: '150px', marginRight: '150px', marginTop: '0px', marginBottom: '50px' }}>
      <form onSubmit={handleSubmit} >
        <h1 className="bp3-heading">Make Coffee</h1>
        <p >(xState)</p>
        <div style={{ textAlign: 'left', marginLeft: '75px' }}>
          <RadioGroup
            label="Cup Size"
            onChange={
              e => (setForm(prev => ({ ...prev, cupSize: e.currentTarget.value })))
            }
            selectedValue={form.cupSize}
          >
            <Radio label="Large" value="large" />
            <Radio label="Medium" value="medium" />
            <Radio label="Small" value="small" />
          </RadioGroup>
        </div>
        <FormGroup label="Creamer" labelFor="creamer" labelInfo="(required)"
          inline={false}
          intent={Intent.PRIMARY}
        >
          <InputGroup
            id="creamer"
            placeholder="Creamer count"
            value={form.creamer}
            onChange={
              e => (setForm(prev => ({ ...prev, creamer: e.target.value })))
            }
          />
        </FormGroup>
        <FormGroup label="Suger" labelFor="sugar" labelInfo="(required)"
          inline={false}
          intent={Intent.PRIMARY}
        >
          <InputGroup
            id="sugar"
            placeholder="Sugar count"
            value={form.sugar}
            onChange={
              e => (setForm(prev => ({ ...prev, sugar: e.target.value })))
            }
          />
        </FormGroup>
        <FormGroup label="Flavor" labelFor="flavor" labelInfo="(required)"
          inline={false}
          intent={Intent.PRIMARY}
        >
          <InputGroup
            id="flavor"
            placeholder="Flavor..."
            value={form.flavor}
            onChange={
              e => (setForm(prev => ({ ...prev, flavor: e.target.value })))
            }
          />
        </FormGroup>
        <br />
        <FormGroup>
          <Button
            type="submit"
            intent={Intent.PRIMARY}
            large={true}
          >
            Make Coffee
        </Button>
        </FormGroup>
      </form>
      <br />
      {
        state.matches('failure') ?
          <p style={{ color: '#C23030' }}>
            {state.context.message ? state.context.message : ''}
          </p>
          :
          <p style={{ color: '#15B371' }}>
            {state.context.message ? state.context.message : ''}
          </p>
      }
      <p>FSM: {state.matches('success') ? 'SUCCESS' : state.value.toUpperCase()}</p>
    </div >
  );
}

export default MakeCoffee;