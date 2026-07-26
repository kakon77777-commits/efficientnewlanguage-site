<!-- canonical: efficientnewlanguage.org/ai/examples/107-topological-sort | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 107 — Topological sort (Kahn's algorithm)

`topological_sort.eml` orders a course-prerequisite graph so every prerequisite comes before whatever needs it, then runs the same function against a deliberately impossible cyclic graph.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Orders the
# nodes of a dependency graph so every prerequisite comes before whatever
# needs it, via Kahn's algorithm: count how many things point AT each node,
# repeatedly take a node nothing points at, and decrement its neighbors.
# The corpus's third graph algorithm after examples/graph-bfs-traversal/
# and examples/graph-dfs-recursive/.
#
# The cycle case matters: a topological order only exists for a graph with
# no cycles, and Kahn's detects that for free — if the queue drains before
# every node has been emitted, the leftovers are exactly the ones trapped
# in a cycle. The second sample below is deliberately impossible.

def topo_sort(graph, nodes):
    indegree^+{}
    for node in nodes:
        0 => indegree[node]
    for node in nodes:
        graph[node] => neighbors
        for neighbor in neighbors:
            indegree[neighbor] + 1 => indegree[neighbor]
    queue^+[]
    for node in nodes:
        if indegree[node] == 0:
            queue + [node] => queue
    order^+[]
    0 => head
    while head < len(queue):
        queue[head] => node
        head + 1 => head
        order + [node] => order
        graph[node] => neighbors
        for neighbor in neighbors:
            indegree[neighbor] - 1 => indegree[neighbor]
            if indegree[neighbor] == 0:
                queue + [neighbor] => queue
    return order

courses^+{"intro": ["data-structures", "discrete-math"], "data-structures": ["algorithms"], "discrete-math": ["algorithms"], "algorithms": ["compilers"], "compilers": []}
course_names^+["intro", "data-structures", "discrete-math", "algorithms", "compilers"]

topo_sort(courses, course_names) => order
"Course order: " + str(order) => msg1
msg1^0

if len(order) == len(course_names):
    "All " + str(len(course_names)) + " courses scheduled (no cycle)" => msg2
else:
    "Cycle detected: only " + str(len(order)) + " of " + str(len(course_names)) + " could be scheduled" => msg2
msg2^0

cyclic^+{"a": ["b"], "b": ["c"], "c": ["a"]}
cyclic_names^+["a", "b", "c"]

topo_sort(cyclic, cyclic_names) => bad_order
"Cyclic graph order: " + str(bad_order) => msg3
msg3^0

if len(bad_order) == len(cyclic_names):
    "No cycle" => msg4
else:
    "Cycle detected: only " + str(len(bad_order)) + " of " + str(len(cyclic_names)) + " could be scheduled" => msg4
msg4^0
```

## Python (deterministic transpilation)

```python
def topo_sort(graph, nodes):
    indegree = {}
    for node in nodes:
        indegree[node] = 0
    for node in nodes:
        neighbors = graph[node]
        for neighbor in neighbors:
            indegree[neighbor] = indegree[neighbor] + 1
    queue = []
    for node in nodes:
        if indegree[node] == 0:
            queue = queue + [node]
    order = []
    head = 0
    while head < len(queue):
        node = queue[head]
        head = head + 1
        order = order + [node]
        neighbors = graph[node]
        for neighbor in neighbors:
            indegree[neighbor] = indegree[neighbor] - 1
            if indegree[neighbor] == 0:
                queue = queue + [neighbor]
    return order

courses = {"intro": ["data-structures", "discrete-math"], "data-structures": ["algorithms"], "discrete-math": ["algorithms"], "algorithms": ["compilers"], "compilers": []}
course_names = ["intro", "data-structures", "discrete-math", "algorithms", "compilers"]
order = topo_sort(courses, course_names)
msg1 = "Course order: " + str(order)
print(msg1)
if len(order) == len(course_names):
    msg2 = "All " + str(len(course_names)) + " courses scheduled (no cycle)"
else:
    msg2 = "Cycle detected: only " + str(len(order)) + " of " + str(len(course_names)) + " could be scheduled"
print(msg2)
cyclic = {"a": ["b"], "b": ["c"], "c": ["a"]}
cyclic_names = ["a", "b", "c"]
bad_order = topo_sort(cyclic, cyclic_names)
msg3 = "Cyclic graph order: " + str(bad_order)
print(msg3)
if len(bad_order) == len(cyclic_names):
    msg4 = "No cycle"
else:
    msg4 = "Cycle detected: only " + str(len(bad_order)) + " of " + str(len(cyclic_names)) + " could be scheduled"
print(msg4)
```

## stdout (executed)

```text
Course order: ['intro', 'data-structures', 'discrete-math', 'algorithms', 'compilers']
All 5 courses scheduled (no cycle)
Cyclic graph order: []
Cycle detected: only 0 of 3 could be scheduled
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
