<!-- canonical: efficientnewlanguage.org/ai/examples/241-metric-cardinality-explosion | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 241 — A label that looked like it had five values

`metric_cardinality_explosion.eml` counts the time series each labelling produces and compares them against what the label domains predict.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A metric label
# that looked like it had five values.
#
# A counter with labels is one time series per distinct combination of label
# values. Adding a label multiplies the count:
#
#     requests{method, status}                 4 x 5   =    20 series
#     requests{method, status, endpoint}       x 30    =   600
#     requests{method, status, endpoint, user} x 5000  = 3,000,000
#
# The last one is the mistake, and it is never introduced as "let us store
# three million series". It is introduced as "it would be useful to break this
# down per customer", by someone reading a dashboard, in one line of code, and
# the cost is paid by a different system a week later.
#
# The trap that makes it hard to catch in review is that the dangerous label
# usually LOOKS bounded. `endpoint` is fine until a path contains an id:
#
#     /users/:id     one series
#     /users/12345   one series per user, spelled differently
#
# Nothing about the label's type says which of those it is, and both are
# strings.
#
# The measurement is a real count. Requests are generated with known label
# values, the series each labelling produces are counted, and the count is
# compared against what the label DOMAINS predict. Where those disagree, the
# label is unbounded - which is a property of the data, not of the schema.

def make_requests(n):
    # Deterministic traffic. `path` carries a numeric id, which is the whole
    # problem: it is a string like every other label value.
    ["GET", "POST", "PUT", "DELETE"] => methods
    [200, 201, 400, 404, 500] => statuses
    [] => out
    for i in [0:n - 1]:
        methods[i % 4] => m
        statuses[i % 5] => s
        "u" + str(i % 250) => user
        "/users/" + str(i % 250) + "/orders" => path
        out + [[m, s, user, path]] => out
    return out

240 => N
make_requests(N) => requests

def count_series(rows, fields):
    {} => seen
    for r in rows:
        "" => key
        for f in fields:
            if len(key) > 0:
                key + "|" => key
            key + str(r[f]) => key
        1 => seen[key]
    return len(seen)

def template_path(p):
    # The repair: replace any all-digit path segment with a placeholder, so
    # `/users/17/orders` and `/users/99/orders` are ONE endpoint.
    "" => out
    "" => seg
    p + "/" => padded
    for ch in padded:
        if ch == "/":
            0 => alldigits
            if len(seg) > 0:
                1 => alldigits
                for c in seg:
                    if c < "0" or c > "9":
                        0 => alldigits
            if alldigits == 1:
                out + "/:id" => out
            else:
                out + "/" + seg => out
            "" => seg
        else:
            seg + ch => seg
    return out

[] => templated
for r in requests:
    templated + [[r[0], r[1], r[2], template_path(r[3])]] => templated

"labelling                        series"^0
("%-32s %d" % ("method", count_series(requests, [0])))^0
("%-32s %d" % ("method, status", count_series(requests, [0, 1])))^0
("%-32s %d" % ("method, status, path", count_series(requests, [0, 1, 3])))^0
("%-32s %d" % ("method, status, path, user", count_series(requests, [0, 1, 2, 3])))^0
("%-32s %d" % ("method, status, TEMPLATED path", count_series(templated, [0, 1, 3])))^0

# ------------------------------------------ what the schema would have predicted
# The domains a reviewer would write down: 4 methods, 5 statuses, "a handful"
# of endpoints. The prediction and the reality differ by the id in the path.
4 => methods_expected
5 => statuses_expected
1 => endpoints_expected

""^0
("predicted from the label domains:")^0
("  method x status                 " + str(methods_expected * statuses_expected))^0
("  method x status x endpoint      " + str(methods_expected * statuses_expected * endpoints_expected))^0
("actually observed:")^0
("  method x status                 " + str(count_series(requests, [0, 1])))^0
("  method x status x path          " + str(count_series(requests, [0, 1, 3])))^0
("  method x status x templated     " + str(count_series(templated, [0, 1, 3])))^0

# ----------------------------------- which label is the unbounded one, measured
# A label is unbounded when its distinct-value count grows with the number of
# requests. Checked by comparing two prefixes of the same stream rather than
# by reading the schema.
make_requests(80) => small
requests => large

