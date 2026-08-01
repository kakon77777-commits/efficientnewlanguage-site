<!-- canonical: efficientnewlanguage.org/ai/examples/186-connection-pool-release | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 186 — Connection pool: release on every exit path

`connection_pool_release.eml` is a lease-based connection pool whose releases are driven by a context manager. It exists to answer one question: does the release still happen when the body does **not** fall off the end?

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A connection
# pool whose leases are released by a context manager - the program that
# exists to answer one question: does the release still happen when the body
# does NOT fall off the end?
#
# Every `with` block has four ways out, and only the first is the one people
# test:
#
#   1. the body ends normally
#   2. the body executes `break`
#   3. the body executes `return`
#   4. the body raises
#
# A pool that releases on (1) alone looks perfect in a demo and leaks in
# production, because (2) and (3) are what real code does the moment there is
# an early exit. The leak is silent: nothing errors, the pool just slowly runs
# out. So the check here is not "did the program print the right thing" but
# the invariant a pool must never break -
#
#   leased == released, after every path
#
# and it is checked after each of the four paths separately, so a failure says
# WHICH exit was not covered rather than just "the totals are off".

class Pool:
    def __init__(self, size):
        size => self.size
        0 => self.leased
        0 => self.released
        [] => self.log

    def lease(self, who):
        self.leased + 1 => self.leased
        self.log + [who + ":lease"] => self.log
        return Lease(self, who)

    def release(self, who):
        self.released + 1 => self.released
        self.log + [who + ":release"] => self.log

    def outstanding(self):
        return self.leased - self.released


class Lease:
    def __init__(self, pool, who):
        pool => self.pool
        who => self.who

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, tb):
        # Runs on every exit path. Returning False means "I did not handle the
        # exception" - a context manager that returns True here would swallow
        # errors, which is a different and much worse bug.
        self.pool.release(self.who)
        return False


Pool(4) => pool

# ---------------------------------------------------------------- path 1
with pool.lease("normal") as lease:
    "normal body ran" => note1
    note1^0
("  outstanding after normal exit: " + str(pool.outstanding()))^0

# ---------------------------------------------------------------- path 2
for attempt in [0:3]:
    with pool.lease("break") as lease:
        if attempt == 1:
            break
        ("  loop body " + str(attempt))^0
("  outstanding after break: " + str(pool.outstanding()))^0

# ---------------------------------------------------------------- path 3
def borrow_and_return(p):
    with p.lease("return") as lease:
        return "early return from inside the with-block"

borrow_and_return(pool) => msg
("  " + msg)^0
("  outstanding after return: " + str(pool.outstanding()))^0

# ---------------------------------------------------------------- path 4
try:
    with pool.lease("raise") as lease:
        raise ValueError("the body failed")
except ValueError as e:
    ("  caught: " + str(e))^0
("  outstanding after raise: " + str(pool.outstanding()))^0

""^0
"Lease/release log, in order:"^0
for entry in pool.log:
    ("  " + entry)^0

""^0
("leased:   " + str(pool.leased))^0
("released: " + str(pool.released))^0

# The log must alternate lease,release,lease,release... - a release that
# happens twice, or one that happens for the wrong lease, still balances the
# totals. Checking the ORDER is what makes this a real check.
True => alternates
0 => i
while i < len(pool.log):
    pool.log[i] => entry
    if i % 2 == 0:
        if not (entry[len(entry) - 6:] == ":lease"):
            False => alternates
    else:
        if not (entry[len(entry) - 8:] == ":release"):
            False => alternates
    i + 1 => i

""^0
if pool.leased == pool.released and alternates:
    "Balanced on all four exit paths, and every lease was released once." => verdict
else:
    "LEAK - some exit path did not release its lease." => verdict
verdict^0

"The three interesting paths are break, return and raise. A context manager" => n1
n1^0
"tested only on a body that runs to completion passes every time and still" => n2
n2^0
"leaks, because early exits are what production code is made of." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class Pool:
    def __init__(self, size):
        self.size = size
        self.leased = 0
        self.released = 0
        self.log = []
    def lease(self, who):
        self.leased = self.leased + 1
        self.log = self.log + [who + ":lease"]
        return Lease(self, who)
    def release(self, who):
        self.released = self.released + 1
        self.log = self.log + [who + ":release"]
    def outstanding(self):
        return self.leased - self.released

class Lease:
    def __init__(self, pool, who):
        self.pool = pool
        self.who = who
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        self.pool.release(self.who)
        return False

pool = Pool(4)
with pool.lease("normal") as lease:
    note1 = "normal body ran"
    print(note1)
print("  outstanding after normal exit: " + str(pool.outstanding()))
for attempt in range(0, 4):
    with pool.lease("break") as lease:
        if attempt == 1:
            break
        print("  loop body " + str(attempt))
print("  outstanding after break: " + str(pool.outstanding()))

def borrow_and_return(p):
    with p.lease("return") as lease:
        return "early return from inside the with-block"

msg = borrow_and_return(pool)
print("  " + msg)
print("  outstanding after return: " + str(pool.outstanding()))
try:
    with pool.lease("raise") as lease:
        raise ValueError("the body failed")
except ValueError as e:
    print("  caught: " + str(e))
print("  outstanding after raise: " + str(pool.outstanding()))
print("")
print("Lease/release log, in order:")
for entry in pool.log:
    print("  " + entry)
print("")
print("leased:   " + str(pool.leased))
print("released: " + str(pool.released))
alternates = True
i = 0
while i < len(pool.log):
    entry = pool.log[i]
    if i % 2 == 0:
        if not entry[len(entry) - 6:] == ":lease":
            alternates = False
    elif not entry[len(entry) - 8:] == ":release":
        alternates = False
    i = i + 1
print("")
if pool.leased == pool.released and alternates:
    verdict = "Balanced on all four exit paths, and every lease was released once."
else:
    verdict = "LEAK - some exit path did not release its lease."
print(verdict)
n1 = "The three interesting paths are break, return and raise. A context manager"
print(n1)
n2 = "tested only on a body that runs to completion passes every time and still"
print(n2)
n3 = "leaks, because early exits are what production code is made of."
print(n3)
```

## stdout (executed)

```text
normal body ran
  outstanding after normal exit: 0
  loop body 0
  outstanding after break: 0
  early return from inside the with-block
  outstanding after return: 0
  caught: the body failed
  outstanding after raise: 0

Lease/release log, in order:
  normal:lease
  normal:release
  break:lease
  break:release
  break:lease
  break:release
  return:lease
  return:release
  raise:lease
  raise:release

leased:   5
released: 5

Balanced on all four exit paths, and every lease was released once.
The three interesting paths are break, return and raise. A context manager
tested only on a body that runs to completion passes every time and still
leaks, because early exits are what production code is made of.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:def · eml:run:done
