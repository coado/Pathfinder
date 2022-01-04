import { INode } from '../components/Node/Node';
import { IPaths } from '../PathfindingVisualizer/PathfindingVisualizer';
import { 
        getUnvisitedNeighbors,
        getAllNodes, 
        calculateHeuristicDistance, 
        sortNodesByDistance,
        getTargetShortestPath 
} from './utils';

 export const greedy = (grid: INode[][], startNode: INode, endNode: INode, target: boolean, targetNode: INode): IPaths => {
    const visitedNodes = []
    let targetShortestPath: INode[] = [];
    let unvisitedNodes = getAllNodes(grid)
    startNode.distance = calculateHeuristicDistance(startNode, endNode)
    
    while(unvisitedNodes.length !== 0) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        
        if (!closestNode) return {visitedNodes, targetShortestPath}
        if (closestNode.isWall && !closestNode.isTarget && !closestNode.isStart && !closestNode.isEnd) continue
        if (closestNode.distance === Infinity) return {visitedNodes, targetShortestPath}
        visitedNodes.push(closestNode)
        if (target && closestNode.isTarget) {    
            targetShortestPath = getTargetShortestPath(closestNode)
            unvisitedNodes = getAllNodes(grid)
            target = false
            closestNode.distance = calculateHeuristicDistance(closestNode, endNode)
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
    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeighbors) {
        if (neighbor.isWeight.active && !neighbor.isEnd && !neighbor.isTarget) {
            neighbor.distance = calculateHeuristicDistance(neighbor, endNode) + neighbor.isWeight.value
        } else {
            neighbor.distance = calculateHeuristicDistance(neighbor, endNode)
        }
        neighbor.previousNode = currentNode
    }
    
}
