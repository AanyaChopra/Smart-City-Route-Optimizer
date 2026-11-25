// Custom Min-Heap Priority Queue for Dijkstra's Algorithm
class MinPriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(node, priority) {
        this.heap.push({ node, priority });
        this.bubbleUp(this.heap.length - 1);
    }

    dequeue() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown(0);
        }
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(index) {
        while (index > 0) {
            let parentIdx = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIdx].priority) break;
            [this.heap[index], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[index]];
            index = parentIdx;
        }
    }

    sinkDown(index) {
        const length = this.heap.length;
        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let smallest = index;

            if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
                smallest = left;
            }
            if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
                smallest = right;
            }
            if (smallest === index) break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

// 1. Dijkstra's Shortest Path Algorithm
function runDijkstraAlgorithm(graph, startId, endId) {
    const startTime = performance.now();
    const V = graph.nodes.length;
    const distances = new Array(V).fill(Infinity);
    const parent = new Array(V).fill(null);
    const visited = new Array(V).fill(false);

    distances[startId] = 0;
    const pq = new MinPriorityQueue();
    pq.enqueue(startId, 0);

    while (!pq.isEmpty()) {
        const { node: u } = pq.dequeue();
        if (visited[u]) continue;
        visited[u] = true;

        const neighbors = graph.adjList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            if (!visited[v] && distances[u] + edge.weight < distances[v]) {
                distances[v] = distances[u] + edge.weight;
                parent[v] = u;
                pq.enqueue(v, distances[v]);
            }
        }
    }

    const endTime = performance.now();
    return {
        distance: distances[endId],
        path: reconstructPath(parent, endId),
        hasNegativeCycle: false,
        timeMs: (endTime - startTime).toFixed(4)
    };
}

// 2. Bellman-Ford Shortest Path Algorithm
function runBellmanFordAlgorithm(graph, startId, endId) {
    const startTime = performance.now();
    const V = graph.nodes.length;
    const distances = new Array(V).fill(Infinity);
    const parent = new Array(V).fill(null);

    distances[startId] = 0;

    // Relax all edges V - 1 times
    for (let i = 0; i < V - 1; i++) {
        let updated = false;
        for (const edge of graph.edges) {
            if (distances[edge.from] !== Infinity &&
                distances[edge.from] + edge.weight < distances[edge.to]) {
                distances[edge.to] = distances[edge.from] + edge.weight;
                parent[edge.to] = edge.from;
                updated = true;
            }
        }
        if (!updated) break;
    }

    // Check for negative-weight cycles
    let hasNegativeCycle = false;
    for (const edge of graph.edges) {
        if (distances[edge.from] !== Infinity &&
            distances[edge.from] + edge.weight < distances[edge.to]) {
            hasNegativeCycle = true;
            break;
        }
    }

    const endTime = performance.now();
    return {
        distance: distances[endId],
        path: reconstructPath(parent, endId),
        hasNegativeCycle,
        timeMs: (endTime - startTime).toFixed(4)
    };
}

function reconstructPath(parent, target) {
    const path = [];
    for (let at = target; at !== null; at = parent[at]) {
        path.push(at);
    }
    return path.reverse();
}