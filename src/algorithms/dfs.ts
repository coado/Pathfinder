import { INode } from '../components/Node/Node';

export const dfs = (grid: INode[][], startNode: INode, endNode: INode) => {
       const visitedNodes: INode[] = []       
       const nodesStack: INode[] = []
       startNode.isVisited = true
       nodesStack.push(startNode)
       
       // while(true)
       while(nodesStack.length !== 0) {
            const closestNode = nodesStack.pop();
            if (!closestNode) return visitedNodes
            // If we encounter a wall, we skip it.            
           //    if (closestNode.isWall && !closestNode.isStart && !closestNode.isEnd) continue;
            visitedNodes.push(closestNode)
            if (closestNode === endNode) return visitedNodes
            const unvisitedNeigbors = getUnvisitedNeighbors(closestNode, grid)
            for (const neighbor of unvisitedNeigbors) {
                neighbor.isVisited = true
                neighbor.previousNode = closestNode
                visitedNodes.push(neighbor)
                if(neighbor.isEnd) {
                    return visitedNodes
                }
                nodesStack.push(neighbor)
            }
        }
        return visitedNodes
       
}


const getUnvisitedNeighbors = (currentNode: INode, grid: INode[][]): INode[] => {
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
    return neighbors.filter((neighbor: INode) => (!neighbor.isVisited && !neighbor.isWall) || neighbor.isEnd)
} 

