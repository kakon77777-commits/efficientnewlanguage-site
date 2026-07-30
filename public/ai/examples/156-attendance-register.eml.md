<!-- canonical: efficientnewlanguage.org/ai/examples/156-attendance-register | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 156 — Updating a key does not move it

`attendance_register.eml` keeps an attendance dict as instance state on a class, updated one mark at a time.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An attendance
# register kept as a class, so the dict lives as instance state across many
# small updates rather than being built in one pass.
#
# The point of interest is that a dict's key ORDER is fixed the first time a
# key is inserted and does not change when that key is UPDATED. Marking the
# same person present twice does not move them to the end of the report. That
# is easy to assume either way, and it is worth a program that shows it.

class Register:
    def __init__(self):
        {} => self.days_present
        0 => self.marks

    def mark(self, name):
        self.marks + 1 => self.marks
        if name in self.days_present:
            self.days_present[name] + 1 => self.days_present[name]
        else:
            1 => self.days_present[name]

    def attended(self, name):
        if name in self.days_present:
            return self.days_present[name]
        return 0

Register() => reg

# Deliberately out of alphabetical order, and with repeats, so that the
# report order is unmistakably insertion order rather than anything else.
["chen", "ana", "brit", "chen", "dev", "ana", "chen"] => log
for name in log:
    reg.mark(name)

("Marks recorded: " + str(reg.marks))^0
("Distinct people: " + str(len(reg.days_present)))^0
""^0

"name   days" => header
header^0
"-----  ----" => rule
rule^0
for name in reg.days_present:
    7 - len(name) => pad
    if pad < 1:
        1 => pad
    (name + " " * pad + str(reg.days_present[name]))^0

""^0
("chen attended " + str(reg.attended("chen")) + " days")^0
("nobody named \"kim\" is in the register: " + str(reg.attended("kim")) + " days")^0
""^0

# Order-free totals.
[] => counts
for name in reg.days_present:
    counts + [reg.days_present[name]] => counts
("Total marks via the register: " + str(sum(counts)) + " (matches " + str(reg.marks) + ": " + str(sum(counts) == reg.marks) + ")")^0
("Best attendance: " + str(max(counts)) + " days")^0

""^0
"\"chen\" appears first in the report because chen was marked first," => n1
n1^0
"even though chen was also marked LAST. Updating a key does not move it." => n2
n2^0
```

## Python (deterministic transpilation)

```python
class Register:
    def __init__(self):
        self.days_present = {}
        self.marks = 0
    def mark(self, name):
        self.marks = self.marks + 1
        if name in self.days_present:
            self.days_present[name] = self.days_present[name] + 1
        else:
            self.days_present[name] = 1
    def attended(self, name):
        if name in self.days_present:
            return self.days_present[name]
        return 0

reg = Register()
log = ["chen", "ana", "brit", "chen", "dev", "ana", "chen"]
for name in log:
    reg.mark(name)
print("Marks recorded: " + str(reg.marks))
print("Distinct people: " + str(len(reg.days_present)))
print("")
header = "name   days"
print(header)
rule = "-----  ----"
print(rule)
for name in reg.days_present:
    pad = 7 - len(name)
    if pad < 1:
        pad = 1
    print(name + " " * pad + str(reg.days_present[name]))
print("")
print("chen attended " + str(reg.attended("chen")) + " days")
print("nobody named \"kim\" is in the register: " + str(reg.attended("kim")) + " days")
print("")
counts = []
for name in reg.days_present:
    counts = counts + [reg.days_present[name]]
print("Total marks via the register: " + str(sum(counts)) + " (matches " + str(reg.marks) + ": " + str(sum(counts) == reg.marks) + ")")
print("Best attendance: " + str(max(counts)) + " days")
print("")
n1 = "\"chen\" appears first in the report because chen was marked first,"
print(n1)
n2 = "even though chen was also marked LAST. Updating a key does not move it."
print(n2)
```

## stdout (executed)

```text
Marks recorded: 7
Distinct people: 4

name   days
-----  ----
chen   3
ana    2
brit   1
dev    1

chen attended 3 days
nobody named "kim" is in the register: 0 days

Total marks via the register: 7 (matches 7: True)
Best attendance: 3 days

"chen" appears first in the report because chen was marked first,
even though chen was also marked LAST. Updating a key does not move it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
