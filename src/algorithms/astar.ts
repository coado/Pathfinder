import { INode } from '../components/Node/Node';
import { getUnvisitedNeighbors, getAllNodes, calculateHeuristicDistance, sortNodesByDistanceAndhDistance } from './utils';

 export const astar = (grid: INode[][], startNode: INode, endNode: INode, target: boolean) => {
    let closedList = []
    startNode.distance = 0
    startNode.hdistance = calculateHeuristicDistance(startNode, endNode)
    const unvisitedNodes = getAllNodes(grid)
    // H - absolute distance between n-node and finishNode
    // G - shortest distance to get to current node
    // F = G(n) + H(n);

    
    while(unvisitedNodes.length !== 0) {
        sortNodesByDistanceAndhDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        
        if (!closestNode) return closedList
        if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue
        if (closestNode.distance === Infinity) return closedList
        closestNode.isVisited = true
        closedList.push(closestNode)
        if (closestNode === endNode) return closedList
        updateUnvisitedNeighbors(closestNode, grid, endNode)
    }
    return closedList

} 


const updateUnvisitedNeighbors = (currentNode: INode, grid: INode[][], endNode: INode) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeighbors) {
        const heuristickDistance = calculateHeuristicDistance(neighbor, endNode)
        if (neighbor.isWeight.active) neighbor.distance = currentNode.distance + neighbor.isWeight.value + 1
        else neighbor.distance = currentNode.distance + 1
        neighbor.hdistance = heuristickDistance
        neighbor.previousNode = currentNode
    }
    
}

