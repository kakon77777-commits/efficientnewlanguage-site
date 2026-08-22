<!-- canonical: efficientnewlanguage.org/ai/examples/492-enforcement-decayed-with-distance-from-the-author | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 492 — Enforcement decayed with distance from the author

`enforcement_decayed_with_distance_from_the_author.eml` - The convention is followed closely in the files its author touches and loosely elsewhere. The gradient is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The convention is
# followed closely in the files its author touches and loosely elsewhere. The
# gradient is computed below.
#
# Writing a convention down and then following it yourself is exactly right. The
# author's own files are the demonstration, they are where the reasoning is
# freshest, and a convention nobody follows anywhere is worse than one followed
# somewhere.
#
# Following it elsewhere needs a reader to encounter it, understand why, and
# apply it to a case the document did not enumerate. Each of those attenuates
# with distance from the person who has the reason in their head, and none of
# them attenuates with how much the convention matters in that file.
#
# Compliance is measured per module against that distance.

# [module, hops from the author's team, files, files following the convention, defects it prevents per year]
[["core", 0, 40, 39, 8], ["adjacent", 1, 55, 44, 9], ["same org", 2, 70, 35, 12], ["other org", 3, 90, 18, 15], ["contractor", 4, 30, 3, 6]] => modules

len(modules) => n
0 => files
0 => following
0 => prevented
for m in modules:
    files + m[2] => files
    following + m[3] => following
    prevented + m[4] => prevented

"files in scope : " + str(files) ^0
"files following the convention : " + str(following) + ", which is " + str(int(following * 100 / files)) + "%" ^0
"" ^0
"module        hops   files   following   rate   defects it would prevent/yr" ^0
for m in modules:
    "  " + m[0] + "   " + str(m[1]) + "      " + str(m[2]) + "      " + str(m[3]) + "          " + str(int(m[3] * 100 / m[2])) + "%    " + str(m[4]) ^0
"" ^0

# ---- the gradient ----

0 => prev_rate
1 => monotone
for m in modules:
    int(m[3] * 100 / m[2]) => rate
    if prev_rate > 0:
        if rate > prev_rate:
            0 => monotone
    rate => prev_rate
"compliance against distance" ^0
if monotone == 1:
    "  the rate falls at every hop, without exception" ^0
else:
    "  the rate does not fall monotonically" ^0
int(modules[0][3] * 100 / modules[0][2]) => near
int(modules[n - 1][3] * 100 / modules[n - 1][2]) => far
"  at 0 hops : " + str(near) + "%" ^0
"  at " + str(modules[n - 1][1]) + " hops : " + str(far) + "%" ^0
if near > far:
    "  a drop of " + str(near - far) + " points across " + str(modules[n - 1][1]) + " hops" ^0
"" ^0

# ---- where the convention would earn the most ----

0 => best
"" => best_name
for m in modules:
    if m[4] > best:
        m[4] => best
        m[0] => best_name
"the module where the convention prevents the most defects : " + best_name + ", " + str(best) + " a year" ^0
for m in modules:
    if m[0] == best_name:
        "  its compliance rate : " + str(int(m[3] * 100 / m[2])) + "%, at " + str(m[1]) + " hops" ^0
"" ^0

0 => close_prevented
0 => far_prevented
for m in modules:
    if m[1] <= 1:
        close_prevented + m[4] => close_prevented
    else:
        far_prevented + m[4] => far_prevented
"defects the convention would prevent, by distance" ^0
"  within 1 hop  : " + str(close_prevented) ^0
"  beyond 1 hop  : " + str(far_prevented) ^0
if far_prevented > close_prevented:
    "  most of the available benefit is where the compliance is lowest" ^0
"" ^0

# ---- what is actually being measured by "adoption" ----

"the adoption figure, as it is usually quoted" ^0
"  files following it : " + str(following) + " of " + str(files) + ", " + str(int(following * 100 / files)) + "%" ^0
"  what that number is a property of : how many files are near the author" ^0
0 => near_files
for m in modules:
    if m[1] <= 1:
        near_files + m[2] => near_files
"  files within 1 hop : " + str(near_files) + " of " + str(files) ^0
"  move the same convention into a codebase with a different shape and the" ^0
"  adoption figure moves without anybody's behaviour changing" ^0
"" ^0

# ---- what does not attenuate ----

"what a linter rule would do to the same gradient" ^0
"  hops it attenuates over : 0" ^0
"  what it cannot carry    : the reason, which is what lets a reader apply" ^0
"  the convention to a case the rule does not match" ^0
"  so the mechanical part travels and the judgement does not, and the" ^0
"  question is which of the two the convention mostly is" ^0
"" ^0

# ---- the control: a convention with no distance to travel ----
#
# In a codebase owned by one team, every file is at zero hops and the gradient
# has nothing to run along.

"control - the same convention in a single-team codebase" ^0
"  hops in play : 1 value, 0" ^0
"  compliance   : whatever the team decides, uniformly" ^0
"  the convention is then simply followed or not, and its adoption figure is" ^0
"  about the convention rather than about the org chart" ^0
"" ^0

