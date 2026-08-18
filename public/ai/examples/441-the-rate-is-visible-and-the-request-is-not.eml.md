<!-- canonical: efficientnewlanguage.org/ai/examples/441-the-rate-is-visible-and-the-request-is-not | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 441 — The rate is visible and the request is not

`the_rate_is_visible_and_the_request_is_not.eml` - The error rate is on the dashboard, correct to a tenth of a percent, and updated every minute. How many customer complaints it can resolve is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The error rate is
# on the dashboard, correct to a tenth of a percent, and updated every minute.
# How many customer complaints it can resolve is computed below.
#
# The rate is a good number. It answers whether the service is within its
# budget, whether today is worse than yesterday, and whether a deploy made
# things worse - three real questions, all of them about the population, all of
# them answered correctly and cheaply by one figure.
#
# A complaint is not about the population. It is about one request, and the
# rate does not contain requests; it contains a count of them. Going from the
# count back to the request is not a harder query, it is a query against data
# that was never kept.
#
# What each level of retention can answer is computed rather than asserted.

40000 => requests
1200 => failures
9 => complaints

def pct1(num, den):
    int(num * 1000 / den) => t
    return str(int(t / 10)) + "." + str(t % 10)

"requests today  : " + str(requests) ^0
"failures        : " + str(failures) ^0
"error rate      : " + pct1(failures, requests) + "%" ^0
"complaints filed: " + str(complaints) ^0
"" ^0

# ---- what each retention level can match ----
#
# A complaint arrives with a timestamp and an account. Matching it to a request
# needs that request to have been kept.

[0, 1, 10, 100] => sampling

"kept share   complaints matched   complaints needed for one match" ^0
for s in sampling:
    int(complaints * s / 100) => matched
    "" => needed
    if s == 0:
        "never" => needed
    else:
        str(int(100 / s)) => needed
    "  " + str(s) + "%          " + str(matched) + "                    " + needed ^0
"" ^0

int(complaints * 1 / 100) => at_one
if at_one == 0:
    "at 1% sampling the expected number matched is " + str(at_one) + ", so the" ^0
    "first " + str(int(100 / 1)) + " complaints are expected to produce none" ^0
"" ^0

# ---- the questions the rate answers well ----

int(failures * 1000 / requests) => rate_tenths
"the rate against a 3.0% budget" ^0
"  measured : " + pct1(failures, requests) + "%" ^0
if rate_tenths > 30:
    "  over budget by " + str(rate_tenths - 30) + " tenths of a point" ^0
elif rate_tenths == 30:
    "  exactly at budget, with nothing to spare" ^0
else:
    "  within budget, with " + str(30 - rate_tenths) + " tenths of a point to spare" ^0
"  this is a real decision and the rate is the right instrument for it" ^0
"" ^0

# ---- the same rate a month later ----

38000 => requests2
760 => failures2
"month over month" ^0
"  before : " + pct1(failures, requests) + "%" ^0
"  after  : " + pct1(failures2, requests2) + "%" ^0
int(failures2 * 1000 / requests2) => rate2_tenths
if rate2_tenths < rate_tenths:
    "  improved by " + str(rate_tenths - rate2_tenths) + " tenths of a point, which is real and worth having" ^0
"  failures remaining : " + str(failures2) ^0
"  complaints still unmatched : " + str(complaints) ^0
if failures2 > 0:
    "  the improvement does not name any of the " + str(failures2) + " that remain" ^0
"" ^0

# ---- what a complaint actually needs ----

"to answer one complaint you need, for one request" ^0
"  that it was recorded at all" ^0
"  the account it came from" ^0
"  what it was given back" ^0
"  none of the three is derivable from a rate, at any precision" ^0
"" ^0

"how much precision would help" ^0
"  the rate to a tenth      : " + pct1(failures, requests) + "%" ^0
"  the rate to a hundredth  : " + str(int(failures * 10000 / requests)) + " hundredths of a percent" ^0
"  complaints either one can resolve : 0" ^0
"  precision and identity are different axes, and only one of them is being" ^0
"  increased" ^0
"" ^0

# ---- what full retention costs and buys ----

"keeping every request id for a day" ^0
"  requests to store : " + str(requests) ^0
"  complaints resolvable : " + str(complaints) + " of " + str(complaints) ^0
"  and the rate is still computable from the same data, by counting it" ^0
"" ^0

# ---- the control: a number whose unit of action IS the aggregate ----
#
# Monthly spend is acted on as a total. There is no per-item question hiding
# behind it, so the aggregate is not standing in for anything.

18400 => spend
20000 => spend_cap
"control - this month's cloud spend" ^0
"  spend : " + str(spend) + " against a cap of " + str(spend_cap) ^0
if spend < spend_cap:
    "  under the cap by " + str(spend_cap - spend) + ", and the decision is about the total" ^0
"  no complaint here is about one dollar, so the aggregate is the whole answer" ^0
"" ^0

