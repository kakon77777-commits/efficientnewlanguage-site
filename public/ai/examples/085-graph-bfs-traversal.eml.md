<!-- canonical: efficientnewlanguage.org/ai/examples/085-graph-bfs-traversal | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 085 — Graph BFS traversal

`graph_bfs_traversal.eml` visits a small directed graph breadth-first from node `A`, reaching all 6 nodes in order `A, B, C, D, E, F`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Breadth-first
# traversal of a small directed graph held as an adjacency dict (node ->
# list of neighbors) — the corpus's first graph algorithm. The queue is a
# plain list with a moving `head` index rather than a real dequeue: EML has
# no `.pop(0)`, and rebuilding the list by slice on every step would turn
# an O(1) dequeue into O(n). Visited-tracking uses the dict-as-set idiom
# (`node => True` plus an `in` check), the same as
# examples/duplicate-remover/.

def bfs(graph, start):
    visited^+{}
    order^+[]
    queue^+[start]
    True => visited[start]
    0 => head
    while head < len(queue):
        queue[head] => node
        head + 1 => head
        order + [node] => order
        graph[node] => neighbors
        for neighbor in neighbors:
            if not neighbor in visited:
                True => visited[neighbor]
                queue + [neighbor] => queue
    return order

graph^+{"A": ["B", "C"], "B": ["D", "E"], "C": ["F"], "D": [], "E": ["F"], "F": ["A"]}

bfs(graph, "A") => visit_order
"Graph: " + str(graph) => msg1
msg1^0
"BFS from A: " + str(visit_order) => msg2
msg2^0
"Visited " + str(len(visit_order)) + " nodes" => msg3
msg3^0
```

## Python (deterministic transpilation)

```python
def bfs(graph, start):
    visited = {}
    order = []
    queue = [start]
    visited[start] = True
    head = 0
    while head < len(queue):
        node = queue[head]
        head = head + 1
        order = order + [node]
        neighbors = graph[node]
        for neighbor in neighbors:
            if not neighbor in visited:
                visited[neighbor] = True
                queue = queue + [neighbor]
    return order

graph = {"A": ["B", "C"], "B": ["D", "E"], "C": ["F"], "D": [], "E": ["F"], "F": ["A"]}
visit_order = bfs(graph, "A")
msg1 = "Graph: " + str(graph)
print(msg1)
msg2 = "BFS from A: " + str(visit_order)
print(msg2)
msg3 = "Visited " + str(len(visit_order)) + " nodes"
print(msg3)
```

## stdout (executed)

```text
Graph: {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': ['A']}
BFS from A: ['A', 'B', 'C', 'D', 'E', 'F']
Visited 6 nodes
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
