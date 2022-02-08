import React, { useState, useEffect, useRef } from 'react';
import { Node, INode } from '../components/Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar'; 
import { greedy } from '../algorithms/greedy';
import { dfs } from '../algorithms/dfs';
import { simpleMath } from '../algorithms/simpleMath';
import { Header } from '../components/Header/Header';
import maze1 from './maze1.json';
import  algorithmsInfo from './algorithmsInfo.json'
import './PathfindingVisualizer.styles.scss';

type draggingFunction = (value: boolean) => void
export type algorithmTypes = "Dijkstra" | "A*" | "DFS" | "Greedy" | "Simple Math";

interface IPathfindingVisualizer {
    mousePressed: boolean;
    dragStart: boolean;
    dragEnd: boolean;
    dragTarget: boolean;
    setDragStart: draggingFunction;
    setDragEnd: draggingFunction;
    setDragTarget: draggingFunction;
    setMousePressed: draggingFunction;
    setTutorialWindow: () => void
}

export interface IPaths {
    visitedNodes: INode[];
    targetShortestPath: INode[];
}

export const PathfindingVisualizer: React.FC<IPathfindingVisualizer> = (
    { dragTarget, 
      setDragTarget, 
      dragEnd, 
      setDragEnd, 
      dragStart, 
      setDragStart, 
      mousePressed, 
      setMousePressed,
      setTutorialWindow 
    }) => {

    const minDim = 25;
    const maxDim = 35
    
    const [algorithm, setAlgorithm] = useState<algorithmTypes>('Dijkstra')
    const [grid, setGrid] = useState<INode[][]>([])
    const [measuredTime, setMeasuredTime] = useState<number | null>(null)
    const [weight, setWeight] = useState({
        active: false,
        value: 10
    })
    const [dimensions, setDimensions] = useState({
        rows: minDim,
        columns: minDim*2
    })
    const [blockFunction, setBlockFunction] = useState(false)

    const target = useRef({
        active: false,
        row: 0,
        col: 0
    })

    const startNode = useRef({
        row: 0,
        col: 2
    })
    const endNode = useRef({
        row: 0,
        col: 5
    })
    

    /////// GENERATING BOARD CODE ---------------------------------------------------------------
    useEffect(() => {
        const initialGrid = getInitialGrid();
        setGrid(initialGrid)
    }, [dimensions])

    const getInitialGrid = (): INode[][] => {
        if (startNode.current.row > dimensions.rows - 1) startNode.current.row = dimensions.rows - 1
        if (startNode.current.col > dimensions.columns - 1) startNode.current.col = dimensions.columns - 1
        if (endNode.current.row > dimensions.rows - 1) endNode.current.row = dimensions.rows - 1
        if (endNode.current.col > dimensions.columns - 1) endNode.current.col = dimensions.columns - 1
        if (target.current.row > dimensions.rows - 1) target.current.row = dimensions.rows - 1
        if (target.current.col > dimensions.columns - 1) target.current.col = dimensions.columns - 1
        return getNewGrid()
    }

    const getNewGrid = (): INode[][] => {
        const newGrid: INode[][] = []

        for (let row = 0; row < dimensions.rows; row++) {
            const currentRow: INode[] = []
                for (let col = 0; col < dimensions.columns; col++) {
                    currentRow.push(createNode(col, row))
                }
            newGrid.push(currentRow)
        }
        return newGrid
    }

    const generateRandomMaze = () => {
        if (blockFunction) return
        const cacheGrid = getNewGrid()
        for (let row = 0; row < dimensions.rows; ++row) {
            for (let col = 0; col < dimensions.columns; ++col) {
                if (Math.floor(Math.random() + 1/4)) cacheGrid[row][col].isWall = true
            }
        }
        setGrid(cacheGrid)
    }

    const generateRandomMazeWithRandomWeights = () => {
        if (blockFunction) return
        const cacheGrid = getNewGrid()
        for (let row = 0; row < dimensions.rows; ++row) {
            for (let col = 0; col < dimensions.columns; ++col) {
                const randomNumber = Math.random()
                if (Math.floor(randomNumber + 1/5)) cacheGrid[row][col].isWall = true
                else {
                    if (Math.floor(randomNumber + 2/5)) {
                        const newRandomNumber = Math.ceil(Math.random()*100)
                        cacheGrid[row][col].isWeight = {
                            active: true,
                            value: newRandomNumber
                        }
                    }
                }
            }
        }
        setGrid(cacheGrid)
    }

    const generateMaze = () => {
        if (blockFunction) return
        const cacheGrid = getNewGrid()
        
        for (let row = 0; row < dimensions.rows; ++row) {
            for (let col = 0; col < dimensions.columns; ++col) {
                let current = `${row}-${col}`
                // @ts-expect-error
                if (maze1[current]?.isWall === true) { 
                    cacheGrid[row][col].isWall = true
                }                       
            }
        }
        setGrid(cacheGrid)
    }



    //////// CLEARING FUNCTIONS -----------------------------------------------------------------    
    const clearPaths = () => {
        if (blockFunction) return
        let newGrid = grid.slice();
        for (let row = 0; row < dimensions.rows; row++) {
            for (let col = 0; col < dimensions.columns; col++) {
                const DOMNode = document.getElementById(`node-${row}-${col}`)
                const reactNode = newGrid[row][col]
                if (DOMNode) 
                    DOMNode.classList.remove('Node__visited', 'Node__shortestPath', 'Node__visitedTarget', 'Node__shortestTargetPath') 

                reactNode.isVisited = false
                reactNode.distance = Infinity
                reactNode.previousNode = null
            }
        }
        setGrid(newGrid)
    }

    const clearBoard = () => {
        if (blockFunction) return
        clearPaths()
        const newGrid = getNewGrid()
        setGrid(newGrid)
    }
    
    ///////////////////////////////////////////////////////////////////////////////////

    const createNode = (col: number, row: number): INode => {
        return {
            col,
            row,
            isStart: row === startNode.current.row && col === startNode.current.col,
            isEnd: row === endNode.current.row && col === endNode.current.col,
            distance: Infinity,
            hdistance: Infinity,
            isVisited: false,
            isTarget: target.current.active && row === target.current.row && col === target.current.col,
            isWeight: {
                active: false,
                value: 10
            },
            isWall: false,
            previousNode: null,
          };
    }




    //////////////////// ANIMATING ---------------------------------------------------------------------  

    const animateAlgorithm = (visitedNodesInOrder: INode[], shortestPath: INode[]) => {
        let target = false
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            // It has to be done this way, becaue setTimeout is async function
            // or idk why
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(shortestPath)
                }, 10 * i)
                return 
            }
            
            // eslint-disable-next-line no-loop-func
            setTimeout(() => {
                // It's not a good practice in React, but we need tremendous rerendering speed
                if (visitedNodesInOrder[i].isTarget) target = true
                const { row, col } = visitedNodesInOrder[i]
                const currentNode = document.getElementById(`node-${row}-${col}`)
                if (currentNode){
                    if (!target) currentNode.classList.add('Node__visited') 
                    else currentNode.classList.add('Node__visitedTarget')
                }
            }, 10 * i)
        }
    }

    const animateShortestPath = (shortestPath: INode[]) => {
        let target = false
        
        if (!shortestPath.length) return setBlockFunction(false)  
        
        for (let i = 0; i < shortestPath.length; i++) {
            // eslint-disable-next-line no-loop-func
            setTimeout(() => {
                const { row, col } = shortestPath[i]
                const currentNode = document.getElementById(`node-${row}-${col}`)
                if (shortestPath[i].isTarget) target = true
                if (currentNode) {
                    if(!target) currentNode.classList.add('Node__shortestPath')
                    else currentNode.classList.add('Node__shortestTargetPath')
                }

                if (i === shortestPath.length - 1) {
                    setBlockFunction(false) 
                }
            // not working without * i
            }, 25 * i)
        }          
        
    }

    const callAlgorithm = (
        fn: (grid: INode[][] ,startNodeData: INode, endNodeData: INode, target: boolean, targetNode: INode) => IPaths,
        startNodeData: INode,
        endNodeData: INode,
    ) => {
        const targetNode = grid[target.current.row][target.current.col]
        const start = performance.now()
        const visitedNodes = fn(grid, startNodeData, endNodeData, target.current.active, targetNode)
        const end = performance.now()
        setMeasuredTime(end-start)
        return visitedNodes
    }
    
    const visualizeAlgorithm = () => {
        if (blockFunction) return
        clearPaths()
        let paths: IPaths;
       // let visitedNodes: INode[], targetShortestPath: INode[]
        const startNodeData = grid[startNode.current.row][startNode.current.col]
        const endNodeData = grid[endNode.current.row][endNode.current.col] 
        
         switch (algorithm) {
            case 'A*':
                paths = callAlgorithm(astar, startNodeData, endNodeData)
                break
            case 'Greedy':
                paths = callAlgorithm(greedy, startNodeData, endNodeData)
                break
            case 'DFS':
                paths = callAlgorithm(dfs, startNodeData, endNodeData)
                break
            case 'Simple Math':
                paths = callAlgorithm(simpleMath, startNodeData, endNodeData)
                break
            default:
                paths = callAlgorithm(dijkstra, startNodeData, endNodeData)
        }
        const { visitedNodes, targetShortestPath } = paths

        if (!visitedNodes) return    
        const nodesInShortestPath = getShortestPath(visitedNodes[visitedNodes.length-1], targetShortestPath) 
        setBlockFunction(true) 
        animateAlgorithm(visitedNodes, nodesInShortestPath)

    }

    const getShortestPath = (lastNode: INode, targetShortestPath: INode[]) => {
        if (!lastNode.isEnd) return []
        const shortestPath: INode[] = []
  
        while (lastNode.previousNode) {
            shortestPath.unshift(lastNode)
            lastNode = lastNode.previousNode
        }

        return targetShortestPath.concat(shortestPath)
    }
    ///////////////////////////////////////////////////////////////////////////////////

    const handleMouseDown = (row: number, col: number) => {
        if (blockFunction) return
        let currentNode = grid[row][col]    
        if (currentNode.isStart) return setDragStart(true)
        if (currentNode.isEnd) return setDragEnd(true)
        if (currentNode.isTarget) return setDragTarget(true)
        setMousePressed(true)
        generateObject(row, col)
    }

    const handleMouseEnter = (row: number, col: number) => {
        if (blockFunction) return
        if (dragStart) return generateStart(row, col)
        if (dragEnd) return generateEnd(row, col)
        if (dragTarget) return generateNewTarget(row, col)
        if (mousePressed) return generateObject(row, col)
    } 

    const generateStart = (row: number, col: number) => {
        const cacheGrid = grid.slice()
        let currentNode = cacheGrid[row][col]
        if (currentNode.isEnd || currentNode.isTarget) return
        cacheGrid[startNode.current.row][startNode.current.col].isStart = false
        currentNode.isStart = true
        startNode.current.row = row
        startNode.current.col = col
        setGrid(cacheGrid)
    }

    const generateEnd = (row: number, col: number) => {
        const cacheGrid = grid.slice()
        let currentNode = cacheGrid[row][col]
        if (currentNode.isStart || currentNode.isTarget) return
        cacheGrid[endNode.current.row][endNode.current.col].isEnd = false
        currentNode.isEnd = true
        endNode.current.row = row
        endNode.current.col = col
        setGrid(cacheGrid)
    }

    const generateNewTarget = (row: number, col: number) => {
        const cacheGrid = grid.slice()
        const currentNode = cacheGrid[row][col]
        if (currentNode.isStart || currentNode.isEnd) return
        cacheGrid[target.current.row][target.current.col].isTarget = false
        currentNode.isTarget = true
        target.current.row = row
        target.current.col = col
        setGrid(cacheGrid)
    }

    const generateObject = (row: number, col: number) => {
        const cacheGrid = grid.slice()
        let currentNode = cacheGrid[row][col]
        if (currentNode.isStart || currentNode.isEnd) return
        if (weight.active) {
            if (currentNode.isWall) return
            currentNode.isWeight = {
                active: !currentNode.isWeight.active,
                value: weight.value
            }
        } 
        else {
            if (currentNode.isWeight.active) return
            currentNode.isWall = !currentNode.isWall
        }
        setGrid(cacheGrid)
    } 

    const generateTarget = () => {
        if (blockFunction) return
        const cacheGrid = grid.slice()
        const { active, row, col } = target.current
        
        if ( active ) {
             cacheGrid[row][col].isTarget = false
            
        }
        else cacheGrid[row][col].isTarget = true
        setGrid(cacheGrid)
        target.current.active = !target.current.active
    }

    /// 313123

    return (
        <>
            <Header 
                clearBoard={clearBoard}
                clearPaths={clearPaths}
                setWeight={setWeight} 
                weight={weight} 
                setDimensions={setDimensions} 
                currentAlgorithm={algorithm} 
                setAlgorithm={setAlgorithm} 
                startAlgorithm={visualizeAlgorithm} 
                generateTarget={generateTarget}
                generateRandomMaze={generateRandomMaze}
                generateRandomMazeWithRandomWeights={generateRandomMazeWithRandomWeights}
                generateMaze={generateMaze}
                minDim={minDim}
                maxDim={maxDim}
                block={blockFunction}
                setTutorialWindow={setTutorialWindow}
            />
            <div className='Container'>
                <div className='Info'>
                    <p className='Info__text'>{algorithmsInfo[algorithm]}</p>
                </div>
                <div className='Board' onMouseUp={() => setMousePressed(false)}>
                    {
                        grid.map((row, rowIndex) => {
                            return <div className='Board__row' key={rowIndex} >
                                    {
                                        row.map((node, colIndex) => {
                                            const { isStart, isEnd, isWall, isWeight, isVisited, isTarget } = node;
                                            return <Node 
                                                        row={rowIndex} 
                                                        col={colIndex} 
                                                        isStart={isStart} 
                                                        isEnd={isEnd}  
                                                        isWall={isWall}
                                                        isWeight={isWeight}
                                                        isTarget={isTarget}
                                                        key={colIndex}
                                                        isVisited={isVisited}
                                                        // the lowest amount of all nodes
                                                        // decreasing size of node linearly
                                                        dimension={1 + minDim * minDim * 2 / (dimensions.rows*dimensions.columns)}
                                                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                                        >
                                                    </Node>
                                        })
                                    }
                                </div>
                        })
                    }
                </div>
                <div className='ComputationTime'>
                    <h1 className='ComputationTime__header'>Computation <br /> Time:</h1>
                    <span className='ComputationTime__value'>{measuredTime !== null ? measuredTime === 0 ? '< 1 ms' : `${Math.round(measuredTime)}ms` : null}</span>
                </div>
            </div>
        </>
   
)}
