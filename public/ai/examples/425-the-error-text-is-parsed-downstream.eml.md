<!-- canonical: efficientnewlanguage.org/ai/examples/425-the-error-text-is-parsed-downstream | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 425 — The error text is parsed downstream

`the_error_text_is_parsed_downstream.eml` - The error message was reworded to be clearer. Four consumers were matching on the old wording.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The error message
# was reworded to be clearer. Four consumers were matching on the old wording.
#
# Rewording it was right. The old text named an internal table, said nothing
# about what the caller should do, and generated support tickets. The new text
# is shorter, actionable and was reviewed by someone who reads these for a
# living.
#
# The message also carries a machine-readable code, right next to it, which is
# the field consumers were supposed to match on. The text is what appears in
# logs, in screenshots and in the one-line reproduction someone pastes into a
# ticket - so the text is what people had in front of them when they wrote the
# matcher.
#
# Every consumer is run against both messages, so who breaks is computed.

# [consumer, matches on, the substring it uses]
[["alert router", "text", "duplicate key in table orders"], ["retry policy", "code", "E_CONFLICT"], ["support macro", "text", "duplicate key"], ["log dashboard", "text", "duplicate"], ["client sdk", "code", "E_CONFLICT"], ["billing reconciler", "text", "in table orders"], ["status page rule", "code", "E_CONFLICT"]] => consumers

"E_CONFLICT: duplicate key in table orders" => old_message
"E_CONFLICT: this record already exists" => new_message

# String slices in EML are half-open like Python's, while a for-range [a:b] is
# inclusive of b. Both semantics live in this one function, so the end index is
# i + n for the slice and h - n for the loop.
def contains(hay, needle):
    len(needle) => n
    len(hay) => h
    if n > h:
        return 0
    for i in [0:h - n]:
        if hay[i:i + n] == needle:
            return 1
    return 0

def matches(c, message):
    if c[1] == "code":
        return contains(message, c[2])
    return contains(message, c[2])

0 => broke
0 => fine
for c in consumers:
    if matches(c, old_message) == 1:
        if matches(c, new_message) == 0:
            broke + 1 => broke
        else:
            fine + 1 => fine
    else:
        fine + 1 => fine

"old message : " + old_message ^0
"new message : " + new_message ^0
"" ^0
"consumers : " + str(len(consumers)) ^0
"  broken by the rewording : " + str(broke) ^0
"  unaffected              : " + str(fine) ^0
"" ^0

"consumer               matches on   old   new" ^0
for c in consumers:
    "" => a
    if matches(c, old_message) == 1:
        a + "yes" => a
    else:
        a + "no " => a
    "" => b
    if matches(c, new_message) == 1:
        b + "yes" => b
    else:
        b + "no " => b
    "  " + c[0] + "   " + c[1] + "     " + a + "   " + b ^0
"" ^0

# ---- split by which field they chose ----

0 => code_broke
0 => text_broke
for c in consumers:
    if matches(c, old_message) == 1:
        if matches(c, new_message) == 0:
            if c[1] == "code":
                code_broke + 1 => code_broke
            else:
                text_broke + 1 => text_broke
0 => code_users
0 => text_users
for c in consumers:
    if c[1] == "code":
        code_users + 1 => code_users
    else:
        text_users + 1 => text_users

"by the field they matched on" ^0
"  matched the code : " + str(code_users) + ", broken : " + str(code_broke) ^0
"  matched the text : " + str(text_users) + ", broken : " + str(text_broke) ^0
if code_broke == 0:
    "  the stable field was stable, exactly as promised" ^0
"" ^0

# ---- why they matched the text ----

"what each field was available in" ^0
"  the code : in the API response body" ^0
"  the text : in the response, the logs, the screenshots and the ticket" ^0
"  a matcher is written from whatever the author is looking at" ^0
"" ^0

# ---- the control: a rewording that keeps every old substring ----
#
# The rewording is not the defect and the consumers are not careless. A message
# that keeps its old text as a prefix breaks nobody, and costs one sentence.

"E_CONFLICT: duplicate key in table orders - this record already exists" => kind_message
0 => kind_broke
for c in consumers:
    if matches(c, old_message) == 1:
        if matches(c, kind_message) == 0:
            kind_broke + 1 => kind_broke
"control - a rewording that appends instead of replacing" ^0
"  consumers broken : " + str(kind_broke) ^0
if kind_broke == 0:
    "  every old matcher still fires, and the new sentence is still there" ^0
