<!-- canonical: efficientnewlanguage.org/ai/examples/196-ring-buffer-bounds-report | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 196 — Ring buffer: telling a bad read from a bad write

`ring_buffer_bounds_report.eml` is a fixed-capacity ring buffer whose error handler tells reads and writes apart **by reading the message**.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A fixed-capacity
# ring buffer whose error handler tells reads and writes apart by reading the
# message CPython gives it.
#
# An IndexError is not one error. CPython says
#
#     list index out of range              for  xs[9]
#     list assignment index out of range   for  xs[9] = 1
#
# and the difference is the whole diagnosis: a bad read means the caller asked
# for something that was never written, a bad write means the caller believes
# the buffer is bigger than it is. Same exception class, same line number,
# opposite bug.
#
# Until 2026-08-01 this program could not distinguish them here. The
# interpreter used the read wording for both, which is invisible to anything
# that only checks the exception TYPE and immediately visible to a program
# that prints `str(e)` - which is to say, to any program that logs its errors.
#
# The buffer below deliberately drives four out-of-range accesses, two of each
# kind, and classifies every one by its message alone.

class Ring:
    def __init__(self, capacity):
        capacity => self.capacity
        [] => self.slots
        for i in [0:capacity - 1]:
            self.slots + [0] => self.slots
        0 => self.count

    def put(self, index, value):
        # No bounds check on purpose - the point is to let the container raise
        # and to read what it says.
        value => self.slots[index]
        self.count + 1 => self.count

    def get(self, index):
        return self.slots[index]


Ring(4) => ring
("capacity: " + str(ring.capacity) + ", slots: " + str(ring.slots))^0

# Legal traffic first, so the failures below are clearly about the bounds and
# not about the buffer being broken from the start.
ring.put(0, 11)
ring.put(1, 22)
ring.put(3, 44)
ring.put(-1, 99)
("after legal writes: " + str(ring.slots))^0
("ring.get(2) = " + str(ring.get(2)))^0
("ring.get(-2) = " + str(ring.get(-2)))^0

# --------------------------------------------------------------- the probes
[
    ["read", 4],
    ["write", 4],
    ["read", -9],
    ["write", 7],
] => probes

0 => read_faults
0 => write_faults
0 => misread
[] => report

""^0
"Out-of-range probes:"^0
for probe in probes:
    probe[0] => kind
    probe[1] => index
    "" => message
    try:
        if kind == "read":
            ring.get(index)
        else:
            ring.put(index, 0)
        "NO ERROR RAISED" => message
    except IndexError as e:
        str(e) => message

    # Classify by the message alone. This is exactly what a log-scraping
    # operator does at 3am, and it only works if the two wordings differ.
    if message == "list assignment index out of range":
        "write out of bounds" => diagnosis
        write_faults + 1 => write_faults
    elif message == "list index out of range":
        "read out of bounds" => diagnosis
        read_faults + 1 => read_faults
    else:
        "unclassified" => diagnosis
        misread + 1 => misread

    ("  " + kind + " at " + str(index) + " -> " + message)^0
    ("      diagnosed as: " + diagnosis)^0
    report + [diagnosis] => report

# ------------------------------------------------------------------ checks
""^0
("probes:        " + str(len(probes)))^0
("read faults:   " + str(read_faults))^0
("write faults:  " + str(write_faults))^0
("unclassified:  " + str(misread))^0

# Every probe must be classified, and the diagnosis must match what the probe
# actually did - counting alone would pass even if reads and writes were
# swapped.
True => matched
0 => i
while i < len(probes):
    probes[i][0] => intended
    report[i] => got
    if intended == "read" and not (got == "read out of bounds"):
        False => matched
    if intended == "write" and not (got == "write out of bounds"):
        False => matched
    i + 1 => i

""^0
if misread == 0 and matched and read_faults == 2 and write_faults == 2:
    "Every out-of-range access was classified correctly from its message." => verdict
else:
    "FAILED - reads and writes are indistinguishable from the error text." => verdict
verdict^0

"If both wordings were the same string, the counts above would still be 4," => n1
n1^0
"the program would still run, and every one of these faults would be filed" => n2
n2^0
"as the same bug. An error message is output, and output is behaviour." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class Ring:
    def __init__(self, capacity):
        self.capacity = capacity
        self.slots = []
        for i in range(0, capacity):
            self.slots = self.slots + [0]
        self.count = 0
    def put(self, index, value):
        self.slots[index] = value
        self.count = self.count + 1
    def get(self, index):
        return self.slots[index]

ring = Ring(4)
print("capacity: " + str(ring.capacity) + ", slots: " + str(ring.slots))
ring.put(0, 11)
ring.put(1, 22)
ring.put(3, 44)
ring.put(-1, 99)
print("after legal writes: " + str(ring.slots))
print("ring.get(2) = " + str(ring.get(2)))
print("ring.get(-2) = " + str(ring.get(-2)))
probes = [["read", 4], ["write", 4], ["read", -9], ["write", 7]]
read_faults = 0
write_faults = 0
misread = 0
report = []
print("")
print("Out-of-range probes:")
for probe in probes:
    kind = probe[0]
    index = probe[1]
    message = ""
    try:
        if kind == "read":
            ring.get(index)
        else:
            ring.put(index, 0)
        message = "NO ERROR RAISED"
    except IndexError as e:
        message = str(e)
    if message == "list assignment index out of range":
        diagnosis = "write out of bounds"
        write_faults = write_faults + 1
    elif message == "list index out of range":
        diagnosis = "read out of bounds"
        read_faults = read_faults + 1
    else:
        diagnosis = "unclassified"
        misread = misread + 1
    print("  " + kind + " at " + str(index) + " -> " + message)
    print("      diagnosed as: " + diagnosis)
    report = report + [diagnosis]
print("")
print("probes:        " + str(len(probes)))
print("read faults:   " + str(read_faults))
print("write faults:  " + str(write_faults))
print("unclassified:  " + str(misread))
matched = True
i = 0
while i < len(probes):
    intended = probes[i][0]
    got = report[i]
    if intended == "read" and not got == "read out of bounds":
        matched = False
    if intended == "write" and not got == "write out of bounds":
        matched = False
    i = i + 1
print("")
if misread == 0 and matched and read_faults == 2 and write_faults == 2:
    verdict = "Every out-of-range access was classified correctly from its message."
else:
    verdict = "FAILED - reads and writes are indistinguishable from the error text."
print(verdict)
n1 = "If both wordings were the same string, the counts above would still be 4,"
print(n1)
n2 = "the program would still run, and every one of these faults would be filed"
print(n2)
n3 = "as the same bug. An error message is output, and output is behaviour."
print(n3)
```

## stdout (executed)

```text
capacity: 4, slots: [0, 0, 0, 0]
after legal writes: [11, 22, 0, 99]
ring.get(2) = 0
ring.get(-2) = 0

Out-of-range probes:
  read at 4 -> list index out of range
      diagnosed as: read out of bounds
  write at 4 -> list assignment index out of range
      diagnosed as: write out of bounds
  read at -9 -> list index out of range
      diagnosed as: read out of bounds
  write at 7 -> list assignment index out of range
      diagnosed as: write out of bounds

probes:        4
read faults:   2
write faults:  2
unclassified:  0

Every out-of-range access was classified correctly from its message.
If both wordings were the same string, the counts above would still be 4,
the program would still run, and every one of these faults would be filed
as the same bug. An error message is output, and output is behaviour.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
