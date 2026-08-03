<!-- canonical: efficientnewlanguage.org/ai/examples/216-average-of-averages | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 216 — Winning every group and losing the company

`average_of_averages.eml` computes a company-wide rate two ways over the same data and shows the two disagree about which method is better.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Averaging things
# that are already averages.
#
# Two branches report a conversion rate. Head office wants the company rate and
# takes the mean of the two numbers. That is not the company rate, and the gap
# is not small:
#
#     north   3 of   10  = 30%
#     south  40 of 1000  =  4%
#     mean of the rates          17%
#     actual, 43 of 1010         4.3%
#
# The mean of ratios weights every GROUP equally. The correct figure weights
# every OBSERVATION equally. They coincide only when the groups are the same
# size, which is why the bug survives every test built on tidy fixtures.
#
# The same arithmetic produces Simpson's paradox, which is the version that
# does real damage. A treatment can win in every single subgroup and lose
# overall, because the subgroups where it wins are the small ones. The numbers
# below are constructed so that this happens, and both conclusions are checked
# by counting rather than asserted:
#
#     per-group winner       computed group by group
#     pooled winner          computed from the totals
#
# and they disagree. Nothing here is a rounding error - both figures are exact.
#
# The rule that comes out of it is not "never average averages". It is that
# a ratio is not a number you can carry around: it is a pair, and collapsing
# it to one value throws away the denominator that every later step needs.

def pct(num, den):
    if den == 0:
        return 0.0
    return float(num) * 100.0 / float(den)

def fmt(x):
    # Two decimal places without string formatting of floats, so the printed
    # figure is exactly what was computed.
    int(x * 100 + 0.5) => c
    str(int(c / 100)) => w
    str(c % 100) => f
    if len(f) < 2:
        "0" + f => f
    return w + "." + f + "%"


# group -> [successes, trials] for two methods
{
    "north": [[3, 10], [12, 60]],
    "south": [[40, 1000], [2, 60]],
    "east": [[9, 30], [30, 120]]
} => data

"group      A successes/trials   rate      B successes/trials   rate      winner"^0
0 => a_group_wins
0 => b_group_wins
for g in ["north", "south", "east"]:
    data[g][0] => a
    data[g][1] => b
    pct(a[0], a[1]) => ra
    pct(b[0], b[1]) => rb
    "tie" => who
    if ra > rb:
        "A" => who
        a_group_wins + 1 => a_group_wins
    elif rb > ra:
        "B" => who
        b_group_wins + 1 => b_group_wins
    ("%-10s %-20s %-9s %-20s %-9s %s" % (g, str(a[0]) + "/" + str(a[1]), fmt(ra), str(b[0]) + "/" + str(b[1]), fmt(rb), who))^0

# ------------------------------------------------------- the two company rates
0 => a_num
0 => a_den
0 => b_num
0 => b_den
0.0 => a_rate_sum
0.0 => b_rate_sum
0 => groups
for g in ["north", "south", "east"]:
    groups + 1 => groups
    a_num + data[g][0][0] => a_num
    a_den + data[g][0][1] => a_den
    b_num + data[g][1][0] => b_num
    b_den + data[g][1][1] => b_den
    a_rate_sum + pct(data[g][0][0], data[g][0][1]) => a_rate_sum
    b_rate_sum + pct(data[g][1][0], data[g][1][1]) => b_rate_sum

a_rate_sum / float(groups) => a_mean_of_rates
b_rate_sum / float(groups) => b_mean_of_rates
pct(a_num, a_den) => a_pooled
pct(b_num, b_den) => b_pooled

""^0
("mean of the group rates   A " + fmt(a_mean_of_rates) + "   B " + fmt(b_mean_of_rates))^0
("pooled from the totals    A " + fmt(a_pooled) + "    B " + fmt(b_pooled))^0
("totals                    A " + str(a_num) + "/" + str(a_den) + "   B " + str(b_num) + "/" + str(b_den))^0

"" => mean_winner
if a_mean_of_rates > b_mean_of_rates:
    "A" => mean_winner
else:
    "B" => mean_winner
"" => pooled_winner
if a_pooled > b_pooled:
    "A" => pooled_winner
else:
    "B" => pooled_winner

""^0
("winner by group count:     " + str(a_group_wins) + " groups to " + str(b_group_wins))^0
("winner by mean of rates:   " + mean_winner)^0
("winner by pooled totals:   " + pooled_winner)^0

