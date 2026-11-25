class CityGraph {
    constructor() {
        this.nodes = []; // { id, name, x, y }
        this.edges = []; // { from, to, weight }
        this.adjList = new Map();
    }

    addNode(id, name, x, y) {
        this.nodes.push({ id, name, x, y });
        this.adjList.set(id, []);
    }

    addEdge(from, to, weight, bidirectional = false) {
        this.edges.push({ from, to, weight });
        this.adjList.get(from).push({ to, weight });

        if (bidirectional) {
            this.edges.push({ from: to, to: from, weight });
            this.adjList.get(to).push({ to: from, weight });
        }
    }

    getNodeName(id) {
        const node = this.nodes.find(n => n.id === id);
        return node ? node.name : `Node ${id}`;
    }
}

function createDefaultCity() {
    const city = new CityGraph();
    city.addNode(0, "Airport", 90, 210);
    city.addNode(1, "Tech Park", 240, 80);
    city.addNode(2, "City Center", 240, 340);
    city.addNode(3, "University", 430, 80);
    city.addNode(4, "Railway Station", 430, 340);
    city.addNode(5, "Harbor", 590, 210);

    city.addEdge(0, 1, 4, true);
    city.addEdge(0, 2, 2, true);
    city.addEdge(1, 2, 1, true);
    city.addEdge(1, 3, 5, true);
    city.addEdge(2, 3, 8, true);
    city.addEdge(2, 4, 10, true);
    city.addEdge(3, 4, 2, true);
    city.addEdge(3, 5, 6, true);
    city.addEdge(4, 5, 3, true);

    return city;
}

function createNegativeWeightCity() {
    const city = new CityGraph();
    city.addNode(0, "Depot", 100, 210);
    city.addNode(1, "Highway A", 330, 90);
    city.addNode(2, "Solar EV Zone", 330, 330);
    city.addNode(3, "Delivery Hub", 570, 210);

    city.addEdge(0, 1, 6, false);
    city.addEdge(0, 2, 5, false);
    city.addEdge(2, 1, -3, false); // EV Rebate / Negative weight edge
    city.addEdge(1, 3, 4, false);
    city.addEdge(2, 3, 7, false);

    return city;
}