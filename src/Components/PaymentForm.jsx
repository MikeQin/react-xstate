import React, { useState, useEffect } from 'react';
import { FormGroup, InputGroup, Button, Intent } from "@blueprintjs/core";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

const stateMachine = Machine({
  id: "paymentForm",
  context: {
    message: ''
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        SUBMIT: [
          {
            target: "loading",
            cond: (context, event) => (
              event.data.name && event.data.card
            )
          },
          {
            target: "failure"
          }
        ]
      }
    },
    loading: {
      invoke: {
        id: "doPayment",
        src: () => {
          return paymentGateway();
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
          target: "loading",
          cond: (context, event) => (
            event.data.name && event.data.card
          )
        }
      }
    }
  }
});

function paymentGateway() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.6) {
        resolve('Payment was received at Payment Gateway');
      }
      else {
        reject('Payment was rejected at Payment Gateway');
      }
    }, 3000);
  });
};

const PaymentForm = () => {
  const [currentState, send] = useMachine(stateMachine);
  const [form, setForm] = useState({
    name: '',
    card: ''
  });

  useEffect(() => {
    console.log("[*] state.value:", currentState.value);
  }, [currentState]);

  // DO NOT NEED to USE 'service' for react
  /******************************************/
  // Method passed is executed during rendering
  // const service = useMemo(() => {
  //   const theService = interpret(stateMachine).onTransition(
  //     state => {
  //       if (state.changed) { // notified state change
  //         console.log(state.value);
  //       }
  //   });
  //   // start the service
  //   theService.start();
  //   return theService;
  //   // eslint-disable-next-line
  // }, []);

  // Method passed is executed after render is committed
  // useEffect(() => {
  //   return () => {
  //     service.stop();
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    send({
      type: 'SUBMIT',
      data: { ...form }
    });
    // service.send({
    //   type: 'SUBMIT',
    //   data: { ...form }
    // });
    // setForm({
    //   name: '',
    //   card: ''
    // });
  }

  return (
    <div style={{ marginLeft: '150px', marginRight: '150px', marginTop: '50px', marginBottom: '50px' }}>
      <form onSubmit={handleSubmit} >
        <h1 className="bp3-heading">Payment Form</h1>
        <p >(xState)</p>
        <FormGroup
          helperText=""
          label="Name on card"
          labelFor="name"
          labelInfo="(required)"
          inline={false}
          intent={Intent.PRIMARY}
        >
          <InputGroup
            id="name"
            placeholder="Name on card"
            value={form.name}
            onChange={
              e => (setForm(prev => ({ ...prev, name: e.target.value })))
            }
          />
        </FormGroup>
        <FormGroup
          helperText=""
          label="Card number"
          labelFor="card"
          labelInfo="(required)"
          inline={false}
          intent={Intent.PRIMARY}
        >
          <InputGroup
            id="card"
            placeholder="Card number"
            value={form.card}
            onChange={
              e => (setForm(prev => ({ ...prev, card: e.target.value })))
            }
          />

        </FormGroup>
        <FormGroup>
          <Button
            type="submit"
            intent={Intent.PRIMARY}
          >
            Submit
        </Button>
        </FormGroup>
      </form>
      <br />
      {currentState.matches('failure') ?
        (
          <p style={{ color: '#C23030' }}>
            {currentState.context.message ? currentState.context.message : ''}
          </p>
        )
        :
        <p style={{ color: '#15B371' }}>
          {currentState.context.message ? currentState.context.message : ''}
        </p>
      }

    </div>
  );
}

export default PaymentForm;