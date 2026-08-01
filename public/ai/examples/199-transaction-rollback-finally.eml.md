<!-- canonical: efficientnewlanguage.org/ai/examples/199-transaction-rollback-finally | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 199 — Transaction log: `finally` as the only thing holding the books

`transaction_rollback_finally.eml` is a small transaction log in which `finally` is the only thing standing between a half-applied batch and a consistent one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A tiny
# transaction log where `finally` is the only thing standing between a
# half-applied batch and a consistent one.
#
# The rule `finally` exists to enforce: whatever happens in the try body -
# falling through, returning, raising, breaking out of a loop - the finally
# block runs before control leaves. That is easy to state and easy to get
# wrong, because the common case (fall through) works even in an implementation
# that handles nothing else.
#
# So this program exercises the three uncommon exits deliberately:
#
#   commit path   the try body RETURNS, and finally must still close the txn
#   abort path    the try body RAISES, and finally must close it before the
#                 exception propagates
#   retry path    the loop BREAKS out of the try, and finally must close it
#
# and then reconciles the books:
#
#   opened == closed         no transaction was left dangling
#   applied == committed     nothing was applied outside a committed txn
#
# The second one is the interesting invariant. A `finally` that closes the
# transaction but forgets to roll back leaves the counters balanced and the
# data wrong, which is the failure mode that survives casual testing.

class Ledger:
    def __init__(self):
        0 => self.balance
        0 => self.opened
        0 => self.closed
        0 => self.applied
        0 => self.committed
        [] => self.pending
        [] => self.history

    def begin(self, name):
        self.opened + 1 => self.opened
        [] => self.pending
        self.history + ["begin " + name] => self.history

    def stage(self, amount):
        self.pending + [amount] => self.pending

    def close(self, name, commit):
        # Runs from a finally block on every path. `commit` decides whether the
        # staged amounts land or evaporate; closing without deciding is the bug
        # this whole case is about.
        if commit:
            for amount in self.pending:
                self.balance + amount => self.balance
                self.applied + 1 => self.applied
            self.committed + len(self.pending) => self.committed
            self.history + ["commit " + name + " (" + str(len(self.pending)) + ")"] => self.history
        else:
            self.history + ["rollback " + name + " (" + str(len(self.pending)) + ")"] => self.history
        [] => self.pending
        self.closed + 1 => self.closed


Ledger() => book

# ------------------------------------------------------- commit via return
def deposit(ledger, amounts):
    ledger.begin("deposit")
    False => ok
    try:
        for amount in amounts:
            if amount < 0:
                return "refused: negative amount " + str(amount)
            ledger.stage(amount)
        True => ok
        return "staged " + str(len(amounts)) + " deposits"
    finally:
        ledger.close("deposit", ok)

deposit(book, [40, 25, 35]) => r1
("  " + r1)^0
("  balance: " + str(book.balance))^0

# The same function, exited early by `return` from inside the try. Nothing may
# be applied, and the transaction must still be closed.
deposit(book, [10, -5, 90]) => r2
("  " + r2)^0
("  balance: " + str(book.balance))^0

# -------------------------------------------------------- abort via raise
def withdraw(ledger, amount):
    ledger.begin("withdraw")
    False => ok
    try:
        if amount > ledger.balance:
            raise ValueError("insufficient funds: need " + str(amount) + ", have " + str(ledger.balance))
        ledger.stage(0 - amount)
        True => ok
        return "withdrew " + str(amount)
    finally:
        ledger.close("withdraw", ok)

withdraw(book, 30) => r3
("  " + r3)^0
("  balance: " + str(book.balance))^0

try:
    withdraw(book, 5000) => r4
    ("  " + r4)^0
except ValueError as e:
    ("  refused: " + str(e))^0
("  balance: " + str(book.balance))^0

# --------------------------------------------------------- abort via break
[5, 12, 0, 7] => feed
book.begin("sweep")
0 => staged
try:
    for candidate in feed:
        if candidate == 0:
            # A zero entry means the upstream feed is broken - abandon the
            # whole sweep rather than apply half of it.
            break
        book.stage(candidate)
        staged + 1 => staged
finally:
    # Commit only if the WHOLE feed was consumed. Counting is what makes the
    # break visible from here: the finally block cannot see how it was
    # reached, so it has to be told by something the loop body maintained.
    book.close("sweep", staged == len(feed))

("  balance after abandoned sweep: " + str(book.balance))^0

# ------------------------------------------------------------------ books
""^0
"Transaction history:"^0
for entry in book.history:
    ("  " + entry)^0

""^0
("opened:    " + str(book.opened))^0
("closed:    " + str(book.closed))^0
("applied:   " + str(book.applied))^0
("committed: " + str(book.committed))^0
("balance:   " + str(book.balance))^0

