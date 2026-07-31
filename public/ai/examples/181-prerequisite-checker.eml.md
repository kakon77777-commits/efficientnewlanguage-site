<!-- canonical: efficientnewlanguage.org/ai/examples/181-prerequisite-checker | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 181 — "Are all requirements met" is a subset test

`prerequisite_checker.eml` — checks course eligibility.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Course
# prerequisites: can a student enrol? The question "are all requirements met"
# IS a subset test, and writing it as one is both shorter and less error-prone
# than a loop with a flag.
#
#   required <= completed
#
# The difference tells you what is still outstanding, in one operation:
#
#   required - completed
#
# Both were unavailable here until this round. Written as a loop instead, the
# usual bug is forgetting to initialise the flag to True for the empty case -
# a course with NO prerequisites should always be enrollable, and `set() <= x`
# is True for every x, which is the right answer for free.

def outstanding(required, completed):
    return required - completed

def eligible(required, completed):
    return required <= completed

{"algebra", "geometry"} => calculus_reqs
{} => catalogue
calculus_reqs => catalogue["calculus"]
{"calculus"} => catalogue["analysis"]
{"algebra"} => catalogue["statistics"]
set() => catalogue["intro"]

{"algebra", "geometry", "history"} => alice
{"algebra"} => bob

("Catalogue: " + str(len(catalogue)) + " courses")^0
""^0

"course       alice        bob" => header
header^0
"-----------  -----------  -----------" => rule
rule^0
for course in catalogue:
    catalogue[course] => reqs
    if eligible(reqs, alice):
        "yes" => a
    else:
        "needs " + str(len(outstanding(reqs, alice))) => a
    if eligible(reqs, bob):
        "yes" => b
    else:
        "needs " + str(len(outstanding(reqs, bob))) => b
    13 - len(course) => pad1
    if pad1 < 1:
        1 => pad1
    13 - len(a) => pad2
    if pad2 < 1:
        1 => pad2
    (course + " " * pad1 + a + " " * pad2 + b)^0

""^0
"The empty prerequisite set is enrollable by everyone" => h
h^0
("  set() <= alice -> " + str(set() <= alice))^0
("  set() <= set() -> " + str(set() <= set()))^0
("  a loop with a badly-initialised flag gets this case wrong;")^0
("  the subset test gets it right without a special case.")^0
""^0

("What bob still needs for calculus: " + str(outstanding(calculus_reqs, bob)))^0
("Has bob strictly fewer of them than required? " + str(bob < calculus_reqs))^0
```

## Python (deterministic transpilation)

```python
def outstanding(required, completed):
    return required - completed

def eligible(required, completed):
    return required <= completed

calculus_reqs = {"algebra", "geometry"}
catalogue = {}
catalogue["calculus"] = calculus_reqs
catalogue["analysis"] = {"calculus"}
catalogue["statistics"] = {"algebra"}
catalogue["intro"] = set()
alice = {"algebra", "geometry", "history"}
bob = {"algebra"}
print("Catalogue: " + str(len(catalogue)) + " courses")
print("")
header = "course       alice        bob"
print(header)
rule = "-----------  -----------  -----------"
print(rule)
for course in catalogue:
    reqs = catalogue[course]
    if eligible(reqs, alice):
        a = "yes"
    else:
        a = "needs " + str(len(outstanding(reqs, alice)))
    if eligible(reqs, bob):
        b = "yes"
    else:
        b = "needs " + str(len(outstanding(reqs, bob)))
    pad1 = 13 - len(course)
    if pad1 < 1:
        pad1 = 1
    pad2 = 13 - len(a)
    if pad2 < 1:
        pad2 = 1
    print(course + " " * pad1 + a + " " * pad2 + b)
print("")
h = "The empty prerequisite set is enrollable by everyone"
print(h)
print("  set() <= alice -> " + str(set() <= alice))
print("  set() <= set() -> " + str(set() <= set()))
print("  a loop with a badly-initialised flag gets this case wrong;")
print("  the subset test gets it right without a special case.")
print("")
print("What bob still needs for calculus: " + str(outstanding(calculus_reqs, bob)))
print("Has bob strictly fewer of them than required? " + str(bob < calculus_reqs))
```

## stdout (executed)

```text
Catalogue: 4 courses

course       alice        bob
-----------  -----------  -----------
calculus     yes          needs 1
analysis     needs 1      needs 1
statistics   yes          yes
intro        yes          yes

The empty prerequisite set is enrollable by everyone
  set() <= alice -> True
  set() <= set() -> True
  a loop with a badly-initialised flag gets this case wrong;
  the subset test gets it right without a special case.

What bob still needs for calculus: {'geometry'}
Has bob strictly fewer of them than required? True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
