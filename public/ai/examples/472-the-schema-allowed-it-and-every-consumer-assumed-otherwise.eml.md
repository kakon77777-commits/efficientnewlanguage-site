<!-- canonical: efficientnewlanguage.org/ai/examples/472-the-schema-allowed-it-and-every-consumer-assumed-otherwise | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 472 — The schema allowed it and every consumer assumed otherwise

`the_schema_allowed_it_and_every_consumer_assumed_otherwise.eml` - The field is an array. How many consumers read anything but the first element is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The field is an
# array. How many consumers read anything but the first element is computed
# below.
#
# Declaring it as an array was the right call and the reviewers who asked for
# it were right too. The domain genuinely allows several, a scalar would have
# to be widened later at a breaking cost, and the schema is an accurate
# statement of what the producer may send.
#
# Every consumer was written against traffic in which the array had one
# element, because that is what the producer emitted for two years. Their code
# is correct for every message they have seen, and the schema is correct about
# messages nobody has sent yet.
#
# Both the schema's domain and the consumers' assumptions are counted.

# [consumer, elements it reads, behaviour when there are more]
[["billing", 1, "silently uses the first"], ["search index", 1, "silently uses the first"], ["audit log", 0, "stores the whole array"], ["notifier", 1, "silently uses the first"], ["export", 0, "stores the whole array"], ["fraud check", 1, "silently uses the first"], ["dashboard", 1, "silently uses the first"]] => consumers

len(consumers) => n

0 => first_only
0 => handles_many
for c in consumers:
    if c[1] == 1:
        first_only + 1 => first_only
    else:
        handles_many + 1 => handles_many

"consumers : " + str(n) ^0
"  read only the first element : " + str(first_only) ^0
"  handle the whole array      : " + str(handles_many) ^0
"" ^0

"consumer        reads        on a longer array" ^0
for c in consumers:
    "" => r
    if c[1] == 1:
        r + "first only  " => r
    else:
        r + "all elements" => r
    "  " + c[0] + "   " + r + " " + c[2] ^0
"" ^0

# ---- what the traffic has contained ----

# array lengths seen over two years, as counts
[["length 0", 0], ["length 1", 480000], ["length 2", 0], ["length 3 or more", 0]] => seen

0 => total_msgs
0 => nonstandard
for s in seen:
    total_msgs + s[1] => total_msgs
    if not (s[0] == "length 1"):
        nonstandard + s[1] => nonstandard
"messages observed : " + str(total_msgs) ^0
"  with exactly one element : " + str(total_msgs - nonstandard) ^0
"  with any other length    : " + str(nonstandard) ^0
if nonstandard == 0:
    "  the producer has never once sent a length the consumers cannot handle" ^0
"" ^0

# ---- what the schema permits ----

"what the schema allows" ^0
"  minimum length : 0" ^0
"  maximum length : unbounded" ^0
"  lengths the consumers are correct for : exactly 1" ^0
if first_only > 0:
    "  so " + str(first_only) + " consumers are correct on one length out of the permitted set," ^0
    "  and that length is the only one that has ever arrived" ^0
"" ^0

# ---- the day the producer sends two ----

"if the producer starts sending two elements tomorrow" ^0
"  consumers that error       : 0" ^0
"  consumers that change answer silently : " + str(first_only) ^0
"  consumers that are unaffected         : " + str(handles_many) ^0
if first_only > handles_many:
    "  the failure is " + str(first_only) + " wrong answers and no alert, because reading" ^0
    "  the first element of a two-element array is a legal operation" ^0
"" ^0

# ---- and the day it sends none ----

"if the producer sends an empty array" ^0
"  consumers that error : " + str(first_only) + ", on an index that is not there" ^0
"  that failure is loud, and it is the one the schema's minimum of 0 predicts" ^0
if first_only > 0:
    "  the empty case fails safely and the many case fails silently, which is" ^0
    "  the opposite of how the two are usually ranked in a review" ^0
"" ^0

# ---- what would have made the assumption visible ----

"where the assumption is written down" ^0
"  in the schema     : no, it permits any length" ^0
"  in the consumers  : no, indexing the first element is not a statement" ^0
"  in the fixtures   : yes, every one has exactly one element" ^0
"  the fixtures are the only artefact that records what anybody assumed," ^0
"  and they record it by example rather than by saying it" ^0
"" ^0

# ---- the control: a field the schema pins to one ----
#
# Where the schema says exactly one, the consumers' assumption and the
# declaration are the same statement and there is nothing to diverge.

"control - the same field declared as a single value" ^0
"  lengths permitted : 1" ^0
"  consumers correct for : 1" ^0
"  the two sets are equal, so no traffic can arrive that the consumers are" ^0
"  wrong about, and widening it later is a visible breaking change instead" ^0
"  of a silent one" ^0
"" ^0