# 40+25+35 deposited, 30 withdrawn; the refused deposit, the refused
# withdrawal and the abandoned sweep must all have contributed nothing.
40 + 25 + 35 - 30 => expected

""^0
if book.opened == book.closed and book.applied == book.committed and book.balance == expected:
    "Every transaction closed, and only committed work reached the balance." => verdict
else:
    "FAILED - a transaction leaked, or uncommitted work was applied." => verdict
verdict^0

("expected balance: " + str(expected))^0

"Three of the five transactions here leave the try body without falling off" => n1
n1^0
"the end - one returns, one raises, one breaks. An implementation that runs" => n2
n2^0
"finally only on the fourth path balances the first two counters and still" => n3
n3^0
"loses money." => n4
n4^0
```

## Python (deterministic transpilation)

```python
class Ledger:
    def __init__(self):
        self.balance = 0
        self.opened = 0
        self.closed = 0
        self.applied = 0
        self.committed = 0
        self.pending = []
        self.history = []
    def begin(self, name):
        self.opened = self.opened + 1
        self.pending = []
        self.history = self.history + ["begin " + name]
    def stage(self, amount):
        self.pending = self.pending + [amount]
    def close(self, name, commit):
        if commit:
            for amount in self.pending:
                self.balance = self.balance + amount
                self.applied = self.applied + 1
            self.committed = self.committed + len(self.pending)
            self.history = self.history + ["commit " + name + " (" + str(len(self.pending)) + ")"]
        else:
            self.history = self.history + ["rollback " + name + " (" + str(len(self.pending)) + ")"]
        self.pending = []
        self.closed = self.closed + 1

book = Ledger()

def deposit(ledger, amounts):
    ledger.begin("deposit")
    ok = False
    try:
        for amount in amounts:
            if amount < 0:
                return "refused: negative amount " + str(amount)
            ledger.stage(amount)
        ok = True
        return "staged " + str(len(amounts)) + " deposits"
    finally:
        ledger.close("deposit", ok)

r1 = deposit(book, [40, 25, 35])
print("  " + r1)
print("  balance: " + str(book.balance))
r2 = deposit(book, [10, -5, 90])
print("  " + r2)
print("  balance: " + str(book.balance))

def withdraw(ledger, amount):
    ledger.begin("withdraw")
    ok = False
    try:
        if amount > ledger.balance:
            raise ValueError("insufficient funds: need " + str(amount) + ", have " + str(ledger.balance))
        ledger.stage(0 - amount)
        ok = True
        return "withdrew " + str(amount)
    finally:
        ledger.close("withdraw", ok)

r3 = withdraw(book, 30)
print("  " + r3)
print("  balance: " + str(book.balance))
try:
    r4 = withdraw(book, 5000)
    print("  " + r4)
except ValueError as e:
    print("  refused: " + str(e))
print("  balance: " + str(book.balance))
feed = [5, 12, 0, 7]
book.begin("sweep")
staged = 0
try:
    for candidate in feed:
        if candidate == 0:
            break
        book.stage(candidate)
        staged = staged + 1
finally:
    book.close("sweep", staged == len(feed))
print("  balance after abandoned sweep: " + str(book.balance))
print("")
print("Transaction history:")
for entry in book.history:
    print("  " + entry)
print("")
print("opened:    " + str(book.opened))
print("closed:    " + str(book.closed))
print("applied:   " + str(book.applied))
print("committed: " + str(book.committed))
print("balance:   " + str(book.balance))
expected = 40 + 25 + 35 - 30
print("")
if book.opened == book.closed and book.applied == book.committed and book.balance == expected:
    verdict = "Every transaction closed, and only committed work reached the balance."
else:
    verdict = "FAILED - a transaction leaked, or uncommitted work was applied."
print(verdict)
print("expected balance: " + str(expected))
n1 = "Three of the five transactions here leave the try body without falling off"
print(n1)
n2 = "the end - one returns, one raises, one breaks. An implementation that runs"
print(n2)
n3 = "finally only on the fourth path balances the first two counters and still"
print(n3)
n4 = "loses money."
print(n4)
```

## stdout (executed)

```text
  staged 3 deposits
  balance: 100
  refused: negative amount -5
  balance: 100
  withdrew 30
  balance: 70
  refused: insufficient funds: need 5000, have 70
  balance: 70
  balance after abandoned sweep: 70

Transaction history:
  begin deposit
  commit deposit (3)
  begin deposit
  rollback deposit (1)
  begin withdraw
  commit withdraw (1)
  begin withdraw
  rollback withdraw (0)
  begin sweep
  rollback sweep (2)

opened:    5
closed:    5
applied:   4
committed: 4
balance:   70

Every transaction closed, and only committed work reached the balance.
expected balance: 70
Three of the five transactions here leave the try body without falling off
the end - one returns, one raises, one breaks. An implementation that runs
finally only on the fourth path balances the first two counters and still
loses money.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:def · eml:output · eml:run:done
