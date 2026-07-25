<!-- canonical: efficientnewlanguage.org/ai/examples/086-graph-dfs-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 086 — Graph DFS traversal (recursive)

`graph_dfs_recursive.eml` visits the **same graph** as [`examples/graph-bfs-traversal/`](../graph-bfs-traversal/) depth-first from node `A`, so the two orders can be read side by side:

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Depth-first
# traversal of the SAME graph as examples/graph-bfs-traversal/, so the two
# visit orders can be read side by side (BFS gives A,B,C,D,E,F; DFS gives
# A,B,D,E,F,C). Recursive rather than stack-driven, which makes the
# contrast with BFS's explicit queue sharper.
#
# Note the two different parameter behaviors this relies on: `visited` is a
# dict mutated in place (`True => visited[node]`), so writes propagate back
# to the caller by reference — while `order` is rebuilt by `+` on every
# append, which rebinds only the local name, so each recursive call has to
# RETURN it and the caller has to reassign. Same as real Python.

def dfs(graph, node, visited, order):
    True => visited[node]
    order + [node] => order
    graph[node] => neighbors
    for neighbor in neighbors:
        if not neighbor in visited:
            dfs(graph, neighbor, visited, order) => order
    return order

graph^+{"A": ["B", "C"], "B": ["D", "E"], "C": ["F"], "D": [], "E": ["F"], "F": ["A"]}

visited^+{}
dfs(graph, "A", visited, []) => visit_order

"Graph: " + str(graph) => msg1
msg1^0
"DFS from A: " + str(visit_order) => msg2
msg2^0
"Visited " + str(len(visit_order)) + " nodes" => msg3
msg3^0
```

## Python (deterministic transpilation)

```python
def dfs(graph, node, visited, order):
    visited[node] = True
    order = order + [node]
    neighbors = graph[node]
    for neighbor in neighbors:
        if not neighbor in visited:
            order = dfs(graph, neighbor, visited, order)
    return order

graph = {"A": ["B", "C"], "B": ["D", "E"], "C": ["F"], "D": [], "E": ["F"], "F": ["A"]}
visited = {}
visit_order = dfs(graph, "A", visited, [])
msg1 = "Graph: " + str(graph)
print(msg1)
msg2 = "DFS from A: " + str(visit_order)
print(msg2)
msg3 = "Visited " + str(len(visit_order)) + " nodes"
print(msg3)
```

## stdout (executed)

```text
Graph: {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': ['A']}
DFS from A: ['A', 'B', 'D', 'E', 'F', 'C']
Visited 6 nodes
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
