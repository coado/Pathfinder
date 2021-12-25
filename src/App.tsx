import { useState } from 'react';
import { PathfindingVisualizer } from './PathfindingVisualizer/PathfindingVisualizer'; 
import './App.css';

function App() {
  const [mousePressed, setMousePressed] = useState(false)
  const [start, setStart] = useState(false)
  const [end, setEnd] = useState(false)

  const handleMouseUp = () => {
    setMousePressed(false)
    setStart(false)
    setEnd(false)
  }


  return (
    <div className='App'  onMouseUp={handleMouseUp}>
      <PathfindingVisualizer 
        end={end}
        setEnd={setEnd}
        start={start}
        setStart={setStart} 
        mousePressed={mousePressed} 
        setMousePressed={setMousePressed} 
      />
    </div>

  );
}

export default App;
