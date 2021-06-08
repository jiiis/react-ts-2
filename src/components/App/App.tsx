import React from 'react';

import Recorder from '../Recorder'
import Calendar from '../Calendar'

import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <Recorder />
      <Calendar />
    </div>
  );
}

export default App;
