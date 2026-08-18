<!-- canonical: efficientnewlanguage.org/ai/examples/432-each-team-minimised-its-own-cost | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 432 — Each team minimised its own cost

`each_team_minimised_its_own_cost.eml` - Four teams, four correct decisions, one total. Whether the total is the smallest available is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Four teams, four
# correct decisions, one total. Whether the total is the smallest available is
# computed below.
#
# Each team did the arithmetic properly. Each compared the options in front of
# it, picked the cheapest for the budget it is accountable for, and can produce
# the spreadsheet. Nobody was lazy and nobody was empire-building.
#
# A local minimum is a minimum over the options one team can choose between.
# Some of the cost of a choice lands on a different team, and that part is not
# in the spreadsheet - not because it was hidden, but because it is not a
# number that team is given.
#
# Both totals are computed from the same option table.

# [team, option, cost to this team, cost to everyone else]
[["ingest", "batch hourly", 10, 0], ["ingest", "stream", 25, 0]] => ingest_opts
[["store", "compress", 8, 12], ["store", "raw", 20, 0]] => store_opts
[["serve", "cache 24h", 5, 18], ["serve", "cache 1h", 14, 3]] => serve_opts
[["report", "nightly rebuild", 6, 9], ["report", "incremental", 22, 0]] => report_opts

def local_pick(opts):
    0 => bi
    opts[0][2] => best
    1 => i
    for o in opts:
        if o[2] < best:
            o[2] => best
            i - 1 => bi
        i + 1 => i
    return bi

def global_pick(opts):
    0 => bi
    opts[0][2] + opts[0][3] => best
    1 => i
    for o in opts:
        if o[2] + o[3] < best:
            o[2] + o[3] => best
            i - 1 => bi
        i + 1 => i
    return bi

[ingest_opts, store_opts, serve_opts, report_opts] => teams

"team      local choice        cost here   cost elsewhere   total" ^0
0 => local_total
0 => local_here
for t in teams:
    local_pick(t) => k
    t[k] => o
    local_total + o[2] + o[3] => local_total
    local_here + o[2] => local_here
    "  " + o[0] + "   " + o[1] + "   " + str(o[2]) + "          " + str(o[3]) + "               " + str(o[2] + o[3]) ^0
"  total                                                    " + str(local_total) ^0
"" ^0

"team      total-cost choice   cost here   cost elsewhere   total" ^0
0 => global_total
0 => global_here
for t in teams:
    global_pick(t) => k
    t[k] => o
    global_total + o[2] + o[3] => global_total
    global_here + o[2] => global_here
    "  " + o[0] + "   " + o[1] + "   " + str(o[2]) + "          " + str(o[3]) + "               " + str(o[2] + o[3]) ^0
"  total                                                    " + str(global_total) ^0
"" ^0

if global_total < local_total:
    "choosing on the total costs " + str(local_total - global_total) + " less than four correct local choices" ^0
elif global_total == local_total:
    "the two totals are equal, so the local choices were already optimal" ^0
else:
    "the local choices came out cheaper on the total, which cannot happen" ^0
"" ^0

# ---- who pays for the better total ----
#
# The saving is not free to everybody. It is paid by the teams whose own line
# goes up, and that is the reason the local choice is stable.

"what changes for each team's own budget" ^0
0 => worse_off
for t in teams:
    local_pick(t) => lk
    global_pick(t) => gk
    if not (lk == gk):
        t[lk][2] => was
        t[gk][2] => now
        "  " + t[0][0] + " : " + str(was) + " to " + str(now) ^0
        if now > was:
            worse_off + 1 => worse_off
if worse_off > 0:
    "  team budgets that go up : " + str(worse_off) + ", and each is measured on that line" ^0
"  the total falls anyway, because the increase is smaller than what it saves" ^0
"" ^0

"the two totals, by whose budget they land in" ^0
"  local choices  : " + str(local_here) + " on the deciding teams, " + str(local_total - local_here) + " elsewhere" ^0
"  total choices  : " + str(global_here) + " on the deciding teams, " + str(global_total - global_here) + " elsewhere" ^0
if global_here > local_here:
    "  the deciding teams pay " + str(global_here - local_here) + " more to save " + str(local_total - global_total) + " overall" ^0
"" ^0

# ---- what each team can see ----

"the number each team is given" ^0
"  its own line   : yes" ^0
"  the other line : no, it is a different team's budget" ^0
"  a team choosing on what it can see chooses the left column every time," ^0
"  and being given the second number is the whole intervention" ^0
"" ^0

# ---- the control: a team whose choice has no external cost ----
#
# Where every option costs nothing to anyone else, the local minimum is the
# global one and no coordination is needed.

0 => i_local
0 => i_global
local_pick(ingest_opts) => il
global_pick(ingest_opts) => ig
ingest_opts[il][2] + ingest_opts[il][3] => i_local
ingest_opts[ig][2] + ingest_opts[ig][3] => i_global
"control - the ingest team, whose options cost nobody else anything" ^0
"  local choice total : " + str(i_local) + ", total-cost choice : " + str(i_global) ^0
if i_local == i_global:
    "  the same option under both rules, so this team cannot show the gap" ^0
"" ^0

