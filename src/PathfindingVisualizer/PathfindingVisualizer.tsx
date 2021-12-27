import React, { useState, useEffect, useRef } from 'react';
import { Node, INode } from '../components/Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar'; 
import { greedyBFS } from '../algorithms/greedyBFS';
import { dfs } from '../algorithms/dfs';
import { simpleMath } from '../algorithms/simpleMath';
import { Header } from '../components/Header/Header';
import './PathfindingVisualizer.styles.scss';

interface IPathfindingVisualizer {
    mousePressed: boolean;
    start: boolean;
    end: boolean;
    setMousePressed: (value: boolean) => void;
    setStart: (value: boolean) => void;
    setEnd: (value: boolean) => void;
}

export const PathfindingVisualizer: React.FC<IPathfindingVisualizer> = ({ end, setEnd, start, setStart, mousePressed, setMousePressed }) => {
    
    const [algorithm, setAlgorithm] = useState('Dijkstra')
    const [grid, setGrid] = useState<INode[][]>([])
    const [measuredTime, setMeasuredTime] = useState<number | null>(null)
    const [weight, setWeight] = useState({
        active: false,
        value: 10
    })
    const [dimensions, setDimensions] = useState({
        rows: 25,
        columns: 50
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
        const grid: INode[][] = []
        for (let row = 0; row < dimensions.rows; row++) {
            const currentRow: INode[] = []
                for (let col = 0; col < dimensions.columns; col++) {
                    currentRow.push(createNode(col, row))
                }
            grid.push(currentRow)
        }
        return grid
    }

    const generateMaze = () => {
        const cacheGrid = getInitialGrid()
        for (let i = 0; i < dimensions.rows; ++i) {
            for (let j = 0; j < dimensions.columns; ++j) {
                if(Math.floor(Math.random() + 1/4)) cacheGrid[i][j].isWall = true
            }
        }
        setGrid(cacheGrid)
    }

    //////// CLEARING FUNCTIONS -----------------------------------------------------------------    
    const clearPaths = () => {
        let newGrid = grid.slice();
        for (let row = 0; row < dimensions.rows; row++) {
            for (let col = 0; col < dimensions.columns; col++) {
                const DOMNode = document.getElementById(`node-${row}-${col}`)
                const reactNode = newGrid[row][col]
                if (DOMNode) {
                    DOMNode.classList.remove('Node__visited') 
                    DOMNode.classList.remove('Node__shortestPath')
                } 
                reactNode.isVisited = false
                reactNode.distance = Infinity
                reactNode.previousNode = null
            }
        }
        setGrid(newGrid)
    }

    const clearBoard = () => {
        clearPaths()
        const newGrid = getInitialGrid()
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
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            // It has to be done this way, becaue setTimeout is async function
            // or idk why
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(shortestPath)
                }, 10 * i)
                return 
            }

            setTimeout(() => {
                // It's not a good practice especially in React, but we need tremendous rerendering speed
                const { row, col } = visitedNodesInOrder[i]
                const currentNode = document.getElementById(`node-${row}-${col}`)
                if (currentNode) currentNode.classList.add('Node__visited') 
            }, 10 * i)
        }
    }

    const animateShortestPath = (shortestPath: INode[]) => {

        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
                const { row, col } = shortestPath[i]
                const currentNode = document.getElementById(`node-${row}-${col}`)
                if (currentNode) currentNode.classList.add('Node__shortestPath')
            // not working without * i
            }, 25 * i)
        }            
    }

    const callAlgorithm = (
        fn: (grid: INode[][] ,startNodeData: INode, endNodeData: INode) => INode[],
        startNodeData: INode,
        endNodeData: INode
    ) => {
        const start = performance.now()
        const visitedNodes = fn(grid, startNodeData, endNodeData)
        const end = performance.now()
        setMeasuredTime(end-start)
        return visitedNodes
    }
    
    const visualizeAlgorithm = () => {
        clearPaths()
        let visitedNodes: INode[];
        const startNodeData = grid[startNode.current.row][startNode.current.col]
        const endNodeData = grid[endNode.current.row][endNode.current.col] 
        
        switch (algorithm) {
            case 'A*':
                visitedNodes = callAlgorithm(astar, startNodeData, endNodeData)
                break
            case 'Greedy BFS':
                visitedNodes = callAlgorithm(greedyBFS, startNodeData, endNodeData)
                break
            case 'DFS':
                visitedNodes = callAlgorithm(dfs, startNodeData, endNodeData)
                break
            case 'Simple Math':
                visitedNodes = callAlgorithm(simpleMath, startNodeData, endNodeData)
                break
            default:
                visitedNodes = callAlgorithm(dijkstra, startNodeData, endNodeData)
        }
        
        if (!visitedNodes) return    
        const nodesInShortestPath = getShortestPath(visitedNodes[visitedNodes.length-1]) 
        animateAlgorithm(visitedNodes, nodesInShortestPath)  
    }

    const getShortestPath = (lastNode: INode) => {
        if (!lastNode.isEnd) return []
        const shortestPath = []
        while (lastNode.previousNode) {
            shortestPath.unshift(lastNode)
            lastNode = lastNode.previousNode
        }
        return shortestPath
    }
    ///////////////////////////////////////////////////////////////////////////////////

    const handleMouseDown = (row: number, col: number) => {
        let currentNode = grid[row][col]    
        if (currentNode.isStart) setStart(true)
        if (currentNode.isEnd) setEnd(true)
        setMousePressed(true)
        generateObject(row, col)
    }

    const handleMouseEnter = (row: number, col: number) => {
        if (start) return generateStart(row, col)
        if (end) return generateEnd(row, col)
        if (mousePressed) return generateObject(row, col)
    } 

    const generateStart = (row: number, col: number) => {
        const cacheGrid = grid.slice()
        let currentNode = cacheGrid[row][col]
        if (currentNode.isEnd) return
        cacheGrid[startNode.current.row][startNode.current.col].isStart = false
        currentNode.isStart = true
        startNode.current.row = row
        startNode.current.col = col
        setGrid(cacheGrid)
    }

    const generateEnd = (row: number, col: number) => {
        const cacheGrid = grid.slice()
        let currentNode = cacheGrid[row][col]
        if (currentNode.isStart) return
        cacheGrid[endNode.current.row][endNode.current.col].isEnd = false
        currentNode.isEnd = true
        endNode.current.row = row
        endNode.current.col = col
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
            setGrid(cacheGrid)
        } else {
            if (currentNode.isWeight.active) return
            currentNode.isWall = !currentNode.isWall
            setGrid(cacheGrid)
        }
    } 


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
                generateMaze={generateMaze}
            />
            <div className='Container'>
                <div>

                </div>
                <div className='Board' onMouseUp={() => setMousePressed(false)}>
                    {
                        grid.map((row, rowIndex) => {
                            return <div className='Board__row' key={rowIndex} >
                                    {
                                        row.map((node, colIndex) => {
                                            const {isStart, isEnd, isWall, isWeight, isVisited} = node;
                                            return <Node 
                                                        row={rowIndex} 
                                                        col={colIndex} 
                                                        isStart={isStart} 
                                                        isEnd={isEnd}  
                                                        isWall={isWall}
                                                        isWeight={isWeight}
                                                        key={colIndex}
                                                        isVisited={isVisited}
                                                        // 1250 is the lowest amount of all nodes
                                                        // decreasing size of node linearly
                                                        dimension={1 + 1250 / (dimensions.rows*dimensions.columns)}
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
                    <span className='ComputationTime__value'>{measuredTime !== null ? measuredTime === 0 ? '< 1' : measuredTime : null} ms</span>
                </div>
            </div>
        </>
   
)}
