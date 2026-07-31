<!-- canonical: efficientnewlanguage.org/ai/examples/180-permission-set-algebra | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 180 — For sets, `<` means subset

`permission_set_algebra.eml` — models roles and permissions with set algebra.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Permissions are
# the textbook use of set algebra, and they show the operator that surprises
# people: for sets, `<` does not mean "less than". It means PROPER SUBSET.
#
#   a <= b   every element of a is in b
#   a <  b   ... and b has something a does not
#
# The consequence is that set comparison is a PARTIAL order. For two roles that
# each hold a permission the other lacks, ALL FOUR of <, <=, >, >= are False and
# neither role is "bigger". Code that sorts roles by `<` therefore produces
# nonsense - not an error, just an arbitrary order - which is exactly the kind
# of quiet wrongness worth a program rather than a footnote.
#
# `-` (difference) and all four comparisons raised TypeError here until this
# round; the whole family was missing.

def missing_for(required, held):
    return required - held

def can_do(required, held):
    return required <= held

{"read"} => viewer
{"read", "write"} => editor
{"read", "write", "delete"} => admin
{"read", "publish"} => publisher

"Is one role contained in another?" => h
h^0
("  viewer   <= editor    " + str(viewer <= editor))^0
("  editor   <= admin     " + str(editor <= admin))^0
("  editor   <  editor    " + str(editor < editor) + "   <- equal is not PROPER")^0
("  editor   <= editor    " + str(editor <= editor))^0
""^0

"Two roles that are not comparable at all" => h2
h2^0
("  editor    vs publisher")^0
("    editor <  publisher  " + str(editor < publisher))^0
("    editor >  publisher  " + str(editor > publisher))^0
("    editor <= publisher  " + str(editor <= publisher))^0
("    editor >= publisher  " + str(editor >= publisher))^0
("  All four False. Neither is bigger - this is a PARTIAL order,")^0
("  so sorting roles by `<` would produce an arbitrary sequence.")^0
""^0

"What is missing to perform an action?" => h3
h3^0
{"read", "write", "delete"} => needed_for_purge
[["viewer", viewer], ["editor", editor], ["admin", admin]] => roles
for entry in roles:
    entry[0] => name
    entry[1] => held
    missing_for(needed_for_purge, held) => gap
    if can_do(needed_for_purge, held):
        ("  " + name + ": allowed")^0
    else:
        ("  " + name + ": blocked, missing " + str(len(gap)) + " permission(s)")^0

""^0
("admin minus editor = " + str(admin - editor) + "   (what admin adds)")^0
("editor minus admin = " + str(editor - admin) + "        (nothing - editor is a subset)")^0
```

## Python (deterministic transpilation)

```python
def missing_for(required, held):
    return required - held

def can_do(required, held):
    return required <= held

viewer = {"read"}
editor = {"read", "write"}
admin = {"read", "write", "delete"}
publisher = {"read", "publish"}
h = "Is one role contained in another?"
print(h)
print("  viewer   <= editor    " + str(viewer <= editor))
print("  editor   <= admin     " + str(editor <= admin))
print("  editor   <  editor    " + str(editor < editor) + "   <- equal is not PROPER")
print("  editor   <= editor    " + str(editor <= editor))
print("")
h2 = "Two roles that are not comparable at all"
print(h2)
print("  editor    vs publisher")
print("    editor <  publisher  " + str(editor < publisher))
print("    editor >  publisher  " + str(editor > publisher))
print("    editor <= publisher  " + str(editor <= publisher))
print("    editor >= publisher  " + str(editor >= publisher))
print("  All four False. Neither is bigger - this is a PARTIAL order,")
print("  so sorting roles by `<` would produce an arbitrary sequence.")
print("")
h3 = "What is missing to perform an action?"
print(h3)
needed_for_purge = {"read", "write", "delete"}
roles = [["viewer", viewer], ["editor", editor], ["admin", admin]]
for entry in roles:
    name = entry[0]
    held = entry[1]
    gap = missing_for(needed_for_purge, held)
    if can_do(needed_for_purge, held):
        print("  " + name + ": allowed")
    else:
        print("  " + name + ": blocked, missing " + str(len(gap)) + " permission(s)")
print("")
print("admin minus editor = " + str(admin - editor) + "   (what admin adds)")
print("editor minus admin = " + str(editor - admin) + "        (nothing - editor is a subset)")
```

## stdout (executed)

```text
Is one role contained in another?
  viewer   <= editor    True
  editor   <= admin     True
  editor   <  editor    False   <- equal is not PROPER
  editor   <= editor    True

Two roles that are not comparable at all
  editor    vs publisher
    editor <  publisher  False
    editor >  publisher  False
    editor <= publisher  False
    editor >= publisher  False
  All four False. Neither is bigger - this is a PARTIAL order,
  so sorting roles by `<` would produce an arbitrary sequence.

What is missing to perform an action?
  viewer: blocked, missing 2 permission(s)
  editor: blocked, missing 1 permission(s)
  admin: allowed

admin minus editor = {'delete'}   (what admin adds)
editor minus admin = set()        (nothing - editor is a subset)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