"" ^0

"The reworded message is better and the code field was always the right thing" ^0
"to match. Which field a consumer can see is decided by where they were" ^0
"standing when they wrote the matcher." ^0
```

## Python (deterministic transpilation)

```python
consumers = [["alert router", "text", "duplicate key in table orders"], ["retry policy", "code", "E_CONFLICT"], ["support macro", "text", "duplicate key"], ["log dashboard", "text", "duplicate"], ["client sdk", "code", "E_CONFLICT"], ["billing reconciler", "text", "in table orders"], ["status page rule", "code", "E_CONFLICT"]]
old_message = "E_CONFLICT: duplicate key in table orders"
new_message = "E_CONFLICT: this record already exists"

def contains(hay, needle):
    n = len(needle)
    h = len(hay)
    if n > h:
        return 0
    for i in range(0, h - n+1):
        if hay[i:i + n] == needle:
            return 1
    return 0

def matches(c, message):
    if c[1] == "code":
        return contains(message, c[2])
    return contains(message, c[2])

broke = 0
fine = 0
for c in consumers:
    if matches(c, old_message) == 1:
        if matches(c, new_message) == 0:
            broke = broke + 1
        else:
            fine = fine + 1
    else:
        fine = fine + 1
print("old message : " + old_message)
print("new message : " + new_message)
print("")
print("consumers : " + str(len(consumers)))
print("  broken by the rewording : " + str(broke))
print("  unaffected              : " + str(fine))
print("")
print("consumer               matches on   old   new")
for c in consumers:
    a = ""
    if matches(c, old_message) == 1:
        a = a + "yes"
    else:
        a = a + "no "
    b = ""
    if matches(c, new_message) == 1:
        b = b + "yes"
    else:
        b = b + "no "
    print("  " + c[0] + "   " + c[1] + "     " + a + "   " + b)
print("")
code_broke = 0
text_broke = 0
for c in consumers:
    if matches(c, old_message) == 1:
        if matches(c, new_message) == 0:
            if c[1] == "code":
                code_broke = code_broke + 1
            else:
                text_broke = text_broke + 1
code_users = 0
text_users = 0
for c in consumers:
    if c[1] == "code":
        code_users = code_users + 1
    else:
        text_users = text_users + 1
print("by the field they matched on")
print("  matched the code : " + str(code_users) + ", broken : " + str(code_broke))
print("  matched the text : " + str(text_users) + ", broken : " + str(text_broke))
if code_broke == 0:
    print("  the stable field was stable, exactly as promised")
print("")
print("what each field was available in")
print("  the code : in the API response body")
print("  the text : in the response, the logs, the screenshots and the ticket")
print("  a matcher is written from whatever the author is looking at")
print("")
kind_message = "E_CONFLICT: duplicate key in table orders - this record already exists"
kind_broke = 0
for c in consumers:
    if matches(c, old_message) == 1:
        if matches(c, kind_message) == 0:
            kind_broke = kind_broke + 1
print("control - a rewording that appends instead of replacing")
print("  consumers broken : " + str(kind_broke))
if kind_broke == 0:
    print("  every old matcher still fires, and the new sentence is still there")
print("")
print("The reworded message is better and the code field was always the right thing")
print("to match. Which field a consumer can see is decided by where they were")
print("standing when they wrote the matcher.")
```

## stdout (executed)

```text
old message : E_CONFLICT: duplicate key in table orders
new message : E_CONFLICT: this record already exists

consumers : 7
  broken by the rewording : 4
  unaffected              : 3

consumer               matches on   old   new
  alert router   text     yes   no 
  retry policy   code     yes   yes
  support macro   text     yes   no 
  log dashboard   text     yes   no 
  client sdk   code     yes   yes
  billing reconciler   text     yes   no 
  status page rule   code     yes   yes

by the field they matched on
  matched the code : 3, broken : 0
  matched the text : 4, broken : 4
  the stable field was stable, exactly as promised

what each field was available in
  the code : in the API response body
  the text : in the response, the logs, the screenshots and the ticket
  a matcher is written from whatever the author is looking at

control - a rewording that appends instead of replacing
  consumers broken : 0
  every old matcher still fires, and the new sentence is still there

The reworded message is better and the code field was always the right thing
to match. Which field a consumer can see is decided by where they were
standing when they wrote the matcher.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
