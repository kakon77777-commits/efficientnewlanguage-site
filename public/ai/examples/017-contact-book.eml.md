<!-- canonical: efficientnewlanguage.org/ai/examples/017-contact-book | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 017 — Contact book

`contact_book.eml` is a small class-based `ContactBook` — add a contact, look one up, remove one — backed by a `self.contacts` dict mapping name to phone number.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class-based
# contact book exercising a dict literal + subscript get/set through a
# `self` attribute (`self.contacts`, name -> phone number), a parallel list
# of names grown via `existing + [item] => existing` (the same dict +
# key-list idiom as word-frequency-counter/library-catalog/inventory-
# tracker), and `try`/`except KeyError` for looking up a contact that was
# never added. `remove_contact` truly drops the key (not just a boolean
# flag) by rebuilding the dict from the filtered name list, since the
# interpreter models no `del`/`.pop()`.

class ContactBook:
    def __init__(self):
        {} => self.contacts
        [] => self.names

    def add_contact(self, name, phone):
        phone => self.contacts[name]
        self.names + [name] => self.names

    def lookup(self, name):
        try:
            return self.contacts[name]
        except KeyError:
            return "no contact named " + name

    def remove_contact(self, name):
        [n for n in self.names if n != name] => remaining
        {} => rebuilt
        for n in remaining:
            self.contacts[n] => rebuilt[n]
        rebuilt => self.contacts
        remaining => self.names

ContactBook() => book
book.add_contact("Alice Chen", "555-0142")
book.add_contact("Bob Diaz", "555-0198")
book.add_contact("Carla Nunez", "555-0173")

book.lookup("Alice Chen") => alice_number
"Alice Chen: " + alice_number => line1
line1^0

book.lookup("Dana Kim") => missing_result
"Dana Kim: " + missing_result => line2
line2^0

book.remove_contact("Bob Diaz")
book.lookup("Bob Diaz") => bob_status
"Bob Diaz: " + bob_status => line3
line3^0
```

## Python (deterministic transpilation)

```python
class ContactBook:
    def __init__(self):
        self.contacts = {}
        self.names = []
    def add_contact(self, name, phone):
        self.contacts[name] = phone
        self.names = self.names + [name]
    def lookup(self, name):
        try:
            return self.contacts[name]
        except KeyError:
            return "no contact named " + name
    def remove_contact(self, name):
        remaining = [n for n in self.names if n != name]
        rebuilt = {}
        for n in remaining:
            rebuilt[n] = self.contacts[n]
        self.contacts = rebuilt
        self.names = remaining

book = ContactBook()
book.add_contact("Alice Chen", "555-0142")
book.add_contact("Bob Diaz", "555-0198")
book.add_contact("Carla Nunez", "555-0173")
alice_number = book.lookup("Alice Chen")
line1 = "Alice Chen: " + alice_number
print(line1)
missing_result = book.lookup("Dana Kim")
line2 = "Dana Kim: " + missing_result
print(line2)
book.remove_contact("Bob Diaz")
bob_status = book.lookup("Bob Diaz")
line3 = "Bob Diaz: " + bob_status
print(line3)
```

## stdout (executed)

```text
Alice Chen: 555-0142
Dana Kim: no contact named Dana Kim
Bob Diaz: no contact named Bob Diaz
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
