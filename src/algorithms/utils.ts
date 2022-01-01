import { INode } from "../components/Node/Node"

export const getUnvisitedNeighbors = (currentNode: INode, grid: INode[][]): INode[] => {
    const neighbors = []
    const { col, row } = currentNode

    // left
    if (col > 0) neighbors.push(grid[row][col-1])
    // down
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
    // rigth
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
    // top
    if (row > 0 ) neighbors.push(grid[row - 1][col])
    return neighbors.filter((neighbor: INode) => !neighbor.isVisited)
}

export const getAllNodes = (grid: INode[][]): INode[] => {
    const nodes = []
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false
            node.distance = Infinity
            node.hdistance = Infinity
            node.previousNode = null
            nodes.push(node)
        }
    }
    return nodes
}

export const getTargetShortestPath = (node: INode): INode[] => {
    const targetShortestPath = []
    while (node.previousNode) {
        targetShortestPath.unshift(node)
        node = node.previousNode
    }
    return targetShortestPath
}

export const calculateHeuristicDistance = (node: INode, endNode: INode): number => Math.abs(node.col - endNode.col) + Math.abs(node.row - endNode.row)

export const calculateHeuristickDistancePitagoras = (currentNode: INode, endNode: INode) => Math.sqrt((endNode.col - currentNode.col)**2 + (endNode.row - currentNode.row)**2)

export const sortNodesByDistance = (unvisitedNodes: INode[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

export const sortNodesByDistanceAndhDistance = (unvisitedNodes: INode[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => {
        const f_B = nodeB.distance + nodeB.hdistance
        const f_A = nodeA.distance + nodeA.hdistance
        
        return f_A - f_B
    })
}