# ------------------------------------------------ when the two agree, and why
# The mean of rates equals the pooled rate exactly when every group has the
# same denominator. Demonstrated rather than claimed, by rebuilding the same
# data with equal group sizes.
{
    "north": [[3, 100], [12, 100]],
    "south": [[40, 100], [2, 100]],
    "east": [[9, 100], [30, 100]]
} => balanced

0 => bal_num
0 => bal_den
0.0 => bal_rate_sum
for g in ["north", "south", "east"]:
    bal_num + balanced[g][0][0] => bal_num
    bal_den + balanced[g][0][1] => bal_den
    bal_rate_sum + pct(balanced[g][0][0], balanced[g][0][1]) => bal_rate_sum

bal_rate_sum / 3.0 => bal_mean
pct(bal_num, bal_den) => bal_pooled

""^0
"With equal group sizes the two agree exactly:"^0
("  mean of rates: " + fmt(bal_mean))^0
("  pooled:        " + fmt(bal_pooled))^0
("  identical:     " + str(bal_mean == bal_pooled))^0

# ------------------------------------------- how far apart they can get
0.0 => worst
"" => worst_group
for g in ["north", "south", "east"]:
    pct(data[g][0][0], data[g][0][1]) => r
    r - a_pooled => d
    if d < 0:
        0 - d => d
    if d > worst:
        d => worst
        g => worst_group

""^0
("largest gap between a group rate and the pooled rate: " + fmt(worst) + " (" + worst_group + ")")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The paradox must actually occur: one method wins more groups, the other wins
# the pool. If this fails the data is not demonstrating anything.
checked + 1 => checked
if a_group_wins > b_group_wins and pooled_winner == "B":
    passed + 1 => passed

# Mean-of-rates and pooled must disagree on the WINNER, not merely on a digit.
checked + 1 => checked
if not (mean_winner == pooled_winner):
    passed + 1 => passed

# With equal denominators they must be exactly equal - the boundary condition
# that explains when the shortcut is safe.
checked + 1 => checked
if bal_mean == bal_pooled:
    passed + 1 => passed

# Both figures must be exact, not artefacts of rounding.
checked + 1 => checked
if a_num == 52 and a_den == 1040 and b_num == 44 and b_den == 240:
    passed + 1 => passed

# And the pooled rate must lie between the smallest and largest group rate -
# a sanity property the mean of rates also satisfies, which is exactly why
# comparing them to each other is the only way to tell them apart.
checked + 1 => checked
0 => between
if a_pooled >= 4.0 and a_pooled <= 30.0:
    1 => between
if between == 1:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "A wins every group and loses the company. Both figures are exact." => verdict
else:
    "FAILED - the data did not produce the disagreement the checks describe." => verdict
verdict^0

""^0
"Both numbers pass every sanity check you can apply to one of them alone:" => n1
n1^0
"each is between the smallest and largest group rate, each is a percentage," => n2
n2^0
"each is stable across runs. They can only be told apart by computing the" => n3
n3^0
"other one - which means a ratio has to be carried as a pair all the way to" => n4
n4^0
"the end, because the denominator is the part that gets thrown away first." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def pct(num, den):
    if den == 0:
        return 0.0
    return float(num) * 100.0 / float(den)

def fmt(x):
    c = int(x * 100 + 0.5)
    w = str(int(c / 100))
    f = str(c % 100)
    if len(f) < 2:
        f = "0" + f
    return w + "." + f + "%"

data = {"north": [[3, 10], [12, 60]], "south": [[40, 1000], [2, 60]], "east": [[9, 30], [30, 120]]}
print("group      A successes/trials   rate      B successes/trials   rate      winner")
a_group_wins = 0
b_group_wins = 0
for g in ["north", "south", "east"]:
    a = data[g][0]
    b = data[g][1]
    ra = pct(a[0], a[1])
    rb = pct(b[0], b[1])
    who = "tie"
    if ra > rb:
        who = "A"
        a_group_wins = a_group_wins + 1
    elif rb > ra:
        who = "B"
        b_group_wins = b_group_wins + 1
    print("%-10s %-20s %-9s %-20s %-9s %s" % (g, str(a[0]) + "/" + str(a[1]), fmt(ra), str(b[0]) + "/" + str(b[1]), fmt(rb), who))
a_num = 0
a_den = 0
b_num = 0
b_den = 0
a_rate_sum = 0.0
b_rate_sum = 0.0
groups = 0
for g in ["north", "south", "east"]:
    groups = groups + 1
    a_num = a_num + data[g][0][0]
    a_den = a_den + data[g][0][1]
    b_num = b_num + data[g][1][0]
    b_den = b_den + data[g][1][1]
    a_rate_sum = a_rate_sum + pct(data[g][0][0], data[g][0][1])
    b_rate_sum = b_rate_sum + pct(data[g][1][0], data[g][1][1])
