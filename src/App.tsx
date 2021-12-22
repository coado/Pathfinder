import React, { useState, useEffect } from 'react';
import { PathfindingVisualizer } from './PathfindingVisualizer/PathfindingVisualizer'; 
import './App.css';

function App() {
  const [mousePressed, setMousePressed] = useState(false)
  const [start, setStart] = useState(false)
  const [end, setEnd] = useState(false)
  const [weight, setWeight] = useState(false)

  const handleMouseUp = () => {
    setMousePressed(false)
    setStart(false)
    setEnd(false)
  }
  useEffect(() => {
    console.log(weight);
  }, [weight])

  return (
    <div className='App'  onMouseUp={handleMouseUp}>
      <PathfindingVisualizer 
        end={end}
        setEnd={setEnd}
        start={start}
        setStart={setStart} 
        mousePressed={mousePressed} 
        setMousePressed={setMousePressed} 
        weight={weight}
        setWeight={setWeight}  
      />
    </div>

  );
}

export default App;
