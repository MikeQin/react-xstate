import React, { useState, useEffect } from 'react';
import './App.css';
import PaymentForm from './Components/PaymentForm';
import NavBar from './Components/NavBar';
import MakeCoffee from './Components/MakeCoffee';

const container = {
  display: "flex",
  justifyContent: 'center'
};

function App() {

  const [view, setView] = useState(true);

  useEffect(() => {
    console.log("view", view);
  }, [view]);

  return (
    <div className="App">
      <NavBar view={view} setView={setView} />
      <h4 style={{ marginTop: '25px', color: '#0A6640' }} className="bp3-heading">
        xState (FSM) + Blueprint (UI)
      </h4>
      <div style={container}>
        {view ? (<PaymentForm />)
          : <MakeCoffee />}
      </div>
    </div>
  );
}

export default App;
