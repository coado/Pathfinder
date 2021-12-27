import { INode } from '../components/Node/Node';

 export const astar = (grid: INode[][], startNode: INode, endNode: INode) => {
    let closedList = []
    startNode.distance = 0
    startNode.hdistance = calculateHeuristicDistance(startNode, endNode)
    const unvisitedNodes = getAllNodes(grid)
    // H - absolute distance between n-node and finishNode
    // G - shortest distance to get to current node
    // F = G(n) + H(n);

    
    while(unvisitedNodes.length !== 0) {
        sortNodes(unvisitedNodes)
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

const sortNodes = (unvisitedNodes: INode[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => {
        // f - sum of heuristick (approximation of distance to endNode) and distance from startNode    
        const f_B = nodeB.distance + nodeB.hdistance
        const f_A = nodeA.distance + nodeA.hdistance
        
        return f_A - f_B
    })
}

const calculateHeuristicDistance = (node: INode, endNode: INode): number => Math.abs(node.col - endNode.col) + Math.abs(node.row - endNode.row)

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