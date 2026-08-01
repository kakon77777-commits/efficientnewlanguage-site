<!-- canonical: efficientnewlanguage.org/ai/examples/198-thermostat-class-defaults | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 198 — Thermostats: a factory default shared until it is overridden

`thermostat_class_defaults.eml` models the shape every settings object has — a default on the **class**, a per-object override on the **instance** — and checks that the boundary between them holds.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Thermostats that
# share a factory default until one of them is adjusted.
#
# This is the shape every settings object has: a default that lives on the
# CLASS, and a per-object override that lives on the INSTANCE. Reading falls
# back from instance to class; writing only ever touches the instance. Get that
# backwards and adjusting one device silently reconfigures the whole fleet.
#
# Until 2026-08-01 this program could not be written here at all. A class body
# in EML ran only its `def`s: `class Thermostat: 20 => target` bound the class
# and threw the assignment away, so `self.target` raised AttributeError as if
# the line had never existed. The class body now runs once, in a namespace of
# its own, and that namespace becomes the class attributes - which is what
# Python does.
#
# What the program checks, on top of printing the readings:
#
#   1. adjusting one unit does not move any other unit
#   2. a unit that was never adjusted still reads the class default
#   3. changing the class default afterwards moves exactly the un-adjusted
#      units, and leaves the adjusted ones where their owners put them

class Thermostat:
    # Factory defaults - one copy, shared by every unit until overridden.
    20 => target
    2 => swing
    "C" => unit

    def __init__(self, room):
        room => self.room

    def label(self):
        return self.room + ": target " + str(self.target) + self.unit + " +/-" + str(self.swing)

    def call_for_heat(self, current):
        # Heat below the bottom of the deadband, cool above the top; the
        # deadband itself is what stops a thermostat short-cycling.
        if current < self.target - self.swing:
            return "HEAT"
        if current > self.target + self.swing:
            return "COOL"
        return "idle"


Thermostat("hall") => hall
Thermostat("nursery") => nursery
Thermostat("cellar") => cellar
[hall, nursery, cellar] => units

"Factory state - every unit reads the class default:"^0
for u in units:
    ("  " + u.label())^0

# One owner turns the nursery up and narrows its deadband. This writes to the
# INSTANCE only.
23 => nursery.target
1 => nursery.swing

""^0
"After adjusting the nursery only:"^0
for u in units:
    ("  " + u.label())^0

""^0
"Behaviour at 19 degrees:"^0
for u in units:
    ("  " + u.room + " -> " + u.call_for_heat(19))^0

# Sampled BEFORE the class default moves. Checking hall's target after the
# default drops to 18 would find 18 either way - once because the nursery
# edit correctly stayed local, and once because it wrongly wrote through and
# the new default then covered the tracks. The check has to happen while the
# two outcomes still look different.
hall.target => hall_before
cellar.target => cellar_before
hall.swing => hall_swing_before

# Now the manufacturer ships a new default. Units that were never adjusted must
# follow it; the nursery must not.
18 => Thermostat.target

""^0
"After the factory default drops to 18:"^0
for u in units:
    ("  " + u.label())^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# 1. adjusting the nursery must not have moved hall or cellar - measured
#    while the class default was still 20, so a write-through would show.
checked + 1 => checked
if hall_before == 20 and cellar_before == 20 and hall_swing_before == 2:
    passed + 1 => passed

# 2. the nursery keeps what its owner set, class default or not
checked + 1 => checked
if nursery.target == 23 and nursery.swing == 1:
    passed + 1 => passed

# 3. the un-adjusted units DID follow the new class default, so the fallback
#    is a live lookup rather than a value copied at construction time
checked + 1 => checked
if hall.target == 18 and cellar.target == 18 and hall.swing == 2:
    passed + 1 => passed

# 4. every unit still reads the class-level unit string
checked + 1 => checked
if hall.unit == "C" and nursery.unit == "C" and cellar.unit == "C":
    passed + 1 => passed

# 5. the class attribute itself is readable off the class
checked + 1 => checked
if Thermostat.target == 18 and Thermostat.swing == 2:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Instance writes stay local; class writes reach only the un-adjusted." => verdict
else:
    "FAILED - the instance/class boundary leaked." => verdict
verdict^0

"Check 1 is the one that matters. A settings object that writes through to" => n1
n1^0
"the class looks correct for a single device and reconfigures every other" => n2
n2^0
"device the moment a second one exists." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class Thermostat:
    target = 20
    swing = 2
    unit = "C"
    def __init__(self, room):
        self.room = room
    def label(self):
        return self.room + ": target " + str(self.target) + self.unit + " +/-" + str(self.swing)
    def call_for_heat(self, current):
        if current < self.target - self.swing:
            return "HEAT"
        if current > self.target + self.swing:
            return "COOL"
        return "idle"

hall = Thermostat("hall")
nursery = Thermostat("nursery")
cellar = Thermostat("cellar")
units = [hall, nursery, cellar]
print("Factory state - every unit reads the class default:")
for u in units:
    print("  " + u.label())
nursery.target = 23
nursery.swing = 1
print("")
print("After adjusting the nursery only:")
for u in units:
    print("  " + u.label())
print("")
print("Behaviour at 19 degrees:")
for u in units:
    print("  " + u.room + " -> " + u.call_for_heat(19))
hall_before = hall.target
cellar_before = cellar.target
hall_swing_before = hall.swing
Thermostat.target = 18
print("")
print("After the factory default drops to 18:")
for u in units:
    print("  " + u.label())
passed = 0
checked = 0
checked = checked + 1
if hall_before == 20 and cellar_before == 20 and hall_swing_before == 2:
    passed = passed + 1
checked = checked + 1
if nursery.target == 23 and nursery.swing == 1:
    passed = passed + 1
checked = checked + 1
if hall.target == 18 and cellar.target == 18 and hall.swing == 2:
    passed = passed + 1
checked = checked + 1
if hall.unit == "C" and nursery.unit == "C" and cellar.unit == "C":
    passed = passed + 1
checked = checked + 1
if Thermostat.target == 18 and Thermostat.swing == 2:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Instance writes stay local; class writes reach only the un-adjusted."
else:
    verdict = "FAILED - the instance/class boundary leaked."
print(verdict)
n1 = "Check 1 is the one that matters. A settings object that writes through to"
print(n1)
n2 = "the class looks correct for a single device and reconfigures every other"
print(n2)
n3 = "device the moment a second one exists."
print(n3)
```

## stdout (executed)

```text
Factory state - every unit reads the class default:
  hall: target 20C +/-2
  nursery: target 20C +/-2
  cellar: target 20C +/-2

After adjusting the nursery only:
  hall: target 20C +/-2
  nursery: target 23C +/-1
  cellar: target 20C +/-2

Behaviour at 19 degrees:
  hall -> idle
  nursery -> HEAT
  cellar -> idle

After the factory default drops to 18:
  hall: target 18C +/-2
  nursery: target 23C +/-1
  cellar: target 18C +/-2

checks passed: 5/5
Instance writes stay local; class writes reach only the un-adjusted.
Check 1 is the one that matters. A settings object that writes through to
the class looks correct for a single device and reconfigures every other
device the moment a second one exists.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:classdef · eml:call · eml:return · eml:output · eml:run:done
