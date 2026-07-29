<!-- canonical: efficientnewlanguage.org/ai/examples/143-exception-suppressing-manager | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 143 — `__exit__`'s return value decides everything

`exception_suppressing_manager.eml` isolates the part of the context-manager protocol that surprises people.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The part of the
# context-manager protocol that surprises people: __exit__'s RETURN VALUE
# decides whether the exception keeps travelling.
#
#   return False (or nothing)  ->  the exception propagates, as usual
#   return True                ->  the exception is SWALLOWED, and execution
#                                  resumes after the with-block
#
# That is a lot of power hidden in a boolean. A manager returning True
# unconditionally silently eats every failure inside its block: the code after
# the block runs as though nothing went wrong, and no handler anywhere sees the
# error. It is the context-manager form of a bare `except: pass`.
#
# The managers below differ ONLY in what __exit__ returns, and the program
# prints what actually happened each time, so the difference is visible rather
# than asserted. The third is the useful shape - suppression on a budget, which
# is how a retry or circuit-breaker wrapper behaves: absorb a few failures,
# then stop lying and let one through.
#
# A LIMITATION worth knowing, and the reason the budget is counted rather than
# switched on the exception's type: EML-P has no first-class exception objects.
# `__exit__`'s first parameter is a plain STRING here (`"ValueError"`), and
# CPython passes the class object `<class 'ValueError'>`; the third parameter is
# None here and a traceback object there. So `exc_type == ValueError` cannot be
# written - `ValueError` is not a value you can name - and printing exc_type or
# the traceback would produce different text in the interpreter than in the
# transpiled Python. Comparing against None DOES agree, and that is the one
# check used below.

class SwallowAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return True

class PropagateAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return False

class Budgeted:
    def __init__(self, budget):
        budget => self.budget
        0 => self.absorbed
        0 => self.clean
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        if exc_type == None:
            self.clean + 1 => self.clean
            return False
        if self.absorbed < self.budget:
            self.absorbed + 1 => self.absorbed
            return True
        return False

0 => reached_after
"A. __exit__ returns True" => h1
h1^0
with SwallowAll() as s:
    "  raising inside the block" => a1
    a1^0
    raise ValueError("this never escapes")
1 => reached_after
"  execution continued - nothing was raised out of the block" => a2
a2^0
""^0

"B. __exit__ returns False" => h2
h2^0
try:
    with PropagateAll() as p:
        "  raising inside the block" => b1
        b1^0
        raise ValueError("this does escape")
    "  UNREACHABLE" => bad
    bad^0
except ValueError:
    "  caught outside, as expected" => b2
    b2^0
""^0

"C. suppression on a budget of 2" => h3
h3^0
Budgeted(2) => guard

0 => escaped
for attempt in [1:4]:
    try:
        with guard as g:
            if attempt < 4:
                ("  attempt " + str(attempt) + ": failing")^0
                raise ValueError("attempt " + str(attempt))
            ("  attempt " + str(attempt) + ": succeeded")^0
    except ValueError:
        escaped + 1 => escaped
        ("  attempt " + str(attempt) + ": escaped to the caller")^0

""^0
("Budget 2: absorbed " + str(guard.absorbed) + ", escaped " + str(escaped) + ", clean exits " + str(guard.clean) + ".")^0
("Code after the swallowing block ran: " + str(reached_after == 1))^0
"Attempts 1 and 2 were absorbed, attempt 3 exhausted the budget and escaped," => n1
n1^0
"and attempt 4 left cleanly. The only difference between A and B is one" => n2
n2^0
"boolean, and it decides whether a failure is invisible or fatal." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class SwallowAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return True

class PropagateAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return False

class Budgeted:
    def __init__(self, budget):
        self.budget = budget
        self.absorbed = 0
        self.clean = 0
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        if exc_type == None:
            self.clean = self.clean + 1
            return False
        if self.absorbed < self.budget:
            self.absorbed = self.absorbed + 1
            return True
        return False

reached_after = 0
h1 = "A. __exit__ returns True"
print(h1)
with SwallowAll() as s:
    a1 = "  raising inside the block"
    print(a1)
    raise ValueError("this never escapes")
reached_after = 1
a2 = "  execution continued - nothing was raised out of the block"
print(a2)
print("")
h2 = "B. __exit__ returns False"
print(h2)
try:
    with PropagateAll() as p:
        b1 = "  raising inside the block"
        print(b1)
        raise ValueError("this does escape")
    bad = "  UNREACHABLE"
    print(bad)
except ValueError:
    b2 = "  caught outside, as expected"
    print(b2)
print("")
h3 = "C. suppression on a budget of 2"
print(h3)
guard = Budgeted(2)
escaped = 0
for attempt in range(1, 5):
    try:
        with guard as g:
            if attempt < 4:
                print("  attempt " + str(attempt) + ": failing")
                raise ValueError("attempt " + str(attempt))
            print("  attempt " + str(attempt) + ": succeeded")
    except ValueError:
        escaped = escaped + 1
        print("  attempt " + str(attempt) + ": escaped to the caller")
print("")
print("Budget 2: absorbed " + str(guard.absorbed) + ", escaped " + str(escaped) + ", clean exits " + str(guard.clean) + ".")
print("Code after the swallowing block ran: " + str(reached_after == 1))
n1 = "Attempts 1 and 2 were absorbed, attempt 3 exhausted the budget and escaped,"
print(n1)
n2 = "and attempt 4 left cleanly. The only difference between A and B is one"
print(n2)
n3 = "boolean, and it decides whether a failure is invisible or fatal."
print(n3)
```

## stdout (executed)

```text
A. __exit__ returns True
  raising inside the block
  execution continued - nothing was raised out of the block

B. __exit__ returns False
  raising inside the block
  caught outside, as expected

C. suppression on a budget of 2
  attempt 1: failing
  attempt 2: failing
  attempt 3: failing
  attempt 3: escaped to the caller
  attempt 4: succeeded

Budget 2: absorbed 2, escaped 1, clean exits 1.
Code after the swallowing block ran: True
Attempts 1 and 2 were absorbed, attempt 3 exhausted the budget and escaped,
and attempt 4 left cleanly. The only difference between A and B is one
boolean, and it decides whether a failure is invisible or fatal.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:assign · eml:output · eml:call · eml:return · eml:run:done
