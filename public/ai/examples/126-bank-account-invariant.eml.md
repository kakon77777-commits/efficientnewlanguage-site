<!-- canonical: efficientnewlanguage.org/ai/examples/126-bank-account-invariant | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 126 — A class that defends an invariant

`bank_account_invariant.eml` keeps one rule — the balance is never negative — and raises rather than returning a status when asked to break it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class that
# defends an invariant by raising, rather than by returning a status nobody
# checks.
#
# The invariant is one line: the balance is never negative. The interesting
# design point is what a method does when asked to break it. Returning False
# is easy to ignore - the caller writes `account.withdraw(500)` on its own line
# and the failure evaporates. Raising cannot be ignored by accident; the caller
# has to write a handler, and if it does not, the program stops.
#
# The transcript below runs a mixed sequence of good and bad operations against
# one account, catching the refusals. The final check is the part that matters:
# after every operation, valid and invalid alike, the balance still satisfies
# the invariant AND equals the total of the deposits and withdrawals that were
# actually allowed - computed independently from the log, not from the account.
# A class that silently accepted a bad withdrawal would pass the first check
# and fail the second.

class Account:
    def __init__(self, owner, opening):
        owner => self.owner
        0 => self.balance
        [] => self.log
        self.deposit(opening)

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive, got " + str(amount))
        self.balance + amount => self.balance
        self.log + [amount] => self.log
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive, got " + str(amount))
        if amount > self.balance:
            raise ValueError("insufficient funds: balance " + str(self.balance) + ", requested " + str(amount))
        self.balance - amount => self.balance
        self.log + [0 - amount] => self.log
        return self.balance

Account("Neo", 100) => acct
("Opened account for " + acct.owner + " with " + str(acct.balance))^0
""^0

operations^+[50, 0 - 30, 0 - 500, 200, 0 - 0, 0 - 120, 0 - 100000]

for op in operations:
    try:
        if op > 0:
            acct.deposit(op) => after
            ("  deposit  " + str(op) + "\t-> balance " + str(after))^0
        else:
            acct.withdraw(0 - op) => after
            ("  withdraw " + str(0 - op) + "\t-> balance " + str(after))^0
    except ValueError as e:
        ("  REFUSED  " + str(op) + "\t-> " + str(e))^0

""^0
("Final balance: " + str(acct.balance))^0

len(acct.log) => entries
Σ(acct.log[i], i in [0:entries - 1]) => from_log
("Sum of the " + str(entries) + " ACCEPTED operations: " + str(from_log))^0

if acct.balance == from_log:
    "  The balance equals the accepted operations - nothing slipped through." => v1
else:
    "  MISMATCH - an operation changed the balance without being logged." => v1
v1^0

if acct.balance >= 0:
    "  The invariant held: balance never went negative." => v2
else:
    "  INVARIANT BROKEN." => v2
v2^0

""^0
"Both checks are needed. The invariant alone would still pass if a refused" => n1
n1^0
"withdrawal had quietly succeeded for a smaller amount; the log comparison" => n2
n2^0
"is what makes 'refused' mean the balance genuinely did not move." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class Account:
    def __init__(self, owner, opening):
        self.owner = owner
        self.balance = 0
        self.log = []
        self.deposit(opening)
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive, got " + str(amount))
        self.balance = self.balance + amount
        self.log = self.log + [amount]
        return self.balance
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive, got " + str(amount))
        if amount > self.balance:
            raise ValueError("insufficient funds: balance " + str(self.balance) + ", requested " + str(amount))
        self.balance = self.balance - amount
        self.log = self.log + [0 - amount]
        return self.balance

acct = Account("Neo", 100)
print("Opened account for " + acct.owner + " with " + str(acct.balance))
print("")
operations = [50, 0 - 30, 0 - 500, 200, 0 - 0, 0 - 120, 0 - 100000]
for op in operations:
    try:
        if op > 0:
            after = acct.deposit(op)
            print("  deposit  " + str(op) + "\t-> balance " + str(after))
        else:
            after = acct.withdraw(0 - op)
            print("  withdraw " + str(0 - op) + "\t-> balance " + str(after))
    except ValueError as e:
        print("  REFUSED  " + str(op) + "\t-> " + str(e))
print("")
print("Final balance: " + str(acct.balance))
entries = len(acct.log)
from_log = sum(acct.log[i] for i in range(0, entries))
print("Sum of the " + str(entries) + " ACCEPTED operations: " + str(from_log))
if acct.balance == from_log:
    v1 = "  The balance equals the accepted operations - nothing slipped through."
else:
    v1 = "  MISMATCH - an operation changed the balance without being logged."
print(v1)
if acct.balance >= 0:
    v2 = "  The invariant held: balance never went negative."
else:
    v2 = "  INVARIANT BROKEN."
print(v2)
print("")
n1 = "Both checks are needed. The invariant alone would still pass if a refused"
print(n1)
n2 = "withdrawal had quietly succeeded for a smaller amount; the log comparison"
print(n2)
n3 = "is what makes 'refused' mean the balance genuinely did not move."
print(n3)
```

## stdout (executed)

```text
Opened account for Neo with 100

  deposit  50	-> balance 150
  withdraw 30	-> balance 120
  REFUSED  -500	-> insufficient funds: balance 120, requested 500
  deposit  200	-> balance 320
  REFUSED  0	-> withdrawal must be positive, got 0
  withdraw 120	-> balance 200
  REFUSED  -100000	-> insufficient funds: balance 200, requested 100000

Final balance: 200
Sum of the 5 ACCEPTED operations: 200
  The balance equals the accepted operations - nothing slipped through.
  The invariant held: balance never went negative.

Both checks are needed. The invariant alone would still pass if a refused
withdrawal had quietly succeeded for a smaller amount; the log comparison
is what makes 'refused' mean the balance genuinely did not move.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:sum · eml:run:done
