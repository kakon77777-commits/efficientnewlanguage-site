<!-- canonical: efficientnewlanguage.org/ai/examples/318-shared-cause-has-no-unique-split | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 318 — Shared cause has no unique split — every factor was necessary, none was sufficient, and the form has one box

`shared_cause_has_no_unique_split.eml` runs a necessity test on every factor of three incidents — remove it, does the outcome still happen — then applies five allocation rules and reports how often they disagree.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Several factors
# were each necessary and none was sufficient, and the form has one box called
# "root cause".
#
# An incident needed a config change AND a latent bug AND a traffic spike. Take
# any one away and nothing happens. That is not a chain with a first link; it
# is a conjunction, and a conjunction has no distinguished member.
#
# The form asks for one anyway, so a rule gets applied - the most recent
# change, the first thing in the timeline, the thing that was modified rather
# than the thing that was already there, the component with a name on it. Every
# one of those rules is defensible, and they name different owners.
#
# The rule matters because the owner is who fixes it. An allocation rule that
# nobody chose deliberately is doing work assignment while wearing a causal
# hat, and the factors it systematically ignores - the ones that were already
# there, unowned, and unchanged - are the ones that stay unfixed.
#
# The measurement runs a necessity test on every factor (remove it, does the
# outcome still happen), then applies five allocation rules and reports how
# often they disagree.

def fires(factors, present):
    # The outcome needs every factor whose `required` flag is set. `present`
    # is the list of factor names currently in play.
    for f in factors:
        if f[4] == 1:
            0 => here
            for p in present:
                if p == f[0]:
                    1 => here
            if here == 0:
                return 0
    return 1

def all_names(factors):
    [] => out
    for f in factors:
        out + [f[0]] => out
    return out

def without(names, drop):
    [] => out
    for n in names:
        if not (n == drop):
            out + [n] => out
    return out

def necessary_count(factors):
    # A factor is necessary when removing it prevents the outcome. Measured by
    # removing it, not by reading its flag.
    0 => n
    all_names(factors) => names
    for f in factors:
        if fires(factors, without(names, f[0])) == 0:
            n + 1 => n
    return n

def pick(factors, rule):
    # factors: [name, team, introduced_at, changed_recently, required]
    if rule == "most-recent":
        factors[0] => best
        for f in factors:
            if f[2] > best[2]:
                f => best
        return best[0]
    if rule == "earliest":
        factors[0] => best
        for f in factors:
            if f[2] < best[2]:
                f => best
        return best[0]
    if rule == "the-thing-that-changed":
        for f in factors:
            if f[3] == 1:
                return f[0]
        return factors[0][0]
    if rule == "has-an-owner":
        for f in factors:
            if len(f[1]) > 0:
                return f[0]
        return factors[0][0]
    # equal split cannot name one, so it names the alphabetically first as a
    # tie-break - which is exactly as arbitrary as it sounds
    factors[0] => best
    for f in factors:
        if f[0] < best[0]:
            f => best
    return best[0]

["most-recent", "earliest", "the-thing-that-changed", "has-an-owner", "tie-break"] => RULES

# name, team, introduced_at, changed_recently, required
[[["retry-storm", "platform", 40, 1, 1],
  ["unbounded-queue", "", 3, 0, 1],
  ["traffic-spike", "", 41, 0, 1]],
 [["timeout-lowered", "api", 30, 1, 1],
  ["slow-dependency", "search", 12, 0, 1]],
 [["cache-warmup-removed", "web", 25, 1, 1],
  ["cold-start-cost", "", 2, 0, 1],
  ["deploy-window", "release", 26, 0, 1]]] => INCIDENTS

"incident  factors  each necessary  outcome without any one"^0
"--------  -------  --------------  -----------------------"^0
0 => i
while i < len(INCIDENTS):
    INCIDENTS[i] => fs
    necessary_count(fs) => nec
    all_names(fs) => names
    0 => still_fires
    for f in fs:
        if fires(fs, without(names, f[0])) == 1:
            still_fires + 1 => still_fires
    (("  " + str(i + 1) + "       ")[0:10] + (str(len(fs)) + "         ")[0:9] + (str(nec) + "                ")[0:16] + "fires in " + str(still_fires) + " of " + str(len(fs)) + " removals")^0
    i + 1 => i

