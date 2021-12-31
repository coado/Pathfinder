import { INode } from '../components/Node/Node';
import { 
        getUnvisitedNeighbors,
        getAllNodes, 
        calculateHeuristicDistance, 
        sortNodesByDistance 
} from './utils';

 export const greedyBFS = (grid: INode[][], startNode: INode, endNode: INode, target: boolean) => {
    let closedList = []
    startNode.distance = calculateHeuristicDistance(startNode, endNode)
    const unvisitedNodes = getAllNodes(grid)
    
    while(unvisitedNodes.length !== 0) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        
        if (!closestNode) return closedList
        if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue
        if (closestNode.distance === Infinity) return closedList
        closestNode.isVisited = true
        closedList.push(closestNode)
        if (closestNode === endNode) return closedList
        updateOpenList(closestNode, endNode, grid)
    }
    return closedList
} 

const updateOpenList = (currentNode: INode, endNode: INode, grid: INode[][]) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeighbors) {
        if (neighbor.isWeight.active) {
            neighbor.distance = calculateHeuristicDistance(neighbor, endNode) + neighbor.isWeight.value
        } else {
            neighbor.distance = calculateHeuristicDistance(neighbor, endNode)
        }
        neighbor.previousNode = currentNode
    }
    
}