"Following your own convention is the right way to demonstrate one, and the" ^0
"author's files are at 39 of 40. What travels is the rule; the reason stays" ^0
"where it was written, and compliance follows the reason." ^0
```

## Python (deterministic transpilation)

```python
modules = [["core", 0, 40, 39, 8], ["adjacent", 1, 55, 44, 9], ["same org", 2, 70, 35, 12], ["other org", 3, 90, 18, 15], ["contractor", 4, 30, 3, 6]]
n = len(modules)
files = 0
following = 0
prevented = 0
for m in modules:
    files = files + m[2]
    following = following + m[3]
    prevented = prevented + m[4]
print("files in scope : " + str(files))
print("files following the convention : " + str(following) + ", which is " + str(int(following * 100 / files)) + "%")
print("")
print("module        hops   files   following   rate   defects it would prevent/yr")
for m in modules:
    print("  " + m[0] + "   " + str(m[1]) + "      " + str(m[2]) + "      " + str(m[3]) + "          " + str(int(m[3] * 100 / m[2])) + "%    " + str(m[4]))
print("")
prev_rate = 0
monotone = 1
for m in modules:
    rate = int(m[3] * 100 / m[2])
    if prev_rate > 0:
        if rate > prev_rate:
            monotone = 0
    prev_rate = rate
print("compliance against distance")
if monotone == 1:
    print("  the rate falls at every hop, without exception")
else:
    print("  the rate does not fall monotonically")
near = int(modules[0][3] * 100 / modules[0][2])
far = int(modules[n - 1][3] * 100 / modules[n - 1][2])
print("  at 0 hops : " + str(near) + "%")
print("  at " + str(modules[n - 1][1]) + " hops : " + str(far) + "%")
if near > far:
    print("  a drop of " + str(near - far) + " points across " + str(modules[n - 1][1]) + " hops")
print("")
best = 0
best_name = ""
for m in modules:
    if m[4] > best:
        best = m[4]
        best_name = m[0]
print("the module where the convention prevents the most defects : " + best_name + ", " + str(best) + " a year")
for m in modules:
    if m[0] == best_name:
        print("  its compliance rate : " + str(int(m[3] * 100 / m[2])) + "%, at " + str(m[1]) + " hops")
print("")
close_prevented = 0
far_prevented = 0
for m in modules:
    if m[1] <= 1:
        close_prevented = close_prevented + m[4]
    else:
        far_prevented = far_prevented + m[4]
print("defects the convention would prevent, by distance")
print("  within 1 hop  : " + str(close_prevented))
print("  beyond 1 hop  : " + str(far_prevented))
if far_prevented > close_prevented:
    print("  most of the available benefit is where the compliance is lowest")
print("")
print("the adoption figure, as it is usually quoted")
print("  files following it : " + str(following) + " of " + str(files) + ", " + str(int(following * 100 / files)) + "%")
print("  what that number is a property of : how many files are near the author")
near_files = 0
for m in modules:
    if m[1] <= 1:
        near_files = near_files + m[2]
print("  files within 1 hop : " + str(near_files) + " of " + str(files))
print("  move the same convention into a codebase with a different shape and the")
print("  adoption figure moves without anybody's behaviour changing")
print("")
print("what a linter rule would do to the same gradient")
print("  hops it attenuates over : 0")
print("  what it cannot carry    : the reason, which is what lets a reader apply")
print("  the convention to a case the rule does not match")
print("  so the mechanical part travels and the judgement does not, and the")
print("  question is which of the two the convention mostly is")
print("")
print("control - the same convention in a single-team codebase")
print("  hops in play : 1 value, 0")
print("  compliance   : whatever the team decides, uniformly")
print("  the convention is then simply followed or not, and its adoption figure is")
print("  about the convention rather than about the org chart")
print("")
print("Following your own convention is the right way to demonstrate one, and the")
print("author's files are at 39 of 40. What travels is the rule; the reason stays")
print("where it was written, and compliance follows the reason.")
```

## stdout (executed)

```text
files in scope : 285
files following the convention : 139, which is 48%

module        hops   files   following   rate   defects it would prevent/yr
  core   0      40      39          97%    8
  adjacent   1      55      44          80%    9
  same org   2      70      35          50%    12
  other org   3      90      18          20%    15
  contractor   4      30      3          10%    6

compliance against distance
  the rate falls at every hop, without exception
  at 0 hops : 97%
  at 4 hops : 10%
  a drop of 87 points across 4 hops

the module where the convention prevents the most defects : other org, 15 a year
  its compliance rate : 20%, at 3 hops

defects the convention would prevent, by distance
  within 1 hop  : 17
  beyond 1 hop  : 33
  most of the available benefit is where the compliance is lowest

the adoption figure, as it is usually quoted
  files following it : 139 of 285, 48%
  what that number is a property of : how many files are near the author
  files within 1 hop : 95 of 285
  move the same convention into a codebase with a different shape and the
  adoption figure moves without anybody's behaviour changing

what a linter rule would do to the same gradient
  hops it attenuates over : 0
  what it cannot carry    : the reason, which is what lets a reader apply
  the convention to a case the rule does not match
  so the mechanical part travels and the judgement does not, and the
  question is which of the two the convention mostly is

control - the same convention in a single-team codebase
  hops in play : 1 value, 0
  compliance   : whatever the team decides, uniformly
  the convention is then simply followed or not, and its adoption figure is
  about the convention rather than about the org chart

Following your own convention is the right way to demonstrate one, and the
author's files are at 39 of 40. What travels is the rule; the reason stays
where it was written, and compliance follows the reason.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