"Each team compared its options correctly and picked the cheapest. The" ^0
"cheapest of what a team is shown is a different quantity from the cheapest" ^0
"available, and the difference is the column nobody hands them." ^0
```

## Python (deterministic transpilation)

```python
ingest_opts = [["ingest", "batch hourly", 10, 0], ["ingest", "stream", 25, 0]]
store_opts = [["store", "compress", 8, 12], ["store", "raw", 20, 0]]
serve_opts = [["serve", "cache 24h", 5, 18], ["serve", "cache 1h", 14, 3]]
report_opts = [["report", "nightly rebuild", 6, 9], ["report", "incremental", 22, 0]]

def local_pick(opts):
    bi = 0
    best = opts[0][2]
    i = 1
    for o in opts:
        if o[2] < best:
            best = o[2]
            bi = i - 1
        i = i + 1
    return bi

def global_pick(opts):
    bi = 0
    best = opts[0][2] + opts[0][3]
    i = 1
    for o in opts:
        if o[2] + o[3] < best:
            best = o[2] + o[3]
            bi = i - 1
        i = i + 1
    return bi

teams = [ingest_opts, store_opts, serve_opts, report_opts]
print("team      local choice        cost here   cost elsewhere   total")
local_total = 0
local_here = 0
for t in teams:
    k = local_pick(t)
    o = t[k]
    local_total = local_total + o[2] + o[3]
    local_here = local_here + o[2]
    print("  " + o[0] + "   " + o[1] + "   " + str(o[2]) + "          " + str(o[3]) + "               " + str(o[2] + o[3]))
print("  total                                                    " + str(local_total))
print("")
print("team      total-cost choice   cost here   cost elsewhere   total")
global_total = 0
global_here = 0
for t in teams:
    k = global_pick(t)
    o = t[k]
    global_total = global_total + o[2] + o[3]
    global_here = global_here + o[2]
    print("  " + o[0] + "   " + o[1] + "   " + str(o[2]) + "          " + str(o[3]) + "               " + str(o[2] + o[3]))
print("  total                                                    " + str(global_total))
print("")
if global_total < local_total:
    print("choosing on the total costs " + str(local_total - global_total) + " less than four correct local choices")
elif global_total == local_total:
    print("the two totals are equal, so the local choices were already optimal")
else:
    print("the local choices came out cheaper on the total, which cannot happen")
print("")
print("what changes for each team's own budget")
worse_off = 0
for t in teams:
    lk = local_pick(t)
    gk = global_pick(t)
    if not lk == gk:
        was = t[lk][2]
        now = t[gk][2]
        print("  " + t[0][0] + " : " + str(was) + " to " + str(now))
        if now > was:
            worse_off = worse_off + 1
if worse_off > 0:
    print("  team budgets that go up : " + str(worse_off) + ", and each is measured on that line")
print("  the total falls anyway, because the increase is smaller than what it saves")
print("")
print("the two totals, by whose budget they land in")
print("  local choices  : " + str(local_here) + " on the deciding teams, " + str(local_total - local_here) + " elsewhere")
print("  total choices  : " + str(global_here) + " on the deciding teams, " + str(global_total - global_here) + " elsewhere")
if global_here > local_here:
    print("  the deciding teams pay " + str(global_here - local_here) + " more to save " + str(local_total - global_total) + " overall")
print("")
print("the number each team is given")
print("  its own line   : yes")
print("  the other line : no, it is a different team's budget")
print("  a team choosing on what it can see chooses the left column every time,")
print("  and being given the second number is the whole intervention")
print("")
i_local = 0
i_global = 0
il = local_pick(ingest_opts)
ig = global_pick(ingest_opts)
i_local = ingest_opts[il][2] + ingest_opts[il][3]
i_global = ingest_opts[ig][2] + ingest_opts[ig][3]
print("control - the ingest team, whose options cost nobody else anything")
print("  local choice total : " + str(i_local) + ", total-cost choice : " + str(i_global))
if i_local == i_global:
    print("  the same option under both rules, so this team cannot show the gap")
print("")
print("Each team compared its options correctly and picked the cheapest. The")
print("cheapest of what a team is shown is a different quantity from the cheapest")
print("available, and the difference is the column nobody hands them.")
```

## stdout (executed)

```text
team      local choice        cost here   cost elsewhere   total
  ingest   batch hourly   10          0               10
  store   compress   8          12               20
  serve   cache 24h   5          18               23
  report   nightly rebuild   6          9               15
  total                                                    68

team      total-cost choice   cost here   cost elsewhere   total
  ingest   batch hourly   10          0               10
  store   compress   8          12               20
  serve   cache 1h   14          3               17
  report   nightly rebuild   6          9               15
  total                                                    62

choosing on the total costs 6 less than four correct local choices

what changes for each team's own budget
  serve : 5 to 14
  team budgets that go up : 1, and each is measured on that line
  the total falls anyway, because the increase is smaller than what it saves

the two totals, by whose budget they land in
  local choices  : 29 on the deciding teams, 39 elsewhere
  total choices  : 38 on the deciding teams, 24 elsewhere
  the deciding teams pay 9 more to save 6 overall

the number each team is given
  its own line   : yes
  the other line : no, it is a different team's budget
  a team choosing on what it can see chooses the left column every time,
  and being given the second number is the whole intervention

control - the ingest team, whose options cost nobody else anything
  local choice total : 10, total-cost choice : 10
  the same option under both rules, so this team cannot show the gap

Each team compared its options correctly and picked the cheapest. The
cheapest of what a team is shown is a different quantity from the cheapest
available, and the difference is the column nobody hands them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