"The array declaration is the accurate description of the domain and the" ^0
"consumers are correct for every message ever sent. The set the schema" ^0
"permits and the set the traffic contains have been the same size for two" ^0
"years, and only one of them is a promise." ^0
```

## Python (deterministic transpilation)

```python
consumers = [["billing", 1, "silently uses the first"], ["search index", 1, "silently uses the first"], ["audit log", 0, "stores the whole array"], ["notifier", 1, "silently uses the first"], ["export", 0, "stores the whole array"], ["fraud check", 1, "silently uses the first"], ["dashboard", 1, "silently uses the first"]]
n = len(consumers)
first_only = 0
handles_many = 0
for c in consumers:
    if c[1] == 1:
        first_only = first_only + 1
    else:
        handles_many = handles_many + 1
print("consumers : " + str(n))
print("  read only the first element : " + str(first_only))
print("  handle the whole array      : " + str(handles_many))
print("")
print("consumer        reads        on a longer array")
for c in consumers:
    r = ""
    if c[1] == 1:
        r = r + "first only  "
    else:
        r = r + "all elements"
    print("  " + c[0] + "   " + r + " " + c[2])
print("")
seen = [["length 0", 0], ["length 1", 480000], ["length 2", 0], ["length 3 or more", 0]]
total_msgs = 0
nonstandard = 0
for s in seen:
    total_msgs = total_msgs + s[1]
    if not s[0] == "length 1":
        nonstandard = nonstandard + s[1]
print("messages observed : " + str(total_msgs))
print("  with exactly one element : " + str(total_msgs - nonstandard))
print("  with any other length    : " + str(nonstandard))
if nonstandard == 0:
    print("  the producer has never once sent a length the consumers cannot handle")
print("")
print("what the schema allows")
print("  minimum length : 0")
print("  maximum length : unbounded")
print("  lengths the consumers are correct for : exactly 1")
if first_only > 0:
    print("  so " + str(first_only) + " consumers are correct on one length out of the permitted set,")
    print("  and that length is the only one that has ever arrived")
print("")
print("if the producer starts sending two elements tomorrow")
print("  consumers that error       : 0")
print("  consumers that change answer silently : " + str(first_only))
print("  consumers that are unaffected         : " + str(handles_many))
if first_only > handles_many:
    print("  the failure is " + str(first_only) + " wrong answers and no alert, because reading")
    print("  the first element of a two-element array is a legal operation")
print("")
print("if the producer sends an empty array")
print("  consumers that error : " + str(first_only) + ", on an index that is not there")
print("  that failure is loud, and it is the one the schema's minimum of 0 predicts")
if first_only > 0:
    print("  the empty case fails safely and the many case fails silently, which is")
    print("  the opposite of how the two are usually ranked in a review")
print("")
print("where the assumption is written down")
print("  in the schema     : no, it permits any length")
print("  in the consumers  : no, indexing the first element is not a statement")
print("  in the fixtures   : yes, every one has exactly one element")
print("  the fixtures are the only artefact that records what anybody assumed,")
print("  and they record it by example rather than by saying it")
print("")
print("control - the same field declared as a single value")
print("  lengths permitted : 1")
print("  consumers correct for : 1")
print("  the two sets are equal, so no traffic can arrive that the consumers are")
print("  wrong about, and widening it later is a visible breaking change instead")
print("  of a silent one")
print("")
print("The array declaration is the accurate description of the domain and the")
print("consumers are correct for every message ever sent. The set the schema")
print("permits and the set the traffic contains have been the same size for two")
print("years, and only one of them is a promise.")
```

## stdout (executed)

```text
consumers : 7
  read only the first element : 5
  handle the whole array      : 2

consumer        reads        on a longer array
  billing   first only   silently uses the first
  search index   first only   silently uses the first
  audit log   all elements stores the whole array
  notifier   first only   silently uses the first
  export   all elements stores the whole array
  fraud check   first only   silently uses the first
  dashboard   first only   silently uses the first

messages observed : 480000
  with exactly one element : 480000
  with any other length    : 0
  the producer has never once sent a length the consumers cannot handle

what the schema allows
  minimum length : 0
  maximum length : unbounded
  lengths the consumers are correct for : exactly 1
  so 5 consumers are correct on one length out of the permitted set,
  and that length is the only one that has ever arrived

if the producer starts sending two elements tomorrow
  consumers that error       : 0
  consumers that change answer silently : 5
  consumers that are unaffected         : 2
  the failure is 5 wrong answers and no alert, because reading
  the first element of a two-element array is a legal operation

if the producer sends an empty array
  consumers that error : 5, on an index that is not there
  that failure is loud, and it is the one the schema's minimum of 0 predicts
  the empty case fails safely and the many case fails silently, which is
  the opposite of how the two are usually ranked in a review

where the assumption is written down
  in the schema     : no, it permits any length
  in the consumers  : no, indexing the first element is not a statement
  in the fixtures   : yes, every one has exactly one element
  the fixtures are the only artefact that records what anybody assumed,
  and they record it by example rather than by saying it

control - the same field declared as a single value
  lengths permitted : 1
  consumers correct for : 1
  the two sets are equal, so no traffic can arrive that the consumers are
  wrong about, and widening it later is a visible breaking change instead
  of a silent one

The array declaration is the accurate description of the domain and the
consumers are correct for every message ever sent. The set the schema
permits and the set the traffic contains have been the same size for two
years, and only one of them is a promise.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
