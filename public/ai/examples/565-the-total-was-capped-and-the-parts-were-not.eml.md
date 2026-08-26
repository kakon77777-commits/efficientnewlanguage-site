<!-- canonical: efficientnewlanguage.org/ai/examples/565-the-total-was-capped-and-the-parts-were-not | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 565 — The total was capped and the parts were not

`the_total_was_capped_and_the_parts_were_not.eml` - The cloud account has a hard spending cap of 10000 a month. Eight services share it. On day 7 the cap fired. Which services stopped is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The cloud account
# has a hard spending cap of 10000 a month. Eight services share it. On day 7
# the cap fired. Which services stopped is computed below.
#
# A cap on the account total is the right control and it was argued for at the
# top level, correctly. It is the number the finance team is accountable for.
# It is the only figure that cannot be gamed by moving spend between line items.
# It needs no per-service forecast, so it does not go stale when a service is
# added, and adding a service does not require anyone to re-derive a budget. One
# number, one owner, one alarm.
#
# A cap is a shared resource, and a shared resource with no per-holder limit is
# consumed by whoever consumes fastest. The service that spends the budget is
# not the service that the cap stops - the cap stops everyone, and it stops them
# in the order their next request happens to arrive, which is unrelated to who
# spent the money.
#
# The runaway service is also the one that reaches the cap first and therefore
# gets the most work done before it fires.

10000 => budget
8 => services
40 => normal_per_day
1200 => runaway_per_day
30 => days_in_month

"budget            : " + str(budget) + " per month" ^0
"services sharing it: " + str(services) ^0
"normal spend      : " + str(normal_per_day) + " per service per day" ^0
"normal month total: " + str(services * normal_per_day * days_in_month) + ", which fits" ^0
"" ^0

# ---- one service starts spending 30 times its normal rate ----

((services - 1) * normal_per_day) + runaway_per_day => daily_total

"service X develops a retry loop and spends " + str(runaway_per_day) + " a day" ^0
"account now spends " + str(daily_total) + " a day" ^0
"" ^0

"day   spend that day   cumulative   cap" ^0
0 => spent
0 => cap_day
for d in [1:10]:
    if spent + daily_total <= budget:
        spent + daily_total => spent
        "  " + str(d) + "      " + str(daily_total) + "            " + str(spent) + "        " + str(budget) ^0
    else:
        if cap_day == 0:
            d => cap_day
"" ^0
"  the cap fired on day " + str(cap_day) ^0
"" ^0

# ---- who spent it and who paid for it ----

cap_day - 1 => full_days
runaway_per_day * full_days => x_spent
(services - 1) * normal_per_day * full_days => others_spent

"through day " + str(full_days) ^0
"  service X spent   : " + str(x_spent) + ", which is " + str(int(x_spent * 100 / spent)) + " percent of the budget" ^0
"  the other " + str(services - 1) + " spent : " + str(others_spent) + ", which is " + str(int(others_spent * 100 / spent)) + " percent" ^0
"" ^0
"after the cap fires" ^0
days_in_month - full_days => days_stopped
"  services stopped  : " + str(services) ^0
"  days stopped      : " + str(days_stopped) ^0
"  service-days lost : " + str(services * days_stopped) ^0
"  service-days lost by the service that caused it : " + str(days_stopped) ^0
"  service-days lost by services that did nothing  : " + str((services - 1) * days_stopped) ^0
"" ^0

"  " + str(int((services - 1) * 100 / services)) + " percent of the harm landed on services with no defect" ^0
"" ^0

# ---- the same budget, divided ----
#
# Give each service its own cap of budget/services. Nothing else changes: same
# total, same alarm, same finance number.

int(budget / services) => per_service_cap
int(per_service_cap / runaway_per_day) => x_days_until_own_cap
normal_per_day * days_in_month => normal_month_spend

"per-service cap of " + str(per_service_cap) ^0
"  service X hits its own cap on day  : " + str(x_days_until_own_cap + 1) ^0
"  X spends at most                   : " + str(per_service_cap) ^0
"  a healthy service spends all month : " + str(normal_month_spend) ^0
"  is that under its cap              : " + str(per_service_cap - normal_month_spend) + " to spare" ^0
"  services stopped                   : 1" ^0
"" ^0
"  affected services: " + str(services) + " under one shared cap, 1 under divided caps" ^0
"  the total, the alarm and the finance number are unchanged" ^0
"" ^0