""^0
("distinct values, 80 requests vs " + str(N) + ":")^0
0 => unbounded
[] => unbounded_names
for pair in [["method", 0], ["status", 1], ["user", 2], ["path", 3]]:
    count_series(small, [pair[1]]) => a
    count_series(large, [pair[1]]) => b
    "bounded" => verdict_label
    if b > a:
        "GROWS" => verdict_label
        unbounded + 1 => unbounded
        unbounded_names + [pair[0]] => unbounded_names
    ("  %-8s %-5d %-5d %s" % (pair[0], a, b, verdict_label))^0

count_series(small, [3]) => t_small_raw
[] => small_t
for r in small:
    small_t + [[r[0], r[1], r[2], template_path(r[3])]] => small_t
count_series(small_t, [3]) => t_small
count_series(templated, [3]) => t_large

("  %-8s %-5d %-5d %s" % ("templ.", t_small, t_large, "bounded"))^0

# ------------------------------------------------- the storage that implies
""^0
("series to store, one counter each:")^0
("  with raw path:        " + str(count_series(requests, [0, 1, 3])))^0
("  with raw path + user: " + str(count_series(requests, [0, 1, 2, 3])))^0
("  with templated path:  " + str(count_series(templated, [0, 1, 3])))^0
("...and every one of them is retained for the full retention window.")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Templating must collapse the endpoint label to the predicted size.
checked + 1 => checked
if count_series(templated, [0, 1, 3]) == methods_expected * statuses_expected:
    passed + 1 => passed

# The raw path must blow past the prediction by a large factor.
checked + 1 => checked
if count_series(requests, [0, 1, 3]) > methods_expected * statuses_expected * 10:
    passed + 1 => passed

# The growth test must identify exactly the unbounded labels, and must NOT
# flag method or status. This is the check that the diagnosis is a
# measurement rather than a guess.
checked + 1 => checked
if unbounded == 2:
    0 => flagged_bounded
    for nm in unbounded_names:
        if nm == "method" or nm == "status":
            1 => flagged_bounded
    if flagged_bounded == 0:
        passed + 1 => passed

# The templated label must NOT grow with traffic.
checked + 1 => checked
if t_small == t_large:
    passed + 1 => passed

# And templating must not destroy the distinction it was keeping - the
# method/status breakdown has to survive.
checked + 1 => checked
if count_series(templated, [0, 1]) == count_series(requests, [0, 1]):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Two labels grow with traffic. The schema says nothing about which." => verdict
else:
    "FAILED - a labelling did not behave as the checks describe." => verdict
verdict^0

""^0
"Whether a label is bounded is a fact about the DATA, and the only reliable" => n1
n1^0
"way to learn it is to count distinct values as traffic grows - which is a" => n2
n2^0
"measurement nobody runs, because the label was added to answer a question," => n3
n3^0
"not to be studied. `method` and `endpoint` have the same type and one of" => n4
n4^0
"them is a time bomb." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def make_requests(n):
    methods = ["GET", "POST", "PUT", "DELETE"]
    statuses = [200, 201, 400, 404, 500]
    out = []
    for i in range(0, n):
        m = methods[i % 4]
        s = statuses[i % 5]
        user = "u" + str(i % 250)
        path = "/users/" + str(i % 250) + "/orders"
        out = out + [[m, s, user, path]]
    return out

N = 240
requests = make_requests(N)

def count_series(rows, fields):
    seen = {}
    for r in rows:
        key = ""
        for f in fields:
            if len(key) > 0:
                key = key + "|"
            key = key + str(r[f])
        seen[key] = 1
    return len(seen)

def template_path(p):
    out = ""
    seg = ""
    padded = p + "/"
    for ch in padded:
        if ch == "/":
            alldigits = 0
            if len(seg) > 0:
                alldigits = 1
                for c in seg:
                    if c < "0" or c > "9":
                        alldigits = 0
            if alldigits == 1:
                out = out + "/:id"
            else:
                out = out + "/" + seg
            seg = ""
        else:
            seg = seg + ch
    return out

templated = []
for r in requests:
    templated = templated + [[r[0], r[1], r[2], template_path(r[3])]]
