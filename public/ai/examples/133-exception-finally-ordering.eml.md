<!-- canonical: efficientnewlanguage.org/ai/examples/133-exception-finally-ordering | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 133 — try / except / finally ordering

`exception_finally_ordering.eml` prints the order these actually run in, rather than describing it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). What order
# try/except/finally actually run in, printed rather than described.
#
# Everyone knows "finally always runs". The parts people get wrong are the
# orderings around it, and each one below is demonstrated by a program whose
# output would change if the rule were different:
#
#   - finally runs on the success path AND the exception path, and in both
#     cases AFTER the body, not before the except block.
#   - finally runs even when the try block RETURNS. The return value is
#     computed first, finally runs second, and the caller receives the value
#     third - so a print in finally appears before the caller's print of the
#     returned value.
#   - an exception raised inside a function propagates out through that
#     function's own finally, which still runs on the way past.
#   - a matching `except` stops the search; a non-matching one does not catch,
#     and the exception keeps travelling outward to a handler that does.
#
# The last one is checked with two exception types so that "it was caught"
# cannot be confused with "nothing was raised".

def divide(a, b):
    "    [try] entering" => l1
    l1^0
    try:
        a / b => result
        "    [try] computed" => l2
        l2^0
        return result
    except ZeroDivisionError:
        "    [except] division by zero" => l3
        l3^0
        return 0
    finally:
        "    [finally] runs either way" => l4
        l4^0

"divide(10, 2):" => h1
h1^0
divide(10, 2) => v1
("  caller received " + str(v1))^0

""^0
"divide(10, 0):" => h2
h2^0
divide(10, 0) => v2
("  caller received " + str(v2))^0

""^0
"Note where '[finally] runs either way' sits: after the body, before the" => n1
n1^0
"caller's line. The return value is computed, then finally runs, then the" => n2
n2^0
"caller gets the value - even on the path that returned from inside try." => n3
n3^0

""^0
"An exception passing THROUGH a finally on its way out:" => h3
h3^0

def strict(n):
    try:
        if n < 0:
            raise ValueError("negative input")
        return n
    finally:
        "    [finally] ran even though nothing here caught anything" => l5
        l5^0

try:
    strict(0 - 1) => v3
    "  unreachable" => bad
    bad^0
except ValueError:
    "  caught outside, after the inner finally had already run" => l6
    l6^0

""^0
"A non-matching except does not catch:" => h4
h4^0

def raise_type_error():
    raise TypeError("wrong type")

0 => caught_by
try:
    try:
        raise_type_error()
    except ValueError:
        "  inner ValueError handler ran" => wrong
        wrong^0
        1 => caught_by
except TypeError:
    "  inner ValueError handler did NOT run; outer TypeError handler did" => right
    right^0
    2 => caught_by

("  caught_by = " + str(caught_by) + " (2 means it travelled past the wrong handler)")^0
```

## Python (deterministic transpilation)

```python
def divide(a, b):
    l1 = "    [try] entering"
    print(l1)
    try:
        result = a / b
        l2 = "    [try] computed"
        print(l2)
        return result
    except ZeroDivisionError:
        l3 = "    [except] division by zero"
        print(l3)
        return 0
    finally:
        l4 = "    [finally] runs either way"
        print(l4)

h1 = "divide(10, 2):"
print(h1)
v1 = divide(10, 2)
print("  caller received " + str(v1))
print("")
h2 = "divide(10, 0):"
print(h2)
v2 = divide(10, 0)
print("  caller received " + str(v2))
print("")
n1 = "Note where '[finally] runs either way' sits: after the body, before the"
print(n1)
n2 = "caller's line. The return value is computed, then finally runs, then the"
print(n2)
n3 = "caller gets the value - even on the path that returned from inside try."
print(n3)
print("")
h3 = "An exception passing THROUGH a finally on its way out:"
print(h3)

def strict(n):
    try:
        if n < 0:
            raise ValueError("negative input")
        return n
    finally:
        l5 = "    [finally] ran even though nothing here caught anything"
        print(l5)

try:
    v3 = strict(0 - 1)
    bad = "  unreachable"
    print(bad)
except ValueError:
    l6 = "  caught outside, after the inner finally had already run"
    print(l6)
print("")
h4 = "A non-matching except does not catch:"
print(h4)

def raise_type_error():
    raise TypeError("wrong type")

caught_by = 0
try:
    try:
        raise_type_error()
    except ValueError:
        wrong = "  inner ValueError handler ran"
        print(wrong)
        caught_by = 1
except TypeError:
    right = "  inner ValueError handler did NOT run; outer TypeError handler did"
    print(right)
    caught_by = 2
print("  caught_by = " + str(caught_by) + " (2 means it travelled past the wrong handler)")
```

## stdout (executed)

```text
divide(10, 2):
    [try] entering
    [try] computed
    [finally] runs either way
  caller received 5.0

divide(10, 0):
    [try] entering
    [except] division by zero
    [finally] runs either way
  caller received 0

Note where '[finally] runs either way' sits: after the body, before the
caller's line. The return value is computed, then finally runs, then the
caller gets the value - even on the path that returned from inside try.

An exception passing THROUGH a finally on its way out:
    [finally] ran even though nothing here caught anything
  caught outside, after the inner finally had already run

A non-matching except does not catch:
  inner ValueError handler did NOT run; outer TypeError handler did
  caught_by = 2 (2 means it travelled past the wrong handler)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