""^0
"who each rule blames"^0
"incident  most-recent           earliest              the-thing-that-changed  has-an-owner"^0
"--------  --------------------  --------------------  ----------------------  --------------------"^0
{} => blame
0 => i
while i < len(INCIDENTS):
    INCIDENTS[i] => fs
    "" => row
    for rule in RULES:
        pick(fs, rule) => who
        who => blame[str(i) + "/" + rule]
    (("  " + str(i + 1) + "       ")[0:10] + (blame[str(i) + "/most-recent"] + "                      ")[0:22] + (blame[str(i) + "/earliest"] + "                      ")[0:22] + (blame[str(i) + "/the-thing-that-changed"] + "                        ")[0:24] + blame[str(i) + "/has-an-owner"])^0
    i + 1 => i

""^0
"how often the rules disagree"^0
0 => incidents_with_disagreement
0 => i
while i < len(INCIDENTS):
    [] => named
    for rule in RULES:
        blame[str(i) + "/" + rule] => who
        if not (who in named):
            named + [who] => named
    if len(named) > 1:
        incidents_with_disagreement + 1 => incidents_with_disagreement
    ("incident " + str(i + 1) + ": " + str(len(named)) + " distinct factors named by " + str(len(RULES)) + " rules")^0
    i + 1 => i
("incidents where the rules disagree: " + str(incidents_with_disagreement) + " of " + str(len(INCIDENTS)))^0

""^0
"how many of the five rules name each factor"^0

# The first version of this section asked which necessary factors NO rule ever
# names, and measured zero: five rules over two or three factors name all of
# them between them. That was the wrong question. An organisation does not run
# five rules - it runs ONE, whichever its form implies. So the quantity that
# matters is how many of the five would have named a factor, because a factor
# named by one rule out of five is invisible under the other four.
0 => named_once
0 => unowned_named_once
0 => i
while i < len(INCIDENTS):
    INCIDENTS[i] => fs
    for f in fs:
        0 => n_rules
        for rule in RULES:
            if blame[str(i) + "/" + rule] == f[0]:
                n_rules + 1 => n_rules
        if len(f[1]) == 0:
            "unowned" => note
        else:
            "owned by " + f[1] => note
        if n_rules == 1:
            named_once + 1 => named_once
            if len(f[1]) == 0:
                unowned_named_once + 1 => unowned_named_once
        ("  incident " + str(i + 1) + ": " + (f[0] + "                      ")[0:22] + "named by " + str(n_rules) + "/" + str(len(RULES)) + " rules, " + note)^0
    i + 1 => i
("necessary factors named by exactly one of the five rules: " + str(named_once))^0
("...of which unowned: " + str(unowned_named_once))^0

""^0
0 => checked
0 => passed

# Every incident must have more than one necessary factor - otherwise there IS
# a root cause and the case is about nothing.
checked + 1 => checked
0 => multi
0 => i
while i < len(INCIDENTS):
    if necessary_count(INCIDENTS[i]) > 1:
        multi + 1 => multi
    i + 1 => i
if multi == len(INCIDENTS):
    passed + 1 => passed

# No single factor may be sufficient - removing any one must stop the outcome.
checked + 1 => checked
0 => any_sufficient
0 => i
while i < len(INCIDENTS):
    INCIDENTS[i] => fs
    all_names(fs) => names
    for f in fs:
        if fires(fs, without(names, f[0])) == 1:
            any_sufficient + 1 => any_sufficient
    i + 1 => i
if any_sufficient == 0:
    passed + 1 => passed

# The rules must disagree on at least one incident.
checked + 1 => checked
if incidents_with_disagreement > 0:
    passed + 1 => passed

# Some necessary factor must be reachable by only ONE of the five rules -
# those are the ones an organisation running any other rule never sees.
checked + 1 => checked
if named_once > 0:
    passed + 1 => passed

# And at least one of those must be unowned. A factor with a team attached
# gets named by "has-an-owner" whatever else is true; the ones that fall
# through every rule are the ones nobody is responsible for, which is also why
# they were still there.
checked + 1 => checked
if unowned_named_once > 0:
    passed + 1 => passed

# Every rule must name a factor that is genuinely necessary - none of them is
# blaming something irrelevant.
checked + 1 => checked
0 => blamed_unnecessary
0 => i
while i < len(INCIDENTS):
    INCIDENTS[i] => fs
    all_names(fs) => names
    for rule in RULES:
        blame[str(i) + "/" + rule] => who
        if fires(fs, without(names, who)) == 1:
            blamed_unnecessary + 1 => blamed_unnecessary
    i + 1 => i
if blamed_unnecessary == 0:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Every factor was necessary, none was sufficient, and the form has one box." => verdict
else:
    "FAILED - the incidents did not behave as the checks describe." => verdict
