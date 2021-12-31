import { INode } from '../components/Node/Node';
import { getUnvisitedNeighbors, getAllNodes, sortNodesByDistance } from './utils';

export const dijkstra = (grid: INode[][], startNode: INode, endNode: INode, target: boolean) => {
        console.log(target);
        
       const visitedNodes: INode[] = []       
       let unvisitedNodes = getAllNodes(grid)
       startNode.distance = 0 
       
       while(unvisitedNodes.length !== 0) {
            sortNodesByDistance(unvisitedNodes)
            const closestNode = unvisitedNodes.shift();
            if (!closestNode) return visitedNodes
            // If we encounter a wall, we skip it.            
            if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue;
            // We are stopping if closestNode.distance == Infinity
            if (closestNode.distance === Infinity) return visitedNodes
            closestNode.isVisited = true
            visitedNodes.push(closestNode)
            if (target && closestNode.isTarget) {
                unvisitedNodes = getAllNodes(grid)
                console.log(visitedNodes);
                target = false
                closestNode.distance = 0
            
            }
            if (closestNode.isEnd && !target) return visitedNodes
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
