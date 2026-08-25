<!-- canonical: efficientnewlanguage.org/ai/examples/544-the-escape-was-correct-at-every-layer | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 544 — The escape was correct at every layer

`the_escape_was_correct_at_every_layer.eml` - Customer names are escaped when they arrive and escaped again when they are rendered. What each output route shows is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Customer names
# are escaped when they arrive and escaped again when they are rendered. What
# each output route shows is computed below.
#
# Both escapes are right, individually and by the same rule. The template
# engine escapes on output, which is the thing that stops a name from becoming
# markup, and turning it off is how sites get attacked. The ingress escape was
# added after an incident in which a value reached a consumer that did no
# escaping of its own, and defence in depth is the standard response to that.
# Two people applied the same correct rule at the two places the rule names.
#
# Escaping is not idempotent. Applying it twice is not the same as applying it
# once, because the escape sequence it produces is itself made of characters
# that the escape wants to encode. Validation composes: check twice and you
# have checked. Normalisation composes. Escaping does not, and the rule "escape
# at the boundary" is only safe when a boundary can be named and counted.
#
# There is no place in the code where anyone can see two of them at once. The
# ingress layer and the template are different files owned by different teams,
# and each is correct when read on its own.

def escape(text):
    "" => out
    for i in [0:len(text) - 1]:
        text[i:i + 1] => c
        c => piece
        if c == "&":
            "&amp;" => piece
        if c == "<":
            "&lt;" => piece
        if c == ">":
            "&gt;" => piece
        if c == "'":
            "&#39;" => piece
        out + piece => out
    return out

def escape_n(text, n):
    text => out
    for i in [1:n]:
        escape(out) => out
    return out

"Ben & Jerry's" => raw

"the stored value" ^0
("  as typed by the customer : %s" % raw)^0
("  length                   : %s" % str(len(raw)))^0
("  after the ingress escape : %s" % escape(raw))^0
("  length                   : %s" % str(len(escape(raw))))^0
"" ^0

# ---- what each additional layer does ----

"escaping applied n times to the same value" ^0
for n in [0, 1, 2, 3]:
    escape_n(raw, n) => v
    ("  n=%-3s length %-5s %s" % (str(n), str(len(v)), v))^0
"" ^0

len(escape_n(raw, 2)) - len(escape_n(raw, 1)) => growth
("  each extra layer adds %s characters, so the layer count is recoverable" % str(growth))^0
("  from the length alone, which is how this was eventually found" )^0
"" ^0

# ---- the routes ----

# [route, escapes applied after storage, escapes this route actually needs]
[["web page", 1, 1], ["json api", 0, 0], ["csv export", 0, 0], ["transactional email", 2, 1], ["pdf invoice", 0, 0]] => routes

"route                  total escapes   needs   renders as" ^0
0 => wrong
for r in routes:
    1 + r[1] => applied
    if applied != r[2]:
        wrong + 1 => wrong
    ("  %-22s %-15s %-7s %s" % (r[0], str(applied), str(r[2]), escape_n(raw, applied)))^0
"" ^0
("  routes rendering the customer's name correctly : %s of %s" % (str(len(routes) - wrong), str(len(routes))))^0
"  every route applies exactly the number of escapes its own code says," ^0
"  and the stored value already carries one that none of them can see" ^0
"" ^0

# ---- the control ----
#
# A value written by an internal job, which does not pass through the ingress
# layer. Same template, same escape function, same routes.

"Ben & Jerry's" => internal_raw
"control - the same value written by a job that skips the ingress layer" ^0
for r in [routes[0], routes[1]]:
    ("  %-22s renders %s" % (r[0], escape_n(internal_raw, r[1])))^0
"  correct on the html route and correct on the json route" ^0
"  so the escape function is right and the templates are right" ^0
"" ^0

# ---- the control that hid it ----
#
# Escaping is idempotent on any value containing none of the characters it
# encodes, which is most names.