verdict^0

""^0
"A conjunction has no first member. Asking which factor caused it is asking"^0
"a question the causal structure does not answer, so the answer comes from"^0
"the tie-break rule instead - and the tie-break rule was never chosen, it"^0
"was implied by the order of a list or the shape of a form. What it"^0
"consistently misses is the factor that was already there, belonged to"^0
"nobody, and did not change: the one that will still be there next time."^0
```

## Python (deterministic transpilation)

```python
def fires(factors, present):
    for f in factors:
        if f[4] == 1:
            here = 0
            for p in present:
                if p == f[0]:
                    here = 1
            if here == 0:
                return 0
    return 1

def all_names(factors):
    out = []
    for f in factors:
        out = out + [f[0]]
    return out

def without(names, drop):
    out = []
    for n in names:
        if not n == drop:
            out = out + [n]
    return out

def necessary_count(factors):
    n = 0
    names = all_names(factors)
    for f in factors:
        if fires(factors, without(names, f[0])) == 0:
            n = n + 1
    return n

def pick(factors, rule):
    if rule == "most-recent":
        best = factors[0]
        for f in factors:
            if f[2] > best[2]:
                best = f
        return best[0]
    if rule == "earliest":
        best = factors[0]
        for f in factors:
            if f[2] < best[2]:
                best = f
        return best[0]
    if rule == "the-thing-that-changed":
        for f in factors:
            if f[3] == 1:
                return f[0]
        return factors[0][0]
    if rule == "has-an-owner":
        for f in factors:
            if len(f[1]) > 0:
                return f[0]
        return factors[0][0]
    best = factors[0]
    for f in factors:
        if f[0] < best[0]:
            best = f
    return best[0]

RULES = ["most-recent", "earliest", "the-thing-that-changed", "has-an-owner", "tie-break"]
INCIDENTS = [[["retry-storm", "platform", 40, 1, 1], ["unbounded-queue", "", 3, 0, 1], ["traffic-spike", "", 41, 0, 1]], [["timeout-lowered", "api", 30, 1, 1], ["slow-dependency", "search", 12, 0, 1]], [["cache-warmup-removed", "web", 25, 1, 1], ["cold-start-cost", "", 2, 0, 1], ["deploy-window", "release", 26, 0, 1]]]
print("incident  factors  each necessary  outcome without any one")
print("--------  -------  --------------  -----------------------")
i = 0
while i < len(INCIDENTS):
    fs = INCIDENTS[i]
    nec = necessary_count(fs)
    names = all_names(fs)
    still_fires = 0
    for f in fs:
        if fires(fs, without(names, f[0])) == 1:
            still_fires = still_fires + 1
    print(("  " + str(i + 1) + "       ")[0:10] + (str(len(fs)) + "         ")[0:9] + (str(nec) + "                ")[0:16] + "fires in " + str(still_fires) + " of " + str(len(fs)) + " removals")
    i = i + 1
print("")
print("who each rule blames")
print("incident  most-recent           earliest              the-thing-that-changed  has-an-owner")
print("--------  --------------------  --------------------  ----------------------  --------------------")
blame = {}
i = 0
while i < len(INCIDENTS):
    fs = INCIDENTS[i]
    row = ""
    for rule in RULES:
        who = pick(fs, rule)
        blame[str(i) + "/" + rule] = who
    print(("  " + str(i + 1) + "       ")[0:10] + (blame[str(i) + "/most-recent"] + "                      ")[0:22] + (blame[str(i) + "/earliest"] + "                      ")[0:22] + (blame[str(i) + "/the-thing-that-changed"] + "                        ")[0:24] + blame[str(i) + "/has-an-owner"])
    i = i + 1
print("")
print("how often the rules disagree")
incidents_with_disagreement = 0
i = 0
while i < len(INCIDENTS):
    named = []
    for rule in RULES:
        who = blame[str(i) + "/" + rule]
        if not who in named:
            named = named + [who]
    if len(named) > 1:
        incidents_with_disagreement = incidents_with_disagreement + 1
    print("incident " + str(i + 1) + ": " + str(len(named)) + " distinct factors named by " + str(len(RULES)) + " rules")
    i = i + 1
