import { INode } from '../components/Node/Node';

export const dijkstra = (grid: INode[][], startNode: INode, endNode: INode) => {
       const visitedNodesInOrder: INode[] = []
       startNode.distance = 0 
       const unvisitedNodes = getAllNodes(grid)
       
       // while(true)
       while(!!unvisitedNodes.length) {
            sortNodesByDistance(unvisitedNodes)
            const closestNode = unvisitedNodes.shift();
            if (!closestNode) return visitedNodesInOrder
            // If we encounter a wall, we skip it.            
            if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue;
            // We are stopping if closestNode.distance == Infinity
            if (closestNode.distance === Infinity) return visitedNodesInOrder
            closestNode.isVisited = true
            visitedNodesInOrder.push(closestNode)
            if (closestNode === endNode) return visitedNodesInOrder
            updateUnvisitedNeighbors(closestNode, grid)
        }
        
        
       
}

const sortNodesByDistance = (unvisitedNodes: INode[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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


const getUnvisitedNeighbors = (currentNode: INode, grid: INode[][]): INode[] => {
        const neighbors = []
        const { col, row } = currentNode
        // top
        if (row > 0 ) neighbors.push(grid[row - 1][col])
        // down
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
        // left
        if (col > 0) neighbors.push(grid[row][col-1])
        // rigth
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
        return neighbors.filter((neighbor: INode) => !neighbor.isVisited)
} 


const getAllNodes = (grid: INode[][]): INode[] => {
    const nodes = []
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node)
        }
    }
    return nodes
}