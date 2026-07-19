<!-- canonical: efficientnewlanguage.org/ai/examples/032-parking-lot-tracker | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 032 — Case corpus: a self-authored parking lot tracker

`parking_lot_tracker.eml` is a class-based case in a self-authored batch of six OOP utilities (alongside `examples/bank-account-simulator/`, `examples/simple-stack/`, `examples/simple-queue/`, `examples/inventory-tracker/`, and `examples/library-catalog/`) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class-based
# parking lot tracker exercising `self` attribute list state (`self.slots`,
# a fixed-size list of booleans), a `for` loop whose range upper bound is a
# full expression (`[0 : self.capacity - 1]`, the same idiom as
# todo-list-manager's `[0 : len(self.tasks) - 1]`), a `return` from inside a
# `for` loop, and `try`/`except`/`raise ValueError` for parking in a full
# lot.

class ParkingLot:
    def __init__(self, capacity):
        capacity => self.capacity
        [False, False, False, False, False] => self.slots

    def park(self, vehicle):
        for i in [0 : self.capacity - 1]:
            if not self.slots[i]:
                True => self.slots[i]
                return i
        raise ValueError("parking lot is full")

    def leave(self, slot_number):
        False => self.slots[slot_number]

ParkingLot(5) => lot
lot.park("ABC-123") => spot1
"ABC-123 parked in slot " + str(spot1) => line1
line1^0

lot.park("XYZ-789") => spot2
"XYZ-789 parked in slot " + str(spot2) => line2
line2^0

lot.leave(spot1)
"ABC-123 left slot " + str(spot1) => line3
line3^0

lot.park("QRS-456") => spot3
"QRS-456 parked in slot " + str(spot3) => line4
line4^0

lot.park("LMN-321") => spot4
lot.park("DEF-654") => spot5
lot.park("GHI-987") => spot6
"Lot now has vehicles in slots: " + str(lot.slots) => line5
line5^0

try:
    lot.park("TUV-111")
except ValueError:
    "Could not park TUV-111: lot is full" => msg
    msg^0
```

## Python (deterministic transpilation)

```python
class ParkingLot:
    def __init__(self, capacity):
        self.capacity = capacity
        self.slots = [False, False, False, False, False]
    def park(self, vehicle):
        for i in range(0, self.capacity):
            if not self.slots[i]:
                self.slots[i] = True
                return i
        raise ValueError("parking lot is full")
    def leave(self, slot_number):
        self.slots[slot_number] = False

lot = ParkingLot(5)
spot1 = lot.park("ABC-123")
line1 = "ABC-123 parked in slot " + str(spot1)
print(line1)
spot2 = lot.park("XYZ-789")
line2 = "XYZ-789 parked in slot " + str(spot2)
print(line2)
lot.leave(spot1)
line3 = "ABC-123 left slot " + str(spot1)
print(line3)
spot3 = lot.park("QRS-456")
line4 = "QRS-456 parked in slot " + str(spot3)
print(line4)
spot4 = lot.park("LMN-321")
spot5 = lot.park("DEF-654")
spot6 = lot.park("GHI-987")
line5 = "Lot now has vehicles in slots: " + str(lot.slots)
print(line5)
try:
    lot.park("TUV-111")
except ValueError:
    msg = "Could not park TUV-111: lot is full"
    print(msg)
```

## stdout (executed)

```text
ABC-123 parked in slot 0
XYZ-789 parked in slot 1
ABC-123 left slot 0
QRS-456 parked in slot 0
Lot now has vehicles in slots: [True, True, True, True, True]
Could not park TUV-111: lot is full
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