# ---- the shape of the problem ----

"a cap on a sum, with no cap on the terms" ^0
"  bounds the total                        yes, exactly" ^0
"  bounds any single term                  no" ^0
"  stops the term that consumed the budget  no, it stops all of them" ^0
"  fires earlier the worse the runaway is   yes, which shortens the warning" ^0
"  the alarm and the outage are the same event, so there is no interval in" ^0
"  which anyone could have acted" ^0
"" ^0

# ---- the control ----
#
# The cap did its job. The account did not overspend by one unit. Every promise
# the control made was kept, which is why no one reviewed it.

"control - what the cap was built to guarantee" ^0
"  budget          : " + str(budget) ^0
"  actually spent  : " + str(spent) ^0
"  overspend       : " + str(spent - budget) ^0
"  the cap held, and it would have held against any runaway of any size" ^0
"  a control can be perfectly effective and still be aimed at the wrong risk" ^0
"" ^0

# ---- the null control ----
#
# The same single shared cap, with no runaway. Eight well-behaved services
# spend 9600 of 10000 and the cap never fires. The shared cap is not a defect
# on its own; it is a defect exactly when one term can grow without bound.

services * normal_per_day * days_in_month => quiet_month

"null control - the same shared cap, no runaway service" ^0
"  spend for the month : " + str(quiet_month) ^0
"  budget              : " + str(budget) ^0
"  cap fires           : no, " + str(budget - quiet_month) + " to spare" ^0
"  services stopped    : 0" ^0
"  the identical control, and for eleven months it was the right one" ^0
"" ^0

"A cap on the account total is the figure finance is accountable for, it cannot" ^0
"be gamed by moving spend between line items, and it does not need a per-service" ^0
"forecast that goes stale. It held: " + str(spent) + " against a budget of " + str(budget) + ", overspend" ^0
str(spent - budget) + ". It fired on day " + str(cap_day) + ", after one service had taken " + str(int(x_spent * 100 / spent)) + " percent of the" ^0
"month, and it stopped all " + str(services) + " of them for " + str(days_stopped) + " days." ^0
```

## Python (deterministic transpilation)

```python
budget = 10000
services = 8
normal_per_day = 40
runaway_per_day = 1200
days_in_month = 30
print("budget            : " + str(budget) + " per month")
print("services sharing it: " + str(services))
print("normal spend      : " + str(normal_per_day) + " per service per day")
print("normal month total: " + str(services * normal_per_day * days_in_month) + ", which fits")
print("")
daily_total = (services - 1) * normal_per_day + runaway_per_day
print("service X develops a retry loop and spends " + str(runaway_per_day) + " a day")
print("account now spends " + str(daily_total) + " a day")
print("")
print("day   spend that day   cumulative   cap")
spent = 0
cap_day = 0
for d in range(1, 11):
    if spent + daily_total <= budget:
        spent = spent + daily_total
        print("  " + str(d) + "      " + str(daily_total) + "            " + str(spent) + "        " + str(budget))
    elif cap_day == 0:
        cap_day = d
