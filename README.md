## Check it out here: https://nifty-kepler-85cca2.netlify.app/

Path-finding algorithms visualization.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

![image](https://user-images.githubusercontent.com/64146291/175317979-a9001a3f-c78e-451e-a111-4b49d9ae5d26.png)

## Algorithms

Dijkstra - one of the most popular algorithms. It guarantees the shortest path. In the beginning, every node has an infinity distance from the start node. The program checks all unvisited neighbors of the current node and updates their values. The next visited node is one with a shorter road from the beginning.

Astar - considered as the best pathfinding algorithm. It guarantees the shortest path. Every node has an infinity distance from the start node in the beginning. The program checks all unvisited neighbors of the current node and computes the distance from the start node and assesses the distance to the end node for each of them. The next visited node is one with the lowest sum of both values.

Greedy - pretty fast algorithm but doesn't guarantee the shortest path. The program checks all unvisited neighbors of the current node and calculates the distance to the end node for each. The next visited node is one with the lowest distance value.

DFS - Deep First Search is the fastest algorithm in this comparison, however, it does not guarantee the shortest path. The program goes in sequence: top, right, down, left.

Simple math - my modification of the Astar algorithm. The distance to the end node is assessed from the Pythagoras theorem.
