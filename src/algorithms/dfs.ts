import { INode } from '../components/Node/Node';
import { getUnvisitedNeighbors } from './utils'

export const dfs = (grid: INode[][], startNode: INode, endNode: INode, target: boolean) => {
       const visitedNodes: INode[] = []       
       const nodesStack: INode[] = []
       startNode.isVisited = true
       nodesStack.push(startNode)
       
       while(nodesStack.length !== 0) {
            const closestNode = nodesStack.pop();
            if (!closestNode) return visitedNodes
            visitedNodes.push(closestNode)
            const unvisitedNeigbors = getUnvisitedNeighbors(closestNode, grid)

            for (const neighbor of unvisitedNeigbors) {
                neighbor.isVisited = true
                if (neighbor.isWall) continue
                neighbor.previousNode = closestNode
                visitedNodes.push(neighbor)
                if(neighbor.isEnd) return visitedNodes
                
                nodesStack.push(neighbor)
            }
        }
        return visitedNodes
       
}