print("labelling                        series")
print("%-32s %d" % ("method", count_series(requests, [0])))
print("%-32s %d" % ("method, status", count_series(requests, [0, 1])))
print("%-32s %d" % ("method, status, path", count_series(requests, [0, 1, 3])))
print("%-32s %d" % ("method, status, path, user", count_series(requests, [0, 1, 2, 3])))
print("%-32s %d" % ("method, status, TEMPLATED path", count_series(templated, [0, 1, 3])))
methods_expected = 4
statuses_expected = 5
endpoints_expected = 1
print("")
print("predicted from the label domains:")
print("  method x status                 " + str(methods_expected * statuses_expected))
print("  method x status x endpoint      " + str(methods_expected * statuses_expected * endpoints_expected))
print("actually observed:")
print("  method x status                 " + str(count_series(requests, [0, 1])))
print("  method x status x path          " + str(count_series(requests, [0, 1, 3])))
print("  method x status x templated     " + str(count_series(templated, [0, 1, 3])))
small = make_requests(80)
large = requests
print("")
print("distinct values, 80 requests vs " + str(N) + ":")
unbounded = 0
unbounded_names = []
for pair in [["method", 0], ["status", 1], ["user", 2], ["path", 3]]:
    a = count_series(small, [pair[1]])
    b = count_series(large, [pair[1]])
    verdict_label = "bounded"
    if b > a:
        verdict_label = "GROWS"
        unbounded = unbounded + 1
        unbounded_names = unbounded_names + [pair[0]]
    print("  %-8s %-5d %-5d %s" % (pair[0], a, b, verdict_label))
t_small_raw = count_series(small, [3])
small_t = []
for r in small:
    small_t = small_t + [[r[0], r[1], r[2], template_path(r[3])]]
t_small = count_series(small_t, [3])
t_large = count_series(templated, [3])
print("  %-8s %-5d %-5d %s" % ("templ.", t_small, t_large, "bounded"))
print("")
print("series to store, one counter each:")
print("  with raw path:        " + str(count_series(requests, [0, 1, 3])))
print("  with raw path + user: " + str(count_series(requests, [0, 1, 2, 3])))
print("  with templated path:  " + str(count_series(templated, [0, 1, 3])))
print("...and every one of them is retained for the full retention window.")
passed = 0
checked = 0
checked = checked + 1
if count_series(templated, [0, 1, 3]) == methods_expected * statuses_expected:
    passed = passed + 1
checked = checked + 1
if count_series(requests, [0, 1, 3]) > methods_expected * statuses_expected * 10:
    passed = passed + 1
checked = checked + 1
if unbounded == 2:
    flagged_bounded = 0
    for nm in unbounded_names:
        if nm == "method" or nm == "status":
            flagged_bounded = 1
    if flagged_bounded == 0:
        passed = passed + 1
checked = checked + 1
if t_small == t_large:
    passed = passed + 1
checked = checked + 1
if count_series(templated, [0, 1]) == count_series(requests, [0, 1]):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Two labels grow with traffic. The schema says nothing about which."
else:
    verdict = "FAILED - a labelling did not behave as the checks describe."
print(verdict)
print("")
n1 = "Whether a label is bounded is a fact about the DATA, and the only reliable"
print(n1)
n2 = "way to learn it is to count distinct values as traffic grows - which is a"
print(n2)
n3 = "measurement nobody runs, because the label was added to answer a question,"
print(n3)
n4 = "not to be studied. `method` and `endpoint` have the same type and one of"
print(n4)
n5 = "them is a time bomb."
print(n5)
```

## stdout (executed)

```text
labelling                        series
method                           4
method, status                   20
method, status, path             240
method, status, path, user       240
method, status, TEMPLATED path   20

predicted from the label domains:
  method x status                 20
  method x status x endpoint      20
actually observed:
  method x status                 20
  method x status x path          240
  method x status x templated     20

distinct values, 80 requests vs 240:
  method   4     4     bounded
  status   5     5     bounded
  user     80    240   GROWS
  path     80    240   GROWS
  templ.   1     1     bounded

series to store, one counter each:
  with raw path:        240
  with raw path + user: 240
  with templated path:  20
...and every one of them is retained for the full retention window.

checks passed: 5/5
Two labels grow with traffic. The schema says nothing about which.

Whether a label is bounded is a fact about the DATA, and the only reliable
way to learn it is to count distinct values as traffic grows - which is a
measurement nobody runs, because the label was added to answer a question,
not to be studied. `method` and `endpoint` have the same type and one of
them is a time bomb.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
