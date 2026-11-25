let currentCity = createDefaultCity();
let highlightedPath = [];

const canvas = document.getElementById("cityCanvas");
const ctx = canvas.getContext("2d");

function populateDropdowns() {
    const selects = ["startNode", "endNode", "roadFrom", "roadTo"];
    selects.forEach(id => {
        const el = document.getElementById(id);
        el.innerHTML = "";
        currentCity.nodes.forEach(node => {
            const option = document.createElement("option");
            option.value = node.id;
            option.textContent = node.name;
            el.appendChild(option);
        });
    });
    document.getElementById("endNode").value = currentCity.nodes.length - 1;
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Edges
    currentCity.edges.forEach(edge => {
        const fromNode = currentCity.nodes[edge.from];
        const toNode = currentCity.nodes[edge.to];

        const isHighlighted = isEdgeInPath(edge.from, edge.to);
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = isHighlighted ? "#2563eb" : "#cbd5e1";
        ctx.lineWidth = isHighlighted ? 4 : 2;
        ctx.stroke();

        // Draw weight label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = isHighlighted ? "#1d4ed8" : "#475569";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(edge.weight, midX + 6, midY - 6);
    });

    // Draw Vertices (Locations)
    currentCity.nodes.forEach(node => {
        const inPath = highlightedPath.includes(node.id);
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = inPath ? "#2563eb" : "#0f172a";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.x, node.y + 36);
    });
}

function isEdgeInPath(u, v) {
    for (let i = 0; i < highlightedPath.length - 1; i++) {
        if ((highlightedPath[i] === u && highlightedPath[i + 1] === v) ||
            (highlightedPath[i] === v && highlightedPath[i + 1] === u)) {
            return true;
        }
    }
    return false;
}

function executeAlgorithm(type) {
    const startId = parseInt(document.getElementById("startNode").value);
    const endId = parseInt(document.getElementById("endNode").value);
    const resultBox = document.getElementById("resultText");

    if (type === "dijkstra") {
        const hasNeg = currentCity.edges.some(e => e.weight < 0);
        if (hasNeg) {
            resultBox.innerHTML = "<strong>Warning:</strong> Negative edge weights detected! Dijkstra may produce inaccurate results. Use Bellman-Ford instead.";
            return;
        }
    }

    const res = type === "dijkstra"
        ? runDijkstraAlgorithm(currentCity, startId, endId)
        : runBellmanFordAlgorithm(currentCity, startId, endId);

    if (res.hasNegativeCycle) {
        highlightedPath = [];
        drawGraph();
        resultBox.innerHTML = "<strong>Alert:</strong> Negative weight cycle detected in graph!";
        return;
    }

    if (res.distance === Infinity) {
        highlightedPath = [];
        drawGraph();
        resultBox.innerHTML = "No route exists between the selected locations.";
        return;
    }

    highlightedPath = res.path;
    drawGraph();

    const routeNames = res.path.map(id => currentCity.getNodeName(id)).join(" → ");
    const algoName = type === "dijkstra" ? "Dijkstra’s Algorithm" : "Bellman-Ford Algorithm";

    resultBox.innerHTML = `
        <strong>Algorithm:</strong> ${algoName}<br>
        <strong>Shortest Cost / Distance:</strong> ${res.distance}<br>
        <strong>Optimal Path:</strong> ${routeNames}<br>
        <strong>Execution Time:</strong> ${res.timeMs} ms
    `;
}

// Event Listeners
document.getElementById("runDijkstra").addEventListener("click", () => executeAlgorithm("dijkstra"));
document.getElementById("runBellman").addEventListener("click", () => executeAlgorithm("bellman"));

document.getElementById("loadNegativeDemo").addEventListener("click", () => {
    currentCity = createNegativeWeightCity();
    highlightedPath = [];
    populateDropdowns();
    drawGraph();
    document.getElementById("resultText").textContent = "Loaded EV Rebate Map with negative edge weight (-3). Try running both algorithms!";
});

document.getElementById("resetCity").addEventListener("click", () => {
    currentCity = createDefaultCity();
    highlightedPath = [];
    populateDropdowns();
    drawGraph();
    document.getElementById("resultText").textContent = "Default city map restored.";
});

document.getElementById("addRoadBtn").addEventListener("click", () => {
    const from = parseInt(document.getElementById("roadFrom").value);
    const to = parseInt(document.getElementById("roadTo").value);
    const weight = parseInt(document.getElementById("roadWeight").value);

    if (from === to || isNaN(weight)) {
        alert("Select two different locations and enter a valid numeric weight.");
        return;
    }
    currentCity.addEdge(from, to, weight, false);
    drawGraph();
});

document.getElementById("runBenchmark").addEventListener("click", () => {
    const sizes = [50, 150, 300, 600];
    const tbody = document.querySelector("#benchmarkTable tbody");
    tbody.innerHTML = "";

    sizes.forEach(V => {
        const testGraph = new CityGraph();
        for (let i = 0; i < V; i++) testGraph.addNode(i, `Loc_${i}`, 0, 0);

        let E = 0;
        for (let i = 0; i < V - 1; i++) {
            testGraph.addEdge(i, i + 1, Math.floor(Math.random() * 20) + 1);
            E++;
        }
        for (let i = 0; i < V * 4; i++) {
            const u = Math.floor(Math.random() * V);
            const v = Math.floor(Math.random() * V);
            if (u !== v) {
                testGraph.addEdge(u, v, Math.floor(Math.random() * 50) + 1);
                E++;
            }
        }

        const dRes = runDijkstraAlgorithm(testGraph, 0, V - 1);
        const bfRes = runBellmanFordAlgorithm(testGraph, 0, V - 1);

        const row = `<tr>
            <td>${V}</td>
            <td>${E}</td>
            <td>${dRes.timeMs} ms</td>
            <td>${bfRes.timeMs} ms</td>
        </tr>`;
        tbody.innerHTML += row;
    });
});

// Initialize
populateDropdowns();
drawGraph();