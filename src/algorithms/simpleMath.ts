import { INode } from '../components/Node/Node';
import { IPaths } from '../PathfindingVisualizer/PathfindingVisualizer';
import { getUnvisitedNeighbors, getTargetShortestPath, getAllNodes, sortNodesByDistanceAndhDistance, calculateHeuristickDistancePitagoras } from './utils';

export const simpleMath = (grid: INode[][], startNode: INode, endNode: INode, target: boolean, targetNode: INode): IPaths => {
    
       const visitedNodes: INode[] = []  
       let targetShortestPath: INode[] = []     
       let unvisitedNodes = getAllNodes(grid)
       startNode.distance = 0 
       startNode.hdistance = calculateHeuristickDistancePitagoras(startNode, targetNode)
       
       while(unvisitedNodes.length !== 0) {
            sortNodesByDistanceAndhDistance(unvisitedNodes)
            const closestNode = unvisitedNodes.shift();
            if (!closestNode) return {visitedNodes, targetShortestPath}
            // If we encounter a wall, we skip it.            
            if (closestNode.isWall && !closestNode.isTarget && !closestNode.isStart && !closestNode.isEnd) continue;
            // We are stopping if closestNode.distance == Infinity
            if (closestNode.distance === Infinity) return {visitedNodes, targetShortestPath}
            visitedNodes.push(closestNode)
            if (target && closestNode.isTarget) {    
                targetShortestPath = getTargetShortestPath(closestNode)
                unvisitedNodes = getAllNodes(grid)
                target = false
                closestNode.distance = 0
                closestNode.hdistance = calculateHeuristickDistancePitagoras(closestNode, endNode)
            }
            closestNode.isVisited = true
            if (closestNode.isEnd && !target) return {visitedNodes, targetShortestPath}
            
            if (target) 
                updateUnvisitedNeighbors(closestNode, grid, targetNode) 
            else 
                updateUnvisitedNeighbors(closestNode, grid, endNode)
        }
    return {visitedNodes, targetShortestPath}
}


const updateUnvisitedNeighbors = (currentNode: INode, grid: INode[][], endNode: INode) => {
    const unvisitedNeigbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeigbors) {
        const averageDistance = calculateHeuristickDistancePitagoras(neighbor, endNode);
        if (neighbor.isWeight.active && !neighbor.isEnd && !neighbor.isTarget) {
            neighbor.distance = currentNode.distance + neighbor.isWeight.value + 1
        } else {
            neighbor.distance = currentNode.distance + 1
        }
        neighbor.hdistance = averageDistance
        neighbor.previousNode = currentNode
    }
}
