<!-- canonical: efficientnewlanguage.org/ai/examples/008-todo-list-manager | ai_layer_version: 0.1.0 | updated: 2026-07-18 -->

# Example 008 — Case corpus: a self-authored class-based todo-list manager

`todo_list_manager.eml` is the third case in a self-authored batch (see [`examples/unit-temperature-converter/`](../unit-temperature-converter/) and [`examples/word-frequency-counter/`](../word-frequency-counter/) for the other two) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A small
# class-based todo-list manager exercising `self` attribute state (lists),
# list concatenation via `+` on `self` attributes, nested subscript writes
# through an attribute (`self.done[index]`), and a range bound built from a
# function call + arithmetic (`[0 : len(self.tasks) - 1]`).

class TodoList:
    def __init__(self):
        [] => self.tasks
        [] => self.done

    def add_task(self, task):
        self.tasks + [task] => self.tasks
        self.done + [False] => self.done

    def complete_task(self, index):
        True => self.done[index]

    def print_tasks(self):
        for i in [0 : len(self.tasks) - 1]:
            if self.done[i]:
                "[x] " => status
            else:
                "[ ] " => status
            status + self.tasks[i] => line
            line^0

TodoList() => todo
todo.add_task("Write the case corpus plan")
todo.add_task("Author three self-contained EML programs")
todo.add_task("Wire up the corpus generation script")
todo.complete_task(0)
todo.complete_task(1)
todo.print_tasks()
```

## Python (deterministic transpilation)

```python
class TodoList:
    def __init__(self):
        self.tasks = []
        self.done = []
    def add_task(self, task):
        self.tasks = self.tasks + [task]
        self.done = self.done + [False]
    def complete_task(self, index):
        self.done[index] = True
    def print_tasks(self):
        for i in range(0, len(self.tasks)):
            if self.done[i]:
                status = "[x] "
            else:
                status = "[ ] "
            line = status + self.tasks[i]
            print(line)

todo = TodoList()
todo.add_task("Write the case corpus plan")
todo.add_task("Author three self-contained EML programs")
todo.add_task("Wire up the corpus generation script")
todo.complete_task(0)
todo.complete_task(1)
todo.print_tasks()
```

## stdout (executed)

```text
[x] Write the case corpus plan
[x] Author three self-contained EML programs
[ ] Wire up the corpus generation script
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
