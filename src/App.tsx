import { useEffect, useState } from 'react';
import { PathfindingVisualizer } from './PathfindingVisualizer/PathfindingVisualizer'; 
import { TutorialWindow } from './components/Tutorial/TutorialWindow'; 
import './App.css';

function App() {
  const [mousePressed, setMousePressed] = useState(false)
  const [dragStart, setDragStart] = useState(false)
  const [dragEnd, setDragEnd] = useState(false)
  const [dragTarget, setDragTarget] = useState(false)
  const [tutorialWindow, setTutorialWindow] = useState(false)

  const handleMouseUp = () => {
    setMousePressed(false)
    setDragStart(false)
    setDragEnd(false)
    setDragTarget(false)
  }

  useEffect(() => {
    const data = window.localStorage.getItem('tutorial')
    if (!data) return setTutorialWindow(true)
    const preparedData: boolean = JSON.parse(data)
    if (!preparedData) return
    setTutorialWindow(true)
  }, [])


  return (
    <>
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
          setTutorialWindow={() => setTutorialWindow(true)} 
        />
      </div>

      {
        tutorialWindow && <TutorialWindow setTutorialWindow={() => setTutorialWindow(false)} />
      }
    </>
  );
}

export default App;
