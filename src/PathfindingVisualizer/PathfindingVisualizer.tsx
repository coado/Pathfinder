import React, { useState, useEffect, useRef } from 'react';
import { Node, INode } from '../components/Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar'; 
import { Header } from '../components/Header/Header';
import './PathfindingVisualizer.styles.scss';

interface IPathfindingVisualizer {
    mousePressed: boolean;
    start: boolean;
    end: boolean;
    weight: boolean;
    setMousePressed: (value: boolean) => void;
    setStart: (value: boolean) => void;
    setEnd: (value: boolean) => void;
    setWeight: (value: boolean) => void;

}

export const PathfindingVisualizer: React.FC<IPathfindingVisualizer> = ({ setWeight, weight, end, setEnd, start, setStart, mousePressed, setMousePressed }) => {
    
    const [grid, setGrid] = useState<INode[][]>([])
    const [algorithm, setAlgorithm] = useState('Dijkstra')
    const [dimensions, setDimensions] = useState({
        rows: 25,
        columns: 50
    })

    const startNode = useRef({
        row: 10,
        col: 10
    })
    const endNode = useRef({
        row: 15,
        col: 45
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
    


    const createNode = (col: number, row: number): INode => {
        return {
            col,
            row,
            isStart: row === startNode.current.row && col === startNode.current.col,
            isEnd: row === endNode.current.row && col === endNode.current.col,
            distance: Infinity,
            isVisited: false,
            isWeight: false,
            isWall: false,
            previousNode: null,
          };
    }

    ///////////////////////////////////////////////////////////////////////////////////



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
    
    const visualizeAlgorithm = () => {
        
        let visitedNodes: INode[] | undefined;
        const startNodeData = grid[startNode.current.row][startNode.current.col]
        const endNodeData = grid[endNode.current.row][endNode.current.col] 
        switch (algorithm) {
            case 'Astar':
                visitedNodes = astar(grid, startNodeData, endNodeData)
                break
            default:
                visitedNodes = dijkstra(grid, startNodeData, endNodeData)
        }
        
        if (!visitedNodes) return 
        const nodesInShortestPath = getShortestPath(visitedNodes[visitedNodes.length-1]) 
        animateAlgorithm(visitedNodes, nodesInShortestPath)  
    }

    const getShortestPath = (lastNode: INode) => {
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
        generateWall(row, col)
    }

    const handleMouseEnter = (row: number, col: number) => {
        if (start) return generateStart(row, col)
        if (end) return generateEnd(row, col)
        if (mousePressed) return generateWall(row, col)
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
    
    const generateWall = (row: number, col: number) => {        
        const cacheGrid = grid.slice()
        let currentNode = cacheGrid[row][col]
        if (currentNode.isStart || currentNode.isEnd) return
        if (weight) {
            currentNode.isWeight = !currentNode.isWeight
            setGrid(cacheGrid)
        } else {
            currentNode.isWall = !currentNode.isWall
            setGrid(cacheGrid)
        }
    }

    return (
        <>
            <Header setWeight={setWeight} weight={weight} setDimensions={setDimensions} currentAlgorithm={algorithm} setAlgorithm={setAlgorithm} startAlgorithm={visualizeAlgorithm} />
            <div className='Board' onMouseUp={() => setMousePressed(false)}>
                {
                    grid.map((row, rowIndex) => {
                        return <div className='Board__row' key={rowIndex} >
                                {
                                    row.map((node, colIndex) => {
                                        const {isStart, isEnd, isWall, isWeight} = node;
                                        return <Node 
                                                    row={rowIndex} 
                                                    col={colIndex} 
                                                    isStart={isStart} 
                                                    isEnd={isEnd}  
                                                    isWall={isWall}
                                                    isWeight={isWeight}
                                                    key={colIndex}
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
            </>
   
)}