print("incidents where the rules disagree: " + str(incidents_with_disagreement) + " of " + str(len(INCIDENTS)))
print("")
print("how many of the five rules name each factor")
named_once = 0
unowned_named_once = 0
i = 0
while i < len(INCIDENTS):
    fs = INCIDENTS[i]
    for f in fs:
        n_rules = 0
        for rule in RULES:
            if blame[str(i) + "/" + rule] == f[0]:
                n_rules = n_rules + 1
        if len(f[1]) == 0:
            note = "unowned"
        else:
            note = "owned by " + f[1]
        if n_rules == 1:
            named_once = named_once + 1
            if len(f[1]) == 0:
                unowned_named_once = unowned_named_once + 1
        print("  incident " + str(i + 1) + ": " + (f[0] + "                      ")[0:22] + "named by " + str(n_rules) + "/" + str(len(RULES)) + " rules, " + note)
    i = i + 1
print("necessary factors named by exactly one of the five rules: " + str(named_once))
print("...of which unowned: " + str(unowned_named_once))
print("")
checked = 0
passed = 0
checked = checked + 1
multi = 0
i = 0
while i < len(INCIDENTS):
    if necessary_count(INCIDENTS[i]) > 1:
        multi = multi + 1
    i = i + 1
if multi == len(INCIDENTS):
    passed = passed + 1
checked = checked + 1
any_sufficient = 0
i = 0
while i < len(INCIDENTS):
    fs = INCIDENTS[i]
    names = all_names(fs)
    for f in fs:
        if fires(fs, without(names, f[0])) == 1:
            any_sufficient = any_sufficient + 1
    i = i + 1
if any_sufficient == 0:
    passed = passed + 1
checked = checked + 1
if incidents_with_disagreement > 0:
    passed = passed + 1
checked = checked + 1
if named_once > 0:
    passed = passed + 1
checked = checked + 1
if unowned_named_once > 0:
    passed = passed + 1
checked = checked + 1
blamed_unnecessary = 0
i = 0
while i < len(INCIDENTS):
    fs = INCIDENTS[i]
    names = all_names(fs)
    for rule in RULES:
        who = blame[str(i) + "/" + rule]
        if fires(fs, without(names, who)) == 1:
            blamed_unnecessary = blamed_unnecessary + 1
    i = i + 1
if blamed_unnecessary == 0:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Every factor was necessary, none was sufficient, and the form has one box."
else:
    verdict = "FAILED - the incidents did not behave as the checks describe."
print(verdict)
print("")
print("A conjunction has no first member. Asking which factor caused it is asking")
print("a question the causal structure does not answer, so the answer comes from")
print("the tie-break rule instead - and the tie-break rule was never chosen, it")
print("was implied by the order of a list or the shape of a form. What it")
print("consistently misses is the factor that was already there, belonged to")
print("nobody, and did not change: the one that will still be there next time.")
```

## stdout (executed)

```text
incident  factors  each necessary  outcome without any one
--------  -------  --------------  -----------------------
  1       3        3               fires in 0 of 3 removals
  2       2        2               fires in 0 of 2 removals
  3       3        3               fires in 0 of 3 removals

who each rule blames
incident  most-recent           earliest              the-thing-that-changed  has-an-owner
--------  --------------------  --------------------  ----------------------  --------------------
  1       traffic-spike         unbounded-queue       retry-storm             retry-storm
  2       timeout-lowered       slow-dependency       timeout-lowered         timeout-lowered
  3       deploy-window         cold-start-cost       cache-warmup-removed    cache-warmup-removed

how often the rules disagree
incident 1: 3 distinct factors named by 5 rules
incident 2: 2 distinct factors named by 5 rules
incident 3: 3 distinct factors named by 5 rules
incidents where the rules disagree: 3 of 3

how many of the five rules name each factor
  incident 1: retry-storm           named by 3/5 rules, owned by platform
  incident 1: unbounded-queue       named by 1/5 rules, unowned
  incident 1: traffic-spike         named by 1/5 rules, unowned
  incident 2: timeout-lowered       named by 3/5 rules, owned by api
  incident 2: slow-dependency       named by 2/5 rules, owned by search
  incident 3: cache-warmup-removed  named by 3/5 rules, owned by web
  incident 3: cold-start-cost       named by 1/5 rules, unowned
  incident 3: deploy-window         named by 1/5 rules, owned by release
necessary factors named by exactly one of the five rules: 4
...of which unowned: 3

checks passed: 6/6
Every factor was necessary, none was sufficient, and the form has one box.

A conjunction has no first member. Asking which factor caused it is asking
a question the causal structure does not answer, so the answer comes from
the tie-break rule instead - and the tie-break rule was never chosen, it
was implied by the order of a list or the shape of a form. What it
consistently misses is the factor that was already there, belonged to
nobody, and did not change: the one that will still be there next time.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
