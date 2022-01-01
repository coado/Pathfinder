import { INode } from '../components/Node/Node';
import { IPaths } from '../PathfindingVisualizer/PathfindingVisualizer';
import { getUnvisitedNeighbors, getAllNodes, calculateHeuristicDistance, getTargetShortestPath, sortNodesByDistanceAndhDistance } from './utils';

 export const astar = (grid: INode[][], startNode: INode, endNode: INode, target: boolean, targetNode: INode): IPaths => {
    const visitedNodes: INode[] = []
    let targetShortestPath: INode[] = [];
    let unvisitedNodes = getAllNodes(grid)
    startNode.distance = 0
    startNode.hdistance = calculateHeuristicDistance(startNode, targetNode)
    // H - absolute distance between n-node and finishNode
    // G - shortest distance to get to current node
    // F = G(n) + H(n);

    
    while(unvisitedNodes.length !== 0) {
        sortNodesByDistanceAndhDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        
        if (!closestNode) return {visitedNodes, targetShortestPath}
        if (closestNode.isWall && !closestNode.isTarget && !closestNode.isStart && !closestNode.isEnd) continue
        if (closestNode.distance === Infinity) return {visitedNodes, targetShortestPath}
        visitedNodes.push(closestNode)
        if (target && closestNode.isTarget) {    
            targetShortestPath = getTargetShortestPath(closestNode)
            unvisitedNodes = getAllNodes(grid)
            target = false
            closestNode.distance = 0
            closestNode.hdistance = calculateHeuristicDistance(closestNode, endNode)
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
        const heuristickDistance = calculateHeuristicDistance(neighbor, endNode)
        if (neighbor.isWeight.active && !neighbor.isEnd && !neighbor.isTarget) neighbor.distance = currentNode.distance + neighbor.isWeight.value + 1
        else neighbor.distance = currentNode.distance + 1
        neighbor.hdistance = heuristickDistance
        neighbor.previousNode = currentNode
    }
    
}

