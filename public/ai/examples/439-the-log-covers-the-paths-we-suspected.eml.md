<!-- canonical: efficientnewlanguage.org/ai/examples/439-the-log-covers-the-paths-we-suspected | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 439 — The log covers the paths we suspected

`the_log_covers_the_paths_we_suspected.eml` - Logging was added to the paths that had failed before. The logs now say those paths are where the failures are.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Logging was added
# to the paths that had failed before. The logs now say those paths are where
# the failures are.
#
# Instrumenting what has already broken is the right first move. It is cheap,
# it is targeted, and it pays off immediately, because a path that failed once
# is genuinely more likely to fail again. Nobody instruments uniformly on day
# one and nobody should.
#
# What the logs then contain is failures on instrumented paths. A path with no
# instrumentation contributes zero lines whatever it does, so "where the
# failures are" and "where the logging is" come out of the same query, and the
# query cannot tell them apart.
#
# Both counts are computed here against an audit that did not read the logs.

# [path, instrumented, had failed before, real failures this quarter]
[["payment retry", 1, 1, 4], ["auth refresh", 1, 1, 6], ["bulk import", 0, 0, 22], ["webhook replay", 0, 0, 15], ["search fallback", 1, 1, 3], ["csv export", 0, 0, 9]] => paths

len(paths) => n

def real_total():
    0 => t
    for p in paths:
        t + p[3] => t
    return t

def logged(p):
    if p[1] == 1:
        return p[3]
    return 0

def logged_total():
    0 => t
    for p in paths:
        t + logged(p) => t
    return t

"paths : " + str(n) ^0
0 => instrumented
for p in paths:
    if p[1] == 1:
        instrumented + 1 => instrumented
"  instrumented : " + str(instrumented) ^0
"  not          : " + str(n - instrumented) ^0
"" ^0

"path              instrumented   in the logs   actually failed" ^0
for p in paths:
    "" => mark
    if p[1] == 1:
        mark + "yes" => mark
    else:
        mark + "no " => mark
    "  " + p[0] + "   " + mark + "            " + str(logged(p)) + "            " + str(p[3]) ^0
"" ^0

"failures this quarter" ^0
"  the audit found : " + str(real_total()) ^0
"  the logs show   : " + str(logged_total()) ^0
if real_total() > logged_total():
    "  invisible in the logs : " + str(real_total() - logged_total()) + " of " + str(real_total()) + ", which is " + str(int((real_total() - logged_total()) * 100 / real_total())) + "%" ^0
"" ^0

# ---- the two rankings ----

"" => log_top
0 => log_best
for p in paths:
    if logged(p) > log_best:
        logged(p) => log_best
        p[0] => log_top
"" => real_top
0 => real_best
for p in paths:
    if p[3] > real_best:
        p[3] => real_best
        p[0] => real_top

"the worst path, by each source" ^0
"  by the logs  : " + log_top + " (" + str(log_best) + ")" ^0
"  by the audit : " + real_top + " (" + str(real_best) + ")" ^0
if not (log_top == real_top):
    "  different paths, and the log answer is the worst of the ones being watched" ^0
else:
    "  the same path under both sources" ^0
"" ^0

# ---- why the instrumentation is where it is ----
#
# Every instrumented path had failed before. The placement was evidence-based;
# the evidence was the previous quarter's logs, which had the same shape.

0 => matched
for p in paths:
    if p[1] == p[2]:
        matched + 1 => matched
"how the instrumented set was chosen" ^0
"  paths where instrumented == had failed before : " + str(matched) + " of " + str(n) ^0
if matched == n:
    "  the rule was applied exactly, with no exceptions either way" ^0
"  so the set is decided by the past, and the past was read the same way" ^0
"" ^0

# ---- what an investigation would conclude from the logs alone ----

"an investigation reading only the logs" ^0
"  paths it can name        : " + str(instrumented) ^0
"  failures it can count    : " + str(logged_total()) ^0
"  paths it cannot see      : " + str(n - instrumented) ^0
"  failures it cannot count : " + str(real_total() - logged_total()) ^0
"  it would report that the watched paths carry every failure, correctly," ^0
"  because every failure it has is on a watched path" ^0
"" ^0

# ---- what one round of uniform instrumentation would buy ----

0 => newly_visible
for p in paths:
    if p[1] == 0:
        newly_visible + p[3] => newly_visible
"instrumenting the remaining " + str(n - instrumented) + " paths" ^0
"  failures that become countable : " + str(newly_visible) ^0
if newly_visible > logged_total():
    "  more than the current logs contain in total, by " + str(newly_visible - logged_total()) ^0
"" ^0

# ---- the control: a uniformly instrumented service ----
#
# Where every path is watched, the log ranking and the audit ranking are the
# same ranking, and a comparison between them proves nothing about placement.

[["a", 1, 1, 5], ["b", 1, 1, 12], ["c", 1, 1, 2]] => uniform
"" => u_log_top
0 => u_log_best
"" => u_real_top
0 => u_real_best
for p in uniform:
    if p[3] > u_real_best:
        p[3] => u_real_best
        p[0] => u_real_top
    if p[1] == 1:
        if p[3] > u_log_best:
            p[3] => u_log_best
            p[0] => u_log_top
"control - every path instrumented" ^0
"  worst by the logs  : " + u_log_top ^0
"  worst by the audit : " + u_real_top ^0
if u_log_top == u_real_top:
    "  identical, so this service cannot show that placement decides the answer" ^0
"" ^0

