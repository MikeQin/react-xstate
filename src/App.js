import React from 'react';
import './App.css';
import { TogglerButton } from './components/TogglerButton';
import { PromiseButton } from './components/PromiseButton';
import { LightButton } from './components/LightButton';
import { NestedFSMachine } from './components/NestedFSMachine';

function App() {
  return (
    <div className="button">
      <TogglerButton />
      <PromiseButton />
      <LightButton />
      <NestedFSMachine />
    </div>
  );
}

export default App;
