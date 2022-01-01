import { INode } from '../components/Node/Node';
import { IPaths } from '../PathfindingVisualizer/PathfindingVisualizer';
import { getUnvisitedNeighbors, getAllNodes, sortNodesByDistance, getTargetShortestPath } from './utils';

export const dijkstra = (grid: INode[][], startNode: INode, _: INode, target: boolean): IPaths => {
       const visitedNodes: INode[] = []       
       let targetShortestPath: INode[] = [];
       let unvisitedNodes = getAllNodes(grid)
       startNode.distance = 0 
       
       while(unvisitedNodes.length !== 0) {
            sortNodesByDistance(unvisitedNodes)
            const closestNode = unvisitedNodes.shift();
            if (!closestNode) return {visitedNodes, targetShortestPath}
            // If we encounter a wall, we skip it.            
            if (closestNode.isWall && !closestNode.isTarget && !closestNode.isStart && !closestNode.isEnd) continue;
            // We are stopping if closestNode.distance == Infinity
            if (closestNode.distance === Infinity) return {visitedNodes, targetShortestPath}
            closestNode.isVisited = true
            visitedNodes.push(closestNode)
            if (target && closestNode.isTarget) {
                targetShortestPath = getTargetShortestPath(closestNode)
                unvisitedNodes = getAllNodes(grid)
                target = false
                closestNode.distance = 0
            }
            if (closestNode.isEnd && !target) return {visitedNodes, targetShortestPath}
            updateUnvisitedNeighbors(closestNode, grid)
        }
        
        return {visitedNodes, targetShortestPath}
       
}

const updateUnvisitedNeighbors = (currentNode: INode, grid: INode[][]) => {
    const unvisitedNeigbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeigbors) {
        if (neighbor.isWeight.active && !neighbor.isEnd && !neighbor.isTarget) {
            neighbor.distance = currentNode.distance + neighbor.isWeight.value + 1
        } else {
            neighbor.distance = currentNode.distance + 1
        }
        neighbor.previousNode = currentNode
    }
}
