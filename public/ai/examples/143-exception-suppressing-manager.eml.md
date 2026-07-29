<!-- canonical: efficientnewlanguage.org/ai/examples/143-exception-suppressing-manager | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 143 — `__exit__`'s return value decides everything

`exception_suppressing_manager.eml` isolates the part of the context-manager protocol that surprises people.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The part of the
# context-manager protocol that surprises people: __exit__'s RETURN VALUE
# decides whether the exception keeps travelling.
#
#   return False (or nothing)  ->  the exception propagates, as usual
#   return True                ->  the exception is SWALLOWED, and execution
#                                  resumes after the with-block
#
# That is a lot of power hidden in a boolean. A manager returning True
# unconditionally silently eats every failure inside its block: the code after
# the block runs as though nothing went wrong, and no handler anywhere sees the
# error. It is the context-manager form of a bare `except: pass`.
#
# The managers below differ ONLY in what __exit__ returns, and the program
# prints what actually happened each time, so the difference is visible rather
# than asserted. The third is the useful shape - suppression on a budget, which
# is how a retry or circuit-breaker wrapper behaves: absorb a few failures,
# then stop lying and let one through.
#
# The third manager selects on the EXCEPTION TYPE, which is worth pointing out
# because it did not used to be possible. EML-P had no first-class exception
# objects: `__exit__`'s first parameter arrived as a plain string, so
# `exc_type == ValueError` could not be written at all, and printing exc_type
# produced `ValueError` where CPython prints `<class 'ValueError'>`. Exception
# classes and instances are real values now, so both work and both match.
#
# One gap remains and is deliberate: the third parameter (the traceback) is
# None here and a traceback object in CPython. A real traceback's only
# printable form embeds a memory address that differs between runs of CPython
# itself, so there is no reproducible value to supply - inventing one would be
# a fabrication, not a fix.

class SwallowAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return True

class PropagateAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return False

class SwallowOnlyValueError:
    def __init__(self):
        0 => self.absorbed
        0 => self.forwarded
        0 => self.clean
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        if exc_type == None:
            self.clean + 1 => self.clean
            return False
        if exc_type == ValueError:
            self.absorbed + 1 => self.absorbed
            ("    absorbing a " + str(exc_type) + ": " + str(exc_value))^0
            return True
        self.forwarded + 1 => self.forwarded
        ("    forwarding a " + str(exc_type) + ": " + str(exc_value))^0
        return False

0 => reached_after
"A. __exit__ returns True" => h1
h1^0
with SwallowAll() as s:
    "  raising inside the block" => a1
    a1^0
    raise ValueError("this never escapes")
1 => reached_after
"  execution continued - nothing was raised out of the block" => a2
a2^0
""^0

"B. __exit__ returns False" => h2
h2^0
try:
    with PropagateAll() as p:
        "  raising inside the block" => b1
        b1^0
        raise ValueError("this does escape")
    "  UNREACHABLE" => bad
    bad^0
except ValueError:
    "  caught outside, as expected" => b2
    b2^0
""^0

"C. selective: absorb ValueError, forward everything else" => h3
h3^0
SwallowOnlyValueError() => guard

with guard as g:
    "  raising a ValueError inside the block" => c1
    c1^0
    raise ValueError("expected, handled here")
"  ...and execution continued past the block" => c2
c2^0

try:
    with guard as g:
        "  raising a TypeError inside the block" => c3
        c3^0
        raise TypeError("unexpected, not ours to swallow")
except TypeError as e:
    ("  reached the outer handler: " + repr(e))^0

with guard as g:
    "  a clean block - __exit__ sees exc_type None" => c4
    c4^0

""^0
("Selective guard: absorbed " + str(guard.absorbed) + ", forwarded " + str(guard.forwarded) + ", clean " + str(guard.clean) + ".")^0
("Code after the swallowing block in A ran: " + str(reached_after == 1))^0
"The selective manager reads exc_type as a CLASS and compares it to" => n1
n1^0
"ValueError directly. The only difference between A and B is one boolean," => n2
n2^0
"and it decides whether a failure is invisible or fatal." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class SwallowAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return True

class PropagateAll:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        return False

class SwallowOnlyValueError:
    def __init__(self):
        self.absorbed = 0
        self.forwarded = 0
        self.clean = 0
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, tb):
        if exc_type == None:
            self.clean = self.clean + 1
            return False
        if exc_type == ValueError:
            self.absorbed = self.absorbed + 1
            print("    absorbing a " + str(exc_type) + ": " + str(exc_value))
            return True
        self.forwarded = self.forwarded + 1
        print("    forwarding a " + str(exc_type) + ": " + str(exc_value))
        return False

reached_after = 0
h1 = "A. __exit__ returns True"
print(h1)
with SwallowAll() as s:
    a1 = "  raising inside the block"
    print(a1)
    raise ValueError("this never escapes")
reached_after = 1
a2 = "  execution continued - nothing was raised out of the block"
print(a2)
print("")
h2 = "B. __exit__ returns False"
print(h2)
try:
    with PropagateAll() as p:
        b1 = "  raising inside the block"
        print(b1)
        raise ValueError("this does escape")
    bad = "  UNREACHABLE"
    print(bad)
except ValueError:
    b2 = "  caught outside, as expected"
    print(b2)
print("")
h3 = "C. selective: absorb ValueError, forward everything else"
print(h3)
guard = SwallowOnlyValueError()
with guard as g:
    c1 = "  raising a ValueError inside the block"
    print(c1)
    raise ValueError("expected, handled here")
c2 = "  ...and execution continued past the block"
print(c2)
try:
    with guard as g:
        c3 = "  raising a TypeError inside the block"
        print(c3)
        raise TypeError("unexpected, not ours to swallow")
except TypeError as e:
    print("  reached the outer handler: " + repr(e))
with guard as g:
    c4 = "  a clean block - __exit__ sees exc_type None"
    print(c4)
print("")
print("Selective guard: absorbed " + str(guard.absorbed) + ", forwarded " + str(guard.forwarded) + ", clean " + str(guard.clean) + ".")
print("Code after the swallowing block in A ran: " + str(reached_after == 1))
n1 = "The selective manager reads exc_type as a CLASS and compares it to"
print(n1)
n2 = "ValueError directly. The only difference between A and B is one boolean,"
print(n2)
n3 = "and it decides whether a failure is invisible or fatal."
print(n3)
```

## stdout (executed)

```text
A. __exit__ returns True
  raising inside the block
  execution continued - nothing was raised out of the block

B. __exit__ returns False
  raising inside the block
  caught outside, as expected

C. selective: absorb ValueError, forward everything else
  raising a ValueError inside the block
    absorbing a <class 'ValueError'>: expected, handled here
  ...and execution continued past the block
  raising a TypeError inside the block
    forwarding a <class 'TypeError'>: unexpected, not ours to swallow
  reached the outer handler: TypeError('unexpected, not ours to swallow')
  a clean block - __exit__ sees exc_type None

Selective guard: absorbed 1, forwarded 1, clean 1.
Code after the swallowing block in A ran: True
The selective manager reads exc_type as a CLASS and compares it to
ValueError directly. The only difference between A and B is one boolean,
and it decides whether a failure is invisible or fatal.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:assign · eml:output · eml:call · eml:return · eml:run:done