print("")
print("  the cap fired on day " + str(cap_day))
print("")
full_days = cap_day - 1
x_spent = runaway_per_day * full_days
others_spent = (services - 1) * normal_per_day * full_days
print("through day " + str(full_days))
print("  service X spent   : " + str(x_spent) + ", which is " + str(int(x_spent * 100 / spent)) + " percent of the budget")
print("  the other " + str(services - 1) + " spent : " + str(others_spent) + ", which is " + str(int(others_spent * 100 / spent)) + " percent")
print("")
print("after the cap fires")
days_stopped = days_in_month - full_days
print("  services stopped  : " + str(services))
print("  days stopped      : " + str(days_stopped))
print("  service-days lost : " + str(services * days_stopped))
print("  service-days lost by the service that caused it : " + str(days_stopped))
print("  service-days lost by services that did nothing  : " + str((services - 1) * days_stopped))
print("")
print("  " + str(int((services - 1) * 100 / services)) + " percent of the harm landed on services with no defect")
print("")
per_service_cap = int(budget / services)
x_days_until_own_cap = int(per_service_cap / runaway_per_day)
normal_month_spend = normal_per_day * days_in_month
print("per-service cap of " + str(per_service_cap))
print("  service X hits its own cap on day  : " + str(x_days_until_own_cap + 1))
print("  X spends at most                   : " + str(per_service_cap))
print("  a healthy service spends all month : " + str(normal_month_spend))
print("  is that under its cap              : " + str(per_service_cap - normal_month_spend) + " to spare")
print("  services stopped                   : 1")
print("")
print("  affected services: " + str(services) + " under one shared cap, 1 under divided caps")
print("  the total, the alarm and the finance number are unchanged")
print("")
print("a cap on a sum, with no cap on the terms")
print("  bounds the total                        yes, exactly")
print("  bounds any single term                  no")
print("  stops the term that consumed the budget  no, it stops all of them")
print("  fires earlier the worse the runaway is   yes, which shortens the warning")
print("  the alarm and the outage are the same event, so there is no interval in")
print("  which anyone could have acted")
print("")
print("control - what the cap was built to guarantee")
print("  budget          : " + str(budget))
print("  actually spent  : " + str(spent))
print("  overspend       : " + str(spent - budget))
print("  the cap held, and it would have held against any runaway of any size")
print("  a control can be perfectly effective and still be aimed at the wrong risk")
print("")
quiet_month = services * normal_per_day * days_in_month
print("null control - the same shared cap, no runaway service")
print("  spend for the month : " + str(quiet_month))
print("  budget              : " + str(budget))
print("  cap fires           : no, " + str(budget - quiet_month) + " to spare")
print("  services stopped    : 0")
print("  the identical control, and for eleven months it was the right one")
print("")
print("A cap on the account total is the figure finance is accountable for, it cannot")
print("be gamed by moving spend between line items, and it does not need a per-service")
print("forecast that goes stale. It held: " + str(spent) + " against a budget of " + str(budget) + ", overspend")
print(str(spent - budget) + ". It fired on day " + str(cap_day) + ", after one service had taken " + str(int(x_spent * 100 / spent)) + " percent of the")
print("month, and it stopped all " + str(services) + " of them for " + str(days_stopped) + " days.")
```

## stdout (executed)

```text
budget            : 10000 per month
services sharing it: 8
normal spend      : 40 per service per day
normal month total: 9600, which fits

service X develops a retry loop and spends 1200 a day
account now spends 1480 a day

day   spend that day   cumulative   cap
  1      1480            1480        10000
  2      1480            2960        10000
  3      1480            4440        10000
  4      1480            5920        10000
  5      1480            7400        10000
  6      1480            8880        10000

  the cap fired on day 7

through day 6
  service X spent   : 7200, which is 81 percent of the budget
  the other 7 spent : 1680, which is 18 percent

after the cap fires
  services stopped  : 8
  days stopped      : 24
  service-days lost : 192
  service-days lost by the service that caused it : 24
  service-days lost by services that did nothing  : 168

  87 percent of the harm landed on services with no defect

per-service cap of 1250
  service X hits its own cap on day  : 2
  X spends at most                   : 1250
  a healthy service spends all month : 1200
  is that under its cap              : 50 to spare
  services stopped                   : 1

  affected services: 8 under one shared cap, 1 under divided caps
  the total, the alarm and the finance number are unchanged

a cap on a sum, with no cap on the terms
  bounds the total                        yes, exactly
  bounds any single term                  no
  stops the term that consumed the budget  no, it stops all of them
  fires earlier the worse the runaway is   yes, which shortens the warning
  the alarm and the outage are the same event, so there is no interval in
  which anyone could have acted

control - what the cap was built to guarantee
  budget          : 10000
  actually spent  : 8880
  overspend       : -1120
  the cap held, and it would have held against any runaway of any size
  a control can be perfectly effective and still be aimed at the wrong risk

null control - the same shared cap, no runaway service
  spend for the month : 9600
  budget              : 10000
  cap fires           : no, 400 to spare
  services stopped    : 0
  the identical control, and for eleven months it was the right one

A cap on the account total is the figure finance is accountable for, it cannot
be gamed by moving spend between line items, and it does not need a per-service
forecast that goes stale. It held: 8880 against a budget of 10000, overspend
-1120. It fired on day 7, after one service had taken 81 percent of the
month, and it stopped all 8 of them for 24 days.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
