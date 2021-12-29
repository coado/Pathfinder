import { INode } from '../components/Node/Node';
import { getUnvisitedNeighbors, getAllNodes, sortNodesByDistance } from './utils';

export const dijkstra = (grid: INode[][], startNode: INode, endNode: INode) => {
    
       const visitedNodes: INode[] = []       
       startNode.distance = 0 
       const unvisitedNodes = getAllNodes(grid)
       
       // while(true)
       while(!!unvisitedNodes.length) {
            sortNodesByDistance(unvisitedNodes)
            const closestNode = unvisitedNodes.shift();
            if (!closestNode) return visitedNodes
            // If we encounter a wall, we skip it.            
            if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue;
            // We are stopping if closestNode.distance == Infinity
            if (closestNode.distance === Infinity) return visitedNodes
            closestNode.isVisited = true
            visitedNodes.push(closestNode)
            if (closestNode === endNode) return visitedNodes
            updateUnvisitedNeighbors(closestNode, grid)
        }
        
        return visitedNodes
       
}

const updateUnvisitedNeighbors = (currentNode: INode, grid: INode[][]) => {
    const unvisitedNeigbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeigbors) {
        if (neighbor.isWeight.active) {
            neighbor.distance = currentNode.distance + neighbor.isWeight.value + 1
        } else {
            neighbor.distance = currentNode.distance + 1
        }
        neighbor.previousNode = currentNode
    }
}
