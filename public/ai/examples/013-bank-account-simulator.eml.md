<!-- canonical: efficientnewlanguage.org/ai/examples/013-bank-account-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 013 — Case corpus: a self-authored bank account simulator

`bank_account_simulator.eml` is a class-based case in a self-authored batch of six OOP utilities (alongside `examples/simple-stack/`, `examples/simple-queue/`, `examples/inventory-tracker/`, `examples/library-catalog/`, and `examples/parking-lot-tracker/`) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class-based
# bank account simulator exercising `self` attribute state (a numeric
# balance), and `try`/`except`/`raise ValueError` for an insufficient-funds
# withdrawal (mirroring the `raise ValueError(...)` idiom used for an
# invalid move in mvp-tic-tac-toe's `tic_tac_toe.eml`).

class BankAccount:
    def __init__(self, owner, balance):
        owner => self.owner
        balance => self.balance

    def deposit(self, amount):
        self.balance + amount => self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance - amount => self.balance

    def get_balance(self):
        return self.balance

BankAccount("Alice Chen", 500) => account
"Opening balance for " + account.owner + ": " + str(account.get_balance()) => line1
line1^0

account.deposit(150)
"After depositing 150: " + str(account.get_balance()) => line2
line2^0

account.withdraw(200)
"After withdrawing 200: " + str(account.get_balance()) => line3
line3^0

try:
    account.withdraw(1000)
except ValueError:
    "Withdrawal of 1000 failed: insufficient funds" => msg
    msg^0

"Final balance: " + str(account.get_balance()) => line4
line4^0
```

## Python (deterministic transpilation)

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
    def deposit(self, amount):
        self.balance = self.balance + amount
    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance = self.balance - amount
    def get_balance(self):
        return self.balance

account = BankAccount("Alice Chen", 500)
line1 = "Opening balance for " + account.owner + ": " + str(account.get_balance())
print(line1)
account.deposit(150)
line2 = "After depositing 150: " + str(account.get_balance())
print(line2)
account.withdraw(200)
line3 = "After withdrawing 200: " + str(account.get_balance())
print(line3)
try:
    account.withdraw(1000)
except ValueError:
    msg = "Withdrawal of 1000 failed: insufficient funds"
    print(msg)
line4 = "Final balance: " + str(account.get_balance())
print(line4)
```

## stdout (executed)

```text
Opening balance for Alice Chen: 500
After depositing 150: 650
After withdrawing 200: 450
Withdrawal of 1000 failed: insufficient funds
Final balance: 450
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