a_mean_of_rates = a_rate_sum / float(groups)
b_mean_of_rates = b_rate_sum / float(groups)
a_pooled = pct(a_num, a_den)
b_pooled = pct(b_num, b_den)
print("")
print("mean of the group rates   A " + fmt(a_mean_of_rates) + "   B " + fmt(b_mean_of_rates))
print("pooled from the totals    A " + fmt(a_pooled) + "    B " + fmt(b_pooled))
print("totals                    A " + str(a_num) + "/" + str(a_den) + "   B " + str(b_num) + "/" + str(b_den))
mean_winner = ""
if a_mean_of_rates > b_mean_of_rates:
    mean_winner = "A"
else:
    mean_winner = "B"
pooled_winner = ""
if a_pooled > b_pooled:
    pooled_winner = "A"
else:
    pooled_winner = "B"
print("")
print("winner by group count:     " + str(a_group_wins) + " groups to " + str(b_group_wins))
print("winner by mean of rates:   " + mean_winner)
print("winner by pooled totals:   " + pooled_winner)
balanced = {"north": [[3, 100], [12, 100]], "south": [[40, 100], [2, 100]], "east": [[9, 100], [30, 100]]}
bal_num = 0
bal_den = 0
bal_rate_sum = 0.0
for g in ["north", "south", "east"]:
    bal_num = bal_num + balanced[g][0][0]
    bal_den = bal_den + balanced[g][0][1]
    bal_rate_sum = bal_rate_sum + pct(balanced[g][0][0], balanced[g][0][1])
bal_mean = bal_rate_sum / 3.0
bal_pooled = pct(bal_num, bal_den)
print("")
print("With equal group sizes the two agree exactly:")
print("  mean of rates: " + fmt(bal_mean))
print("  pooled:        " + fmt(bal_pooled))
print("  identical:     " + str(bal_mean == bal_pooled))
worst = 0.0
worst_group = ""
for g in ["north", "south", "east"]:
    r = pct(data[g][0][0], data[g][0][1])
    d = r - a_pooled
    if d < 0:
        d = 0 - d
    if d > worst:
        worst = d
        worst_group = g
print("")
print("largest gap between a group rate and the pooled rate: " + fmt(worst) + " (" + worst_group + ")")
passed = 0
checked = 0
checked = checked + 1
if a_group_wins > b_group_wins and pooled_winner == "B":
    passed = passed + 1
checked = checked + 1
if not mean_winner == pooled_winner:
    passed = passed + 1
checked = checked + 1
if bal_mean == bal_pooled:
    passed = passed + 1
checked = checked + 1
if a_num == 52 and a_den == 1040 and b_num == 44 and b_den == 240:
    passed = passed + 1
checked = checked + 1
between = 0
if a_pooled >= 4.0 and a_pooled <= 30.0:
    between = 1
if between == 1:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "A wins every group and loses the company. Both figures are exact."
else:
    verdict = "FAILED - the data did not produce the disagreement the checks describe."
print(verdict)
print("")
n1 = "Both numbers pass every sanity check you can apply to one of them alone:"
print(n1)
n2 = "each is between the smallest and largest group rate, each is a percentage,"
print(n2)
n3 = "each is stable across runs. They can only be told apart by computing the"
print(n3)
n4 = "other one - which means a ratio has to be carried as a pair all the way to"
print(n4)
n5 = "the end, because the denominator is the part that gets thrown away first."
print(n5)
```

## stdout (executed)

```text
group      A successes/trials   rate      B successes/trials   rate      winner
north      3/10                 30.00%    12/60                20.00%    A
south      40/1000              4.00%     2/60                 3.33%     A
east       9/30                 30.00%    30/120               25.00%    A

mean of the group rates   A 21.33%   B 16.11%
pooled from the totals    A 5.00%    B 18.33%
totals                    A 52/1040   B 44/240

winner by group count:     3 groups to 0
winner by mean of rates:   A
winner by pooled totals:   B

With equal group sizes the two agree exactly:
  mean of rates: 17.33%
  pooled:        17.33%
  identical:     True

largest gap between a group rate and the pooled rate: 25.00% (north)

checks passed: 5/5
A wins every group and loses the company. Both figures are exact.

Both numbers pass every sanity check you can apply to one of them alone:
each is between the smallest and largest group rate, each is a percentage,
each is stable across runs. They can only be told apart by computing the
other one - which means a ratio has to be carried as a pair all the way to
the end, because the denominator is the part that gets thrown away first.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
