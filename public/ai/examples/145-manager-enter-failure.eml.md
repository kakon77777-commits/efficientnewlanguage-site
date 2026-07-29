<!-- canonical: efficientnewlanguage.org/ai/examples/145-manager-enter-failure | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 145 — When cleanup does *not* run

`manager_enter_failure.eml` covers the context-manager rule almost nobody states, and the one that decides whether "cleanup always runs" is actually true.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). What happens when
# __enter__ itself fails - the rule almost nobody states, and the one that
# decides whether "cleanup always runs" is actually true.
#
# It is not. `with` guarantees __exit__ runs if the block was ENTERED. If
# __enter__ raises, there is no block and no __exit__ call, because the manager
# never finished setting itself up and asking it to tear down a half-built
# thing would be worse than not asking.
#
# The consequence is a real design rule: __enter__ must clean up after ITSELF
# if it fails partway. Nothing else will. The Multi manager below acquires
# three parts and fails on the third; it has to release the first two by hand,
# inside __enter__, because its own __exit__ is never going to be called.
#
# The counters at the end prove the rule rather than restating it: enters and
# exits are counted separately, and a failed enter shows up as an enter with no
# matching exit, while nothing inside the block ever ran.

class Fragile:
    def __init__(self, fail_on_enter):
        fail_on_enter => self.fail_on_enter
        0 => self.enters
        0 => self.exits
        0 => self.bodies

    def __enter__(self):
        self.enters + 1 => self.enters
        if self.fail_on_enter:
            "  __enter__ is raising" => msg
            msg^0
            raise ValueError("could not acquire")
        "  __enter__ succeeded" => ok
        ok^0
        return self

    def __exit__(self, exc_type, exc_value, tb):
        self.exits + 1 => self.exits
        "  __exit__ ran" => msg
        msg^0
        return False

"A. __enter__ succeeds" => h1
h1^0
Fragile(False) => good
with good as g:
    good.bodies + 1 => good.bodies
    "  block body ran" => b
    b^0
("  enters=" + str(good.enters) + " exits=" + str(good.exits) + " bodies=" + str(good.bodies))^0
""^0

"B. __enter__ fails" => h2
h2^0
Fragile(True) => bad
try:
    with bad as b2:
        bad.bodies + 1 => bad.bodies
        "  block body ran  <- should NOT appear" => oops
        oops^0
except ValueError:
    "  the raise from __enter__ reached the handler" => caught
    caught^0
("  enters=" + str(bad.enters) + " exits=" + str(bad.exits) + " bodies=" + str(bad.bodies))^0
"  one enter, ZERO exits, ZERO bodies - the block never existed" => note
note^0
""^0

"C. a manager that cleans up after its own failed __enter__" => h3
h3^0

class Multi:
    def __init__(self):
        [] => self.held
    def __enter__(self):
        for part in ["alpha", "beta", "gamma"]:
            if part == "gamma":
                ("    cannot acquire " + part + " - releasing what I already hold")^0
                self.release_all()
                raise ValueError("acquire failed at " + part)
            self.held + [part] => self.held
            ("    acquired " + part)^0
        return self
    def release_all(self):
        for part in self.held:
            ("    released " + part)^0
        [] => self.held
    def __exit__(self, exc_type, exc_value, tb):
        "    __exit__ (never reached in this program)" => msg
        msg^0
        self.release_all()
        return False

Multi() => m
try:
    with m as held:
        "  UNREACHABLE" => u
        u^0
except ValueError:
    ("  failed to enter; parts still held afterwards: " + str(len(m.held)))^0

""^0
"Nothing leaked, but only because __enter__ tidied up itself. Had it just" => n1
n1^0
"raised after acquiring alpha and beta, those two would be held forever and" => n2
n2^0
"no __exit__ would ever come to free them." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class Fragile:
    def __init__(self, fail_on_enter):
        self.fail_on_enter = fail_on_enter
        self.enters = 0
        self.exits = 0
        self.bodies = 0
    def __enter__(self):
        self.enters = self.enters + 1
        if self.fail_on_enter:
            msg = "  __enter__ is raising"
            print(msg)
            raise ValueError("could not acquire")
        ok = "  __enter__ succeeded"
        print(ok)
        return self
    def __exit__(self, exc_type, exc_value, tb):
        self.exits = self.exits + 1
        msg = "  __exit__ ran"
        print(msg)
        return False

h1 = "A. __enter__ succeeds"
print(h1)
good = Fragile(False)
with good as g:
    good.bodies = good.bodies + 1
    b = "  block body ran"
    print(b)
print("  enters=" + str(good.enters) + " exits=" + str(good.exits) + " bodies=" + str(good.bodies))
print("")
h2 = "B. __enter__ fails"
print(h2)
bad = Fragile(True)
try:
    with bad as b2:
        bad.bodies = bad.bodies + 1
        oops = "  block body ran  <- should NOT appear"
        print(oops)
except ValueError:
    caught = "  the raise from __enter__ reached the handler"
    print(caught)
print("  enters=" + str(bad.enters) + " exits=" + str(bad.exits) + " bodies=" + str(bad.bodies))
note = "  one enter, ZERO exits, ZERO bodies - the block never existed"
print(note)
print("")
h3 = "C. a manager that cleans up after its own failed __enter__"
print(h3)

class Multi:
    def __init__(self):
        self.held = []
    def __enter__(self):
        for part in ["alpha", "beta", "gamma"]:
            if part == "gamma":
                print("    cannot acquire " + part + " - releasing what I already hold")
                self.release_all()
                raise ValueError("acquire failed at " + part)
            self.held = self.held + [part]
            print("    acquired " + part)
        return self
    def release_all(self):
        for part in self.held:
            print("    released " + part)
        self.held = []
    def __exit__(self, exc_type, exc_value, tb):
        msg = "    __exit__ (never reached in this program)"
        print(msg)
        self.release_all()
        return False

m = Multi()
try:
    with m as held:
        u = "  UNREACHABLE"
        print(u)
except ValueError:
    print("  failed to enter; parts still held afterwards: " + str(len(m.held)))
print("")
n1 = "Nothing leaked, but only because __enter__ tidied up itself. Had it just"
print(n1)
n2 = "raised after acquiring alpha and beta, those two would be held forever and"
print(n2)
n3 = "no __exit__ would ever come to free them."
print(n3)
```

## stdout (executed)

```text
A. __enter__ succeeds
  __enter__ succeeded
  block body ran
  __exit__ ran
  enters=1 exits=1 bodies=1

B. __enter__ fails
  __enter__ is raising
  the raise from __enter__ reached the handler
  enters=1 exits=0 bodies=0
  one enter, ZERO exits, ZERO bodies - the block never existed

C. a manager that cleans up after its own failed __enter__
    acquired alpha
    acquired beta
    cannot acquire gamma - releasing what I already hold
    released alpha
    released beta
  failed to enter; parts still held afterwards: 0

Nothing leaked, but only because __enter__ tidied up itself. Had it just
raised after acquiring alpha and beta, those two would be held forever and
no __exit__ would ever come to free them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:assign · eml:output · eml:call · eml:return · eml:run:done