"The instrumented paths were chosen from real evidence and each of them does" ^0
"fail. A count of logged failures is a count of failures on logged paths, and" ^0
"the second word is doing work the first one hides." ^0
```

## Python (deterministic transpilation)

```python
paths = [["payment retry", 1, 1, 4], ["auth refresh", 1, 1, 6], ["bulk import", 0, 0, 22], ["webhook replay", 0, 0, 15], ["search fallback", 1, 1, 3], ["csv export", 0, 0, 9]]
n = len(paths)

def real_total():
    t = 0
    for p in paths:
        t = t + p[3]
    return t

def logged(p):
    if p[1] == 1:
        return p[3]
    return 0

def logged_total():
    t = 0
    for p in paths:
        t = t + logged(p)
    return t

print("paths : " + str(n))
instrumented = 0
for p in paths:
    if p[1] == 1:
        instrumented = instrumented + 1
print("  instrumented : " + str(instrumented))
print("  not          : " + str(n - instrumented))
print("")
print("path              instrumented   in the logs   actually failed")
for p in paths:
    mark = ""
    if p[1] == 1:
        mark = mark + "yes"
    else:
        mark = mark + "no "
    print("  " + p[0] + "   " + mark + "            " + str(logged(p)) + "            " + str(p[3]))
print("")
print("failures this quarter")
print("  the audit found : " + str(real_total()))
print("  the logs show   : " + str(logged_total()))
if real_total() > logged_total():
    print("  invisible in the logs : " + str(real_total() - logged_total()) + " of " + str(real_total()) + ", which is " + str(int((real_total() - logged_total()) * 100 / real_total())) + "%")
print("")
log_top = ""
log_best = 0
for p in paths:
    if logged(p) > log_best:
        log_best = logged(p)
        log_top = p[0]
real_top = ""
real_best = 0
for p in paths:
    if p[3] > real_best:
        real_best = p[3]
        real_top = p[0]
print("the worst path, by each source")
print("  by the logs  : " + log_top + " (" + str(log_best) + ")")
print("  by the audit : " + real_top + " (" + str(real_best) + ")")
if not log_top == real_top:
    print("  different paths, and the log answer is the worst of the ones being watched")
else:
    print("  the same path under both sources")
print("")
matched = 0
for p in paths:
    if p[1] == p[2]:
        matched = matched + 1
print("how the instrumented set was chosen")
print("  paths where instrumented == had failed before : " + str(matched) + " of " + str(n))
if matched == n:
    print("  the rule was applied exactly, with no exceptions either way")
print("  so the set is decided by the past, and the past was read the same way")
print("")
print("an investigation reading only the logs")
print("  paths it can name        : " + str(instrumented))
print("  failures it can count    : " + str(logged_total()))
print("  paths it cannot see      : " + str(n - instrumented))
print("  failures it cannot count : " + str(real_total() - logged_total()))
print("  it would report that the watched paths carry every failure, correctly,")
print("  because every failure it has is on a watched path")
print("")
newly_visible = 0
for p in paths:
    if p[1] == 0:
        newly_visible = newly_visible + p[3]
print("instrumenting the remaining " + str(n - instrumented) + " paths")
print("  failures that become countable : " + str(newly_visible))
if newly_visible > logged_total():
    print("  more than the current logs contain in total, by " + str(newly_visible - logged_total()))
print("")
uniform = [["a", 1, 1, 5], ["b", 1, 1, 12], ["c", 1, 1, 2]]
u_log_top = ""
u_log_best = 0
u_real_top = ""
u_real_best = 0
for p in uniform:
    if p[3] > u_real_best:
        u_real_best = p[3]
        u_real_top = p[0]
    if p[1] == 1:
        if p[3] > u_log_best:
            u_log_best = p[3]
            u_log_top = p[0]
print("control - every path instrumented")
print("  worst by the logs  : " + u_log_top)
print("  worst by the audit : " + u_real_top)
if u_log_top == u_real_top:
    print("  identical, so this service cannot show that placement decides the answer")
print("")
print("The instrumented paths were chosen from real evidence and each of them does")
print("fail. A count of logged failures is a count of failures on logged paths, and")
print("the second word is doing work the first one hides.")
```

## stdout (executed)

```text
paths : 6
  instrumented : 3
  not          : 3

path              instrumented   in the logs   actually failed
  payment retry   yes            4            4
  auth refresh   yes            6            6
  bulk import   no             0            22
  webhook replay   no             0            15
  search fallback   yes            3            3
  csv export   no             0            9

failures this quarter
  the audit found : 59
  the logs show   : 13
  invisible in the logs : 46 of 59, which is 77%

the worst path, by each source
  by the logs  : auth refresh (6)
  by the audit : bulk import (22)
  different paths, and the log answer is the worst of the ones being watched

how the instrumented set was chosen
  paths where instrumented == had failed before : 6 of 6
  the rule was applied exactly, with no exceptions either way
  so the set is decided by the past, and the past was read the same way

an investigation reading only the logs
  paths it can name        : 3
  failures it can count    : 13
  paths it cannot see      : 3
  failures it cannot count : 46
  it would report that the watched paths carry every failure, correctly,
  because every failure it has is on a watched path

instrumenting the remaining 3 paths
  failures that become countable : 46
  more than the current logs contain in total, by 33

control - every path instrumented
  worst by the logs  : b
  worst by the audit : b
  identical, so this service cannot show that placement decides the answer

The instrumented paths were chosen from real evidence and each of them does
fail. A count of logged failures is a count of failures on logged paths, and
the second word is doing work the first one hides.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
