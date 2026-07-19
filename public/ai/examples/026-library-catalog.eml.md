<!-- canonical: efficientnewlanguage.org/ai/examples/026-library-catalog | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 026 — Case corpus: a self-authored library checkout catalog

`library_catalog.eml` is a class-based case in a self-authored batch of six OOP utilities (alongside `examples/bank-account-simulator/`, `examples/simple-stack/`, `examples/simple-queue/`, `examples/inventory-tracker/`, and `examples/parking-lot-tracker/`) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class-based
# library catalog exercising a dict literal + subscript get/set through a
# `self` attribute (`self.books`, title -> checked-out boolean), a parallel
# list of titles grown via `existing + [item] => existing` for ordered
# iteration, bare `True`/`False` literals bound through `=>` (as in
# todo-list-manager), and `try`/`except`/`raise ValueError` for checking out
# a book that is already checked out.

class Library:
    def __init__(self):
        {} => self.books
        [] => self.titles

    def add_book(self, title):
        False => self.books[title]
        self.titles + [title] => self.titles

    def checkout(self, title):
        if self.books[title]:
            raise ValueError("already checked out: " + title)
        True => self.books[title]

    def return_book(self, title):
        False => self.books[title]

    def is_available(self, title):
        return not self.books[title]

Library() => library
library.add_book("Dune")
library.add_book("Neuromancer")
library.add_book("The Hobbit")

library.checkout("Dune")
"Checked out: Dune" => line1
line1^0

try:
    library.checkout("Dune")
except ValueError:
    "Could not check out Dune: already checked out" => msg
    msg^0

library.return_book("Dune")
"Returned: Dune" => line2
line2^0

library.checkout("Neuromancer")
"Checked out: Neuromancer" => line3
line3^0

for title in library.titles:
    if library.is_available(title):
        title + " is available" => status
    else:
        title + " is checked out" => status
    status^0
```

## Python (deterministic transpilation)

```python
class Library:
    def __init__(self):
        self.books = {}
        self.titles = []
    def add_book(self, title):
        self.books[title] = False
        self.titles = self.titles + [title]
    def checkout(self, title):
        if self.books[title]:
            raise ValueError("already checked out: " + title)
        self.books[title] = True
    def return_book(self, title):
        self.books[title] = False
    def is_available(self, title):
        return not self.books[title]

library = Library()
library.add_book("Dune")
library.add_book("Neuromancer")
library.add_book("The Hobbit")
library.checkout("Dune")
line1 = "Checked out: Dune"
print(line1)
try:
    library.checkout("Dune")
except ValueError:
    msg = "Could not check out Dune: already checked out"
    print(msg)
library.return_book("Dune")
line2 = "Returned: Dune"
print(line2)
library.checkout("Neuromancer")
line3 = "Checked out: Neuromancer"
print(line3)
for title in library.titles:
    if library.is_available(title):
        status = title + " is available"
    else:
        status = title + " is checked out"
    print(status)
```

## stdout (executed)

```text
Checked out: Dune
Could not check out Dune: already checked out
Returned: Dune
Checked out: Neuromancer
Dune is available
Neuromancer is checked out
The Hobbit is available
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
