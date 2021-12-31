import { INode } from '../components/Node/Node';
import { getUnvisitedNeighbors, getAllNodes, sortNodesByDistanceAndhDistance, calculateHeuristickDistancePitagoras } from './utils';

export const simpleMath = (grid: INode[][], startNode: INode, endNode: INode, target: boolean) => {
    
       const visitedNodes: INode[] = []       
       startNode.distance = 0 
       startNode.hdistance = calculateHeuristickDistancePitagoras(startNode, endNode)
       const unvisitedNodes = getAllNodes(grid)
       
       while(unvisitedNodes.length !== 0) {
        sortNodesByDistanceAndhDistance(unvisitedNodes)
            const closestNode = unvisitedNodes.shift();
            if (!closestNode) return visitedNodes
            // If we encounter a wall, we skip it.            
            if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue;
            // We are stopping if closestNode.distance == Infinity
            if (closestNode.distance === Infinity) return visitedNodes
            closestNode.isVisited = true
            visitedNodes.push(closestNode)
            if (closestNode === endNode) return visitedNodes
            updateUnvisitedNeighbors(closestNode, grid, endNode)
        }
    return visitedNodes
}


const updateUnvisitedNeighbors = (currentNode: INode, grid: INode[][], endNode: INode) => {
    const unvisitedNeigbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeigbors) {
        const averageDistance = calculateHeuristickDistancePitagoras(neighbor, endNode);
        if (neighbor.isWeight.active) {
            neighbor.distance = currentNode.distance + neighbor.isWeight.value + 1
        } else {
            neighbor.distance = currentNode.distance + 1
        }
        neighbor.hdistance = averageDistance
        neighbor.previousNode = currentNode
    }
}
