import { INode } from '../components/Node/Node';

 export const greedyBFS = (grid: INode[][], startNode: INode, endNode: INode) => {
    let closedList = []
    startNode.distance = calculateHeuristicDistance(startNode, endNode)
    const unvisitedNodes = getAllNodes(grid)
    
    while(unvisitedNodes.length !== 0) {
        sortNodes(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        console.log(closestNode);
        
        if (!closestNode) return closedList
        if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue
        if (closestNode.distance === Infinity) return closedList
        closestNode.isVisited = true
        closedList.push(closestNode)
        if (closestNode === endNode) return closedList
        updateOpenList(closestNode, endNode, grid)
    }

} 

const sortNodes = (openList: INode[]) => {
    openList.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

const calculateHeuristicDistance = (node: INode, endNode: INode): number => Math.abs(node.col - endNode.col) + Math.abs(node.row - endNode.row)

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