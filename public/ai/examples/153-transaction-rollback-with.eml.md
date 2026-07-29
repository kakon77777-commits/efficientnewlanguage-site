<!-- canonical: efficientnewlanguage.org/ai/examples/153-transaction-rollback-with | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 153 — All-or-nothing, with rollback

`transaction_rollback_with.eml` is the pattern `with` exists for: a change that either fully happens or fully doesn't, decided by how the block was left.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The pattern
# `with` exists for: an all-or-nothing change, where leaving the block by any
# route decides commit or rollback.
#
# The account starts at 100. Three transfers run, one of which is invalid. If
# rollback works, the final balance equals the starting balance plus only the
# VALID transfers - and the program checks that independently, by replaying the
# accepted transfers from a log rather than trusting the account's own number.
#
# What makes this a context-manager problem rather than a try/except one: the
# rollback has to happen on every exit path, including ones the author did not
# think of. __exit__ is told whether the block raised (exc_type is None or it
# is not) and commits or rolls back accordingly, so a new failure mode added
# inside the block later is handled without touching the manager.
#
# The manager deliberately does NOT swallow the exception - it returns False,
# so the caller still learns the transfer failed. Rolling back and staying
# silent would be the worst of both.

class Ledger:
    def __init__(self, balance):
        balance => self.balance
        [] => self.committed

class Transaction:
    def __init__(self, ledger, label):
        ledger => self.ledger
        label => self.label
        0 => self.pending

    def __enter__(self):
        self.ledger.balance => self.snapshot
        0 => self.pending
        return self

    def apply(self, amount):
        self.ledger.balance + amount => self.ledger.balance
        self.pending + amount => self.pending
        if self.ledger.balance < 0:
            raise ValueError("balance would go negative")

    def __exit__(self, exc_type, exc_value, tb):
        if exc_type == None:
            self.ledger.committed + [self.pending] => self.ledger.committed
            ("  COMMIT   " + self.label + " -> balance " + str(self.ledger.balance))^0
        else:
            self.snapshot => self.ledger.balance
            ("  ROLLBACK " + self.label + " -> balance restored to " + str(self.ledger.balance))^0
        return False

Ledger(100) => acct
("Opening balance: " + str(acct.balance))^0
""^0

transfers^+[[0 - 30, "pay rent"], [0 - 500, "pay rent again"], [45, "salary"]]

for t in transfers:
    try:
        with Transaction(acct, t[1]) as tx:
            tx.apply(t[0])
    except ValueError:
        ("           " + t[1] + " refused: " + "insufficient funds")^0

""^0
("Final balance:   " + str(acct.balance))^0

len(acct.committed) => n
100 + Σ(acct.committed[i], i in [0:n - 1]) => replayed
("Replayed from the commit log: 100 + " + str(acct.committed) + " = " + str(replayed))^0

if acct.balance == replayed:
    "  The balance matches the committed transfers exactly." => v1
else:
    "  MISMATCH - a rolled-back transfer left a trace." => v1
v1^0
"" ^0
"The middle transfer was applied, detected as invalid, and undone. Without" => n1
n1^0
"the rollback it would have left the account at -430 at that moment and 115" => n2
n2^0
"minus 500 = -385 at the end. And without the commit log to compare against," => n3
n3^0
"a partial undo would be indistinguishable from a correct one." => n4
n4^0
```

## Python (deterministic transpilation)

```python
class Ledger:
    def __init__(self, balance):
        self.balance = balance
        self.committed = []

class Transaction:
    def __init__(self, ledger, label):
        self.ledger = ledger
        self.label = label
        self.pending = 0
    def __enter__(self):
        self.snapshot = self.ledger.balance
        self.pending = 0
        return self
    def apply(self, amount):
        self.ledger.balance = self.ledger.balance + amount
        self.pending = self.pending + amount
        if self.ledger.balance < 0:
            raise ValueError("balance would go negative")
    def __exit__(self, exc_type, exc_value, tb):
        if exc_type == None:
            self.ledger.committed = self.ledger.committed + [self.pending]
            print("  COMMIT   " + self.label + " -> balance " + str(self.ledger.balance))
        else:
            self.ledger.balance = self.snapshot
            print("  ROLLBACK " + self.label + " -> balance restored to " + str(self.ledger.balance))
        return False

acct = Ledger(100)
print("Opening balance: " + str(acct.balance))
print("")
transfers = [[0 - 30, "pay rent"], [0 - 500, "pay rent again"], [45, "salary"]]
for t in transfers:
    try:
        with Transaction(acct, t[1]) as tx:
            tx.apply(t[0])
    except ValueError:
        print("           " + t[1] + " refused: " + "insufficient funds")
print("")
print("Final balance:   " + str(acct.balance))
n = len(acct.committed)
replayed = 100 + sum(acct.committed[i] for i in range(0, n))
print("Replayed from the commit log: 100 + " + str(acct.committed) + " = " + str(replayed))
if acct.balance == replayed:
    v1 = "  The balance matches the committed transfers exactly."
else:
    v1 = "  MISMATCH - a rolled-back transfer left a trace."
print(v1)
print("")
n1 = "The middle transfer was applied, detected as invalid, and undone. Without"
print(n1)
n2 = "the rollback it would have left the account at -430 at that moment and 115"
print(n2)
n3 = "minus 500 = -385 at the end. And without the commit log to compare against,"
print(n3)
n4 = "a partial undo would be indistinguishable from a correct one."
print(n4)
```

## stdout (executed)

```text
Opening balance: 100

  COMMIT   pay rent -> balance 70
  ROLLBACK pay rent again -> balance restored to 70
           pay rent again refused: insufficient funds
  COMMIT   salary -> balance 115

Final balance:   115
Replayed from the commit log: 100 + [-30, 45] = 115
  The balance matches the committed transfers exactly.

The middle transfer was applied, detected as invalid, and undone. Without
the rollback it would have left the account at -430 at that moment and 115
minus 500 = -385 at the end. And without the commit log to compare against,
a partial undo would be indistinguishable from a correct one.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:sum · eml:run:done
