# Smart City Route Optimization System (JavaScript)

An interactive web-based route optimization and algorithm benchmarking system built from scratch using HTML, CSS, and Vanilla JavaScript.

## Features
- **Graph Modeling:** Models city locations as vertices and roads as weighted edges.
- **Dijkstra’s Algorithm:** Implemented from scratch using a custom Binary Min-Heap Priority Queue ($O((V + E) \log V)$).
- **Bellman-Ford Algorithm:** Implemented with edge relaxation and negative cycle detection ($O(V \cdot E)$), including a negative edge weight scenario.
- **Visual Path Highlighting:** Renders the city network on HTML5 Canvas and highlights the shortest path.
- **Performance Benchmark:** Compares execution times across networks of 50, 150, 300, and 600 vertices.