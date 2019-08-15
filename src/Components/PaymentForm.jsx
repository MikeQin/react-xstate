import React, { useState, useEffect } from "react";
import { FormGroup, InputGroup, Button, Intent } from "@blueprintjs/core";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

const machine = Machine({
  id: "paymentForm",
  context: {
    message: ""
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        SUBMIT: [
          {
            target: "loading",
            cond: (context, event) => event.data.name && event.data.card
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
        src: (context, event) =>
          paymentGateway(event.data.name, event.data.card),
        onDone: {
          target: "success",
          // set Context.message
          actions: assign({ message: (context, event) => event.data })
        },
        onError: {
          target: "failure",
          // set Context.message
          actions: assign({ message: (context, event) => event.data })
        }
      }
    },
    success: {
      type: "finish"
    },
    failure: {
      on: {
        SUBMIT: {
          target: "loading",
          cond: (context, event) => event.data.name && event.data.card
        }
      }
    }
  }
});

function paymentGateway(name, card) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(
          "Payment was RECEIVED at Payment Gateway. " + name + ", " + card
        );
      } else {
        reject("Payment was REJECTED! Try again... " + name + ", " + card);
      }
    }, 3000);
  });
}

const PaymentForm = () => {
  const [state, send] = useMachine(machine);
  const [form, setForm] = useState({
    name: "",
    card: ""
  });

  useEffect(() => {
    console.log("[* PAYMENT.form] ", form);
    console.log("[* PAYMENT.state] ", state.value);
  }, [state, form]);

  // DO NOT NEED to USE 'service' for react
  /******************************************/
  // Method passed is executed during rendering
  // const service = useMemo(() => {
  //   const theService = interpret(Machine).onTransition(
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

  const handleSubmit = e => {
    e.preventDefault();
    send({
      type: "SUBMIT",
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
  };

  return (
    <div
      style={{
        marginLeft: "150px",
        marginRight: "150px",
        marginTop: "0px",
        marginBottom: "50px"
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1 className="bp3-heading">Payment Form</h1>
        <p>(xState)</p>
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
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
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
            onChange={e => setForm(prev => ({ ...prev, card: e.target.value }))}
          />
        </FormGroup>
        <br />
        <FormGroup>
          <Button type="submit" intent={Intent.PRIMARY} large={true}>
            Submit Payment
          </Button>
        </FormGroup>
      </form>
      <br />
      {state.matches("failure") ? (
        <p style={{ color: "#C23030" }}>
          {state.context.message ? state.context.message : ""}
        </p>
      ) : (
        <p style={{ color: "#15B371" }}>
          {state.context.message ? state.context.message : ""}
        </p>
      )}
      <p>
        finite state machine's state:{" "}
        {state.matches("success") ? "SUCCESS" : state.value.toUpperCase()}
      </p>
      <p>
        payment: [ {form.name}, {form.card} ]
      </p>
    </div>
  );
};

export default PaymentForm;