"The rate is accurate, cheap and the correct instrument for every question" ^0
"about the population. A complaint is a question about one request, and the" ^0
"rate is what is left after the requests are thrown away." ^0
```

## Python (deterministic transpilation)

```python
requests = 40000
failures = 1200
complaints = 9

def pct1(num, den):
    t = int(num * 1000 / den)
    return str(int(t / 10)) + "." + str(t % 10)

print("requests today  : " + str(requests))
print("failures        : " + str(failures))
print("error rate      : " + pct1(failures, requests) + "%")
print("complaints filed: " + str(complaints))
print("")
sampling = [0, 1, 10, 100]
print("kept share   complaints matched   complaints needed for one match")
for s in sampling:
    matched = int(complaints * s / 100)
    needed = ""
    if s == 0:
        needed = "never"
    else:
        needed = str(int(100 / s))
    print("  " + str(s) + "%          " + str(matched) + "                    " + needed)
print("")
at_one = int(complaints * 1 / 100)
if at_one == 0:
    print("at 1% sampling the expected number matched is " + str(at_one) + ", so the")
    print("first " + str(int(100 / 1)) + " complaints are expected to produce none")
print("")
rate_tenths = int(failures * 1000 / requests)
print("the rate against a 3.0% budget")
print("  measured : " + pct1(failures, requests) + "%")
if rate_tenths > 30:
    print("  over budget by " + str(rate_tenths - 30) + " tenths of a point")
elif rate_tenths == 30:
    print("  exactly at budget, with nothing to spare")
else:
    print("  within budget, with " + str(30 - rate_tenths) + " tenths of a point to spare")
print("  this is a real decision and the rate is the right instrument for it")
print("")
requests2 = 38000
failures2 = 760
print("month over month")
print("  before : " + pct1(failures, requests) + "%")
print("  after  : " + pct1(failures2, requests2) + "%")
rate2_tenths = int(failures2 * 1000 / requests2)
if rate2_tenths < rate_tenths:
    print("  improved by " + str(rate_tenths - rate2_tenths) + " tenths of a point, which is real and worth having")
print("  failures remaining : " + str(failures2))
print("  complaints still unmatched : " + str(complaints))
if failures2 > 0:
    print("  the improvement does not name any of the " + str(failures2) + " that remain")
print("")
print("to answer one complaint you need, for one request")
print("  that it was recorded at all")
print("  the account it came from")
print("  what it was given back")
print("  none of the three is derivable from a rate, at any precision")
print("")
print("how much precision would help")
print("  the rate to a tenth      : " + pct1(failures, requests) + "%")
print("  the rate to a hundredth  : " + str(int(failures * 10000 / requests)) + " hundredths of a percent")
print("  complaints either one can resolve : 0")
print("  precision and identity are different axes, and only one of them is being")
print("  increased")
print("")
print("keeping every request id for a day")
print("  requests to store : " + str(requests))
print("  complaints resolvable : " + str(complaints) + " of " + str(complaints))
print("  and the rate is still computable from the same data, by counting it")
print("")
spend = 18400
spend_cap = 20000
print("control - this month's cloud spend")
print("  spend : " + str(spend) + " against a cap of " + str(spend_cap))
if spend < spend_cap:
    print("  under the cap by " + str(spend_cap - spend) + ", and the decision is about the total")
print("  no complaint here is about one dollar, so the aggregate is the whole answer")
print("")
print("The rate is accurate, cheap and the correct instrument for every question")
print("about the population. A complaint is a question about one request, and the")
print("rate is what is left after the requests are thrown away.")
```

## stdout (executed)

```text
requests today  : 40000
failures        : 1200
error rate      : 3.0%
complaints filed: 9

kept share   complaints matched   complaints needed for one match
  0%          0                    never
  1%          0                    100
  10%          0                    10
  100%          9                    1

at 1% sampling the expected number matched is 0, so the
first 100 complaints are expected to produce none

the rate against a 3.0% budget
  measured : 3.0%
  exactly at budget, with nothing to spare
  this is a real decision and the rate is the right instrument for it

month over month
  before : 3.0%
  after  : 2.0%
  improved by 10 tenths of a point, which is real and worth having
  failures remaining : 760
  complaints still unmatched : 9
  the improvement does not name any of the 760 that remain

to answer one complaint you need, for one request
  that it was recorded at all
  the account it came from
  what it was given back
  none of the three is derivable from a rate, at any precision

how much precision would help
  the rate to a tenth      : 3.0%
  the rate to a hundredth  : 300 hundredths of a percent
  complaints either one can resolve : 0
  precision and identity are different axes, and only one of them is being
  increased

keeping every request id for a day
  requests to store : 40000
  complaints resolvable : 9 of 9
  and the rate is still computable from the same data, by counting it

control - this month's cloud spend
  spend : 18400 against a cap of 20000
  under the cap by 1600, and the decision is about the total
  no complaint here is about one dollar, so the aggregate is the whole answer

The rate is accurate, cheap and the correct instrument for every question
about the population. A complaint is a question about one request, and the
rate is what is left after the requests are thrown away.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
