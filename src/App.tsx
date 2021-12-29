import { useState } from 'react';
import { PathfindingVisualizer } from './PathfindingVisualizer/PathfindingVisualizer'; 
import './App.css';

function App() {
  const [mousePressed, setMousePressed] = useState(false)
  const [dragStart, setDragStart] = useState(false)
  const [dragEnd, setDragEnd] = useState(false)
  const [dragTarget, setDragTarget] = useState(false)

  const handleMouseUp = () => {
    setMousePressed(false)
    setDragStart(false)
    setDragEnd(false)
    setDragTarget(false)
  }


  return (
    <div className='App'  onMouseUp={handleMouseUp}>
      <PathfindingVisualizer 
        dragEnd={dragEnd}
        setDragEnd={setDragEnd}
        dragStart={dragStart}
        setDragStart={setDragStart}
        dragTarget={dragTarget} 
        setDragTarget={setDragTarget}
        mousePressed={mousePressed} 
        setMousePressed={setMousePressed} 
      />
    </div>

  );
}

export default App;
