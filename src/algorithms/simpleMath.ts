import { INode } from '../components/Node/Node';

export const simpleMath = (grid: INode[][], startNode: INode, endNode: INode) => {
    
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
            updateUnvisitedNeighbors(closestNode, grid, endNode)
        }
    return visitedNodes
}

const sortNodesByDistance = (unvisitedNodes: INode[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }

  //const calculateHeuristicDistance = (node: INode, endNode: INode): number => Math.abs(node.col - endNode.col) + Math.abs(node.row - endNode.row)

const updateUnvisitedNeighbors = (currentNode: INode, grid: INode[][], endNode: INode) => {
    const unvisitedNeigbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of unvisitedNeigbors) {
        const averageDistance = Math.sqrt((endNode.col - neighbor.col)**2 + (endNode.row - currentNode.row)**2)
        if (neighbor.isWeight.active) {
            neighbor.distance = averageDistance + neighbor.isWeight.value
        } else {
            neighbor.distance = averageDistance
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