["Ben & Jerry's", "Alice Chen", "Marks & Spencer", "Jose Ramirez", "O'Brien", "Yuki Tanaka", "Procter & Gamble", "Sam Nowak", "Ada Lovelace", "Dun & Bradstreet"] => customers

0 => affected
for c in customers:
    if escape(c) != c:
        affected + 1 => affected
("control - customers whose rendering changes at all" )^0
("  customers            : %s" % str(len(customers)))^0
("  containing an escapable character : %s" % str(affected))^0
("  unaffected                        : %s" % str(len(customers) - affected))^0
"  for those, one escape and three escapes give the same string, so a" ^0
"  test written with any of them passes under every layer count" ^0
"" ^0

"which names a test would be written with" ^0
for c in [customers[1], customers[0]]:
    ("  %-20s n=1 %-24s n=3 %s" % (c, escape_n(c, 1), escape_n(c, 3)))^0
"" ^0

# ---- what composes and what does not ----

"operations at a boundary, and whether two of them are worse than one" ^0
"  validate  : idempotent, two checks are one check" ^0
"  normalise : idempotent by definition, that is what it means" ^0
"  escape    : not idempotent, its output is made of the characters it" ^0
"              encodes, so it has nothing to be idempotent about" ^0
"  the rule that was followed does not distinguish these three" ^0
"" ^0

"Escaping on output stops a name becoming markup and escaping on ingress was" ^0
"added after a real incident. Escaping is not idempotent, so the two correct" ^0
("rules give %s of %s routes a wrong rendering, and %s of %s customers have a name" % (str(wrong), str(len(routes)), str(len(customers) - affected), str(len(customers))))^0
"that looks identical however many times it is escaped." ^0
```

## Python (deterministic transpilation)

```python
def escape(text):
    out = ""
    for i in range(0, len(text)):
        c = text[i:i + 1]
        piece = c
        if c == "&":
            piece = "&amp;"
        if c == "<":
            piece = "&lt;"
        if c == ">":
            piece = "&gt;"
        if c == "'":
            piece = "&#39;"
        out = out + piece
    return out

def escape_n(text, n):
    out = text
    for i in range(1, n+1):
        out = escape(out)
    return out

raw = "Ben & Jerry's"
print("the stored value")
print("  as typed by the customer : %s" % raw)
print("  length                   : %s" % str(len(raw)))
print("  after the ingress escape : %s" % escape(raw))
print("  length                   : %s" % str(len(escape(raw))))
print("")
print("escaping applied n times to the same value")
for n in [0, 1, 2, 3]:
    v = escape_n(raw, n)
    print("  n=%-3s length %-5s %s" % (str(n), str(len(v)), v))
print("")
growth = len(escape_n(raw, 2)) - len(escape_n(raw, 1))
print("  each extra layer adds %s characters, so the layer count is recoverable" % str(growth))
print("  from the length alone, which is how this was eventually found")
print("")
routes = [["web page", 1, 1], ["json api", 0, 0], ["csv export", 0, 0], ["transactional email", 2, 1], ["pdf invoice", 0, 0]]
print("route                  total escapes   needs   renders as")
wrong = 0
for r in routes:
    applied = 1 + r[1]
    if applied != r[2]:
        wrong = wrong + 1
    print("  %-22s %-15s %-7s %s" % (r[0], str(applied), str(r[2]), escape_n(raw, applied)))
print("")
print("  routes rendering the customer's name correctly : %s of %s" % (str(len(routes) - wrong), str(len(routes))))
print("  every route applies exactly the number of escapes its own code says,")
print("  and the stored value already carries one that none of them can see")
print("")
internal_raw = "Ben & Jerry's"
print("control - the same value written by a job that skips the ingress layer")
for r in [routes[0], routes[1]]:
    print("  %-22s renders %s" % (r[0], escape_n(internal_raw, r[1])))
print("  correct on the html route and correct on the json route")
print("  so the escape function is right and the templates are right")
print("")
customers = ["Ben & Jerry's", "Alice Chen", "Marks & Spencer", "Jose Ramirez", "O'Brien", "Yuki Tanaka", "Procter & Gamble", "Sam Nowak", "Ada Lovelace", "Dun & Bradstreet"]
affected = 0
for c in customers:
    if escape(c) != c:
        affected = affected + 1
print("control - customers whose rendering changes at all")
print("  customers            : %s" % str(len(customers)))
print("  containing an escapable character : %s" % str(affected))
print("  unaffected                        : %s" % str(len(customers) - affected))
print("  for those, one escape and three escapes give the same string, so a")
print("  test written with any of them passes under every layer count")
print("")
print("which names a test would be written with")
for c in [customers[1], customers[0]]:
    print("  %-20s n=1 %-24s n=3 %s" % (c, escape_n(c, 1), escape_n(c, 3)))
print("")
print("operations at a boundary, and whether two of them are worse than one")
print("  validate  : idempotent, two checks are one check")
print("  normalise : idempotent by definition, that is what it means")
print("  escape    : not idempotent, its output is made of the characters it")
print("              encodes, so it has nothing to be idempotent about")
print("  the rule that was followed does not distinguish these three")
print("")
print("Escaping on output stops a name becoming markup and escaping on ingress was")
print("added after a real incident. Escaping is not idempotent, so the two correct")
print("rules give %s of %s routes a wrong rendering, and %s of %s customers have a name" % (str(wrong), str(len(routes)), str(len(customers) - affected), str(len(customers))))
print("that looks identical however many times it is escaped.")
```

## stdout (executed)

```text
the stored value
  as typed by the customer : Ben & Jerry's
  length                   : 13
  after the ingress escape : Ben &amp; Jerry&#39;s
  length                   : 21

escaping applied n times to the same value
  n=0   length 13    Ben & Jerry's
  n=1   length 21    Ben &amp; Jerry&#39;s
  n=2   length 29    Ben &amp;amp; Jerry&amp;#39;s
  n=3   length 37    Ben &amp;amp;amp; Jerry&amp;amp;#39;s

  each extra layer adds 8 characters, so the layer count is recoverable
  from the length alone, which is how this was eventually found

route                  total escapes   needs   renders as
  web page               2               1       Ben &amp;amp; Jerry&amp;#39;s
  json api               1               0       Ben &amp; Jerry&#39;s
  csv export             1               0       Ben &amp; Jerry&#39;s
  transactional email    3               1       Ben &amp;amp;amp; Jerry&amp;amp;#39;s
  pdf invoice            1               0       Ben &amp; Jerry&#39;s

  routes rendering the customer's name correctly : 0 of 5
  every route applies exactly the number of escapes its own code says,
  and the stored value already carries one that none of them can see

control - the same value written by a job that skips the ingress layer
  web page               renders Ben &amp; Jerry&#39;s
  json api               renders Ben & Jerry's
  correct on the html route and correct on the json route
  so the escape function is right and the templates are right

control - customers whose rendering changes at all
  customers            : 10
  containing an escapable character : 5
  unaffected                        : 5
  for those, one escape and three escapes give the same string, so a
  test written with any of them passes under every layer count

which names a test would be written with
  Alice Chen           n=1 Alice Chen               n=3 Alice Chen
  Ben & Jerry's        n=1 Ben &amp; Jerry&#39;s    n=3 Ben &amp;amp;amp; Jerry&amp;amp;#39;s

operations at a boundary, and whether two of them are worse than one
  validate  : idempotent, two checks are one check
  normalise : idempotent by definition, that is what it means
  escape    : not idempotent, its output is made of the characters it
              encodes, so it has nothing to be idempotent about
  the rule that was followed does not distinguish these three

Escaping on output stops a name becoming markup and escaping on ingress was
added after a real incident. Escaping is not idempotent, so the two correct
rules give 5 of 5 routes a wrong rendering, and 5 of 10 customers have a name
that looks identical however many times it is escaped.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
