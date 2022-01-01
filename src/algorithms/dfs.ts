import { INode } from '../components/Node/Node';
import { IPaths } from '../PathfindingVisualizer/PathfindingVisualizer';
import { getUnvisitedNeighbors, getTargetShortestPath, getAllNodes } from './utils'

export const dfs = (grid: INode[][], startNode: INode, endNode: INode, target: boolean): IPaths => {
       const visitedNodes: INode[] = []    
       let targetShortestPath: INode[] = [];   
       let nodesStack: INode[] = []
       startNode.isVisited = true
       nodesStack.push(startNode)
       
       while(nodesStack.length !== 0) {
            const closestNode = nodesStack.pop();
            if (!closestNode) return {visitedNodes, targetShortestPath}
            visitedNodes.push(closestNode)
            const unvisitedNeigbors = getUnvisitedNeighbors(closestNode, grid)

            for (const neighbor of unvisitedNeigbors) {
                if (neighbor.isWall && !neighbor.isTarget) continue
                neighbor.previousNode = closestNode
                visitedNodes.push(neighbor)
                if (target && neighbor.isTarget) {
                    targetShortestPath = getTargetShortestPath(neighbor)
                    // clearing nodes
                    getAllNodes(grid)
                    target = false
                }
                neighbor.isVisited = true
                if(neighbor.isEnd && !target) return {visitedNodes, targetShortestPath}
                nodesStack.push(neighbor)
            }
        }
        return {visitedNodes, targetShortestPath}
       
}


