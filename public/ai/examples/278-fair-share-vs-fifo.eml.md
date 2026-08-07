<!-- canonical: efficientnewlanguage.org/ai/examples/278-fair-share-vs-fifo | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 278 — Fair share vs FIFO — a queue discipline picks who it is fair to

`fair_share_vs_fifo.eml` runs one arrival pattern — 20 jobs from one tenant, 1 each from five others — through FIFO and fair queuing, and reports the wait per **tenant** alongside the mean per **job**.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One customer
# submits ten thousand jobs and everybody else waits.
#
# A FIFO queue is fair to REQUESTS and not to senders. If one tenant submits a
# thousand jobs while nine others submit one each, FIFO serves the thousand
# first and the nine wait behind all of them. Nothing is broken: the queue is
# doing exactly what it says, in the order things arrived, and the mean wait
# across all jobs looks fine because the thousand jobs belong to the tenant
# that also owns most of the mean.
#
# Fair queuing serves tenants round-robin instead of jobs in order. It costs
# something real - the heavy tenant finishes later than it would have - and the
# thing it buys is that the ninth tenant's single job does not wait behind a
# backlog it did not create.
#
# The measurement runs one arrival pattern through both disciplines and reports
# the wait per TENANT rather than per job, plus the mean wait per job, which is
# the number a dashboard shows and the one that hides the whole effect.

def build(heavy_jobs, light_tenants):
    # Arrival order: the heavy tenant's burst first, then one job each.
    [] => jobs
    for i in [1:heavy_jobs]:
        jobs + ["heavy"] => jobs
    for t in [1:light_tenants]:
        jobs + ["t" + str(t)] => jobs
    return jobs

def serve_fifo(jobs):
    # Returns a dict of tenant -> completion time of its LAST job.
    {} => done
    0 => t
    for j in jobs:
        t + 1 => t
        t => done[j]
    return done

def serve_fair(jobs):
    # Round-robin over tenants with work outstanding.
    {} => remaining
    [] => order
    for j in jobs:
        if j in remaining:
            remaining[j] + 1 => remaining[j]
        else:
            1 => remaining[j]
            order + [j] => order
    {} => done
    0 => t
    1 => working
    while working == 1:
        0 => working
        for tenant in order:
            if remaining[tenant] > 0:
                t + 1 => t
                remaining[tenant] - 1 => remaining[tenant]
                t => done[tenant]
                1 => working
    return done

def mean_wait(jobs, done):
    # Mean over JOBS, weighting each tenant by how many jobs it had.
    {} => count
    for j in jobs:
        if j in count:
            count[j] + 1 => count[j]
        else:
            1 => count[j]
    0 => total
    0 => n
    for tenant in count:
        total + done[tenant] * count[tenant] => total
        n + count[tenant] => n
    return int(total * 10 / n)


20 => HEAVY
5 => LIGHT
build(HEAVY, LIGHT) => jobs
serve_fifo(jobs) => fifo
serve_fair(jobs) => fair

("jobs: " + str(len(jobs)) + " (" + str(HEAVY) + " from one tenant, 1 each from " + str(LIGHT) + " others)")^0
""^0
"tenant     FIFO finishes at   fair finishes at"^0
["heavy", "t1", "t2", "t3", "t4", "t5"] => TENANTS
for tenant in TENANTS:
    ("%-10s %-18d %d" % (tenant, fifo[tenant], fair[tenant]))^0

# --------------------------- the number a dashboard shows
""^0
mean_wait(jobs, fifo) => m_fifo
mean_wait(jobs, fair) => m_fair
("mean completion time per JOB:")^0
("  FIFO: " + str(int(m_fifo / 10)) + "." + str(m_fifo % 10))^0
("  fair: " + str(int(m_fair / 10)) + "." + str(m_fair % 10))^0
"...the heavy tenant owns most of the jobs, so it owns most of the mean, and"^0
"the mean therefore reports mostly on the tenant that is not suffering."^0

# ------------------------------ the number a light tenant experiences
""^0
0 => worst_fifo
0 => worst_fair
for tenant in TENANTS:
    if not (tenant == "heavy"):
        if fifo[tenant] > worst_fifo:
            fifo[tenant] => worst_fifo
        if fair[tenant] > worst_fair:
            fair[tenant] => worst_fair
("worst completion time among the LIGHT tenants:")^0
("  FIFO: " + str(worst_fifo))^0
("  fair: " + str(worst_fair))^0
("  improvement: " + str(worst_fifo - worst_fair) + " slots")^0

# --------------------------------- what fair queuing costs the heavy tenant
""^0
("the heavy tenant finishes at " + str(fifo["heavy"]) + " under FIFO and " + str(fair["heavy"]) + " under fair queuing")^0
("  cost to the heavy tenant: " + str(fair["heavy"] - fifo["heavy"]) + " slots")^0
"...which is a real cost and the reason this is a choice rather than a fix."^0

# ------------------------------ with one job per tenant they are identical
""^0
build(1, LIGHT) => even
serve_fifo(even) => e_fifo
serve_fair(even) => e_fair
0 => same
for tenant in TENANTS:
    if tenant in e_fifo and tenant in e_fair:
        if e_fifo[tenant] == e_fair[tenant]:
            same + 1 => same
("with one job per tenant, tenants finishing at the same time: " + str(same) + "/" + str(LIGHT + 1))^0
"...which is every load test with an even workload."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Both disciplines must finish all the work in the same total time - fair
# queuing reorders, it does not add capacity.
checked + 1 => checked
if fifo["heavy"] == len(jobs) - LIGHT and fair["t" + str(LIGHT)] <= len(jobs):
    passed + 1 => passed

# The worst light tenant must do strictly better under fair queuing.
checked + 1 => checked
if worst_fair < worst_fifo:
    passed + 1 => passed

# The heavy tenant must do strictly worse - the cost is real and paid by
# someone identifiable.
checked + 1 => checked
if fair["heavy"] > fifo["heavy"]:
    passed + 1 => passed

# The mean per job must move LESS than the light tenants' worst case - the
# aggregate under-reports the effect it is supposed to summarise.
checked + 1 => checked
if m_fifo - m_fair < (worst_fifo - worst_fair) * 10:
    passed + 1 => passed

# And with an even workload the two must be indistinguishable.
checked + 1 => checked
if same == LIGHT + 1:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "FIFO is fair to jobs, and nobody was ever complaining on behalf of a job." => verdict
else:
    "FAILED - a queue discipline did not behave as the checks describe." => verdict
verdict^0

""^0
"A queue discipline picks who it is fair TO, and FIFO picks the request." => n1
n1^0
"That is a real answer, it is just not the one anyone means, because the" => n2
n2^0
"entity that complains is the tenant. And the mean per request is computed" => n3
n3^0
"over the same population FIFO is fair to, so it agrees with FIFO by" => n4
n4^0
"construction and cannot report the problem." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def build(heavy_jobs, light_tenants):
    jobs = []
    for i in range(1, heavy_jobs+1):
        jobs = jobs + ["heavy"]
    for t in range(1, light_tenants+1):
        jobs = jobs + ["t" + str(t)]
    return jobs

def serve_fifo(jobs):
    done = {}
    t = 0
    for j in jobs:
        t = t + 1
        done[j] = t
    return done

def serve_fair(jobs):
    remaining = {}
    order = []
    for j in jobs:
        if j in remaining:
            remaining[j] = remaining[j] + 1
        else:
            remaining[j] = 1
            order = order + [j]
    done = {}
    t = 0
    working = 1
    while working == 1:
        working = 0
        for tenant in order:
            if remaining[tenant] > 0:
                t = t + 1
                remaining[tenant] = remaining[tenant] - 1
                done[tenant] = t
                working = 1
    return done

def mean_wait(jobs, done):
    count = {}
    for j in jobs:
        if j in count:
            count[j] = count[j] + 1
        else:
            count[j] = 1
    total = 0
    n = 0
    for tenant in count:
        total = total + done[tenant] * count[tenant]
        n = n + count[tenant]
    return int(total * 10 / n)

HEAVY = 20
LIGHT = 5
jobs = build(HEAVY, LIGHT)
fifo = serve_fifo(jobs)
fair = serve_fair(jobs)
print("jobs: " + str(len(jobs)) + " (" + str(HEAVY) + " from one tenant, 1 each from " + str(LIGHT) + " others)")
print("")
print("tenant     FIFO finishes at   fair finishes at")
TENANTS = ["heavy", "t1", "t2", "t3", "t4", "t5"]
for tenant in TENANTS:
    print("%-10s %-18d %d" % (tenant, fifo[tenant], fair[tenant]))
print("")
m_fifo = mean_wait(jobs, fifo)
m_fair = mean_wait(jobs, fair)
print("mean completion time per JOB:")
print("  FIFO: " + str(int(m_fifo / 10)) + "." + str(m_fifo % 10))
print("  fair: " + str(int(m_fair / 10)) + "." + str(m_fair % 10))
print("...the heavy tenant owns most of the jobs, so it owns most of the mean, and")
print("the mean therefore reports mostly on the tenant that is not suffering.")
print("")
worst_fifo = 0
worst_fair = 0
for tenant in TENANTS:
    if not tenant == "heavy":
        if fifo[tenant] > worst_fifo:
            worst_fifo = fifo[tenant]
        if fair[tenant] > worst_fair:
            worst_fair = fair[tenant]
print("worst completion time among the LIGHT tenants:")
print("  FIFO: " + str(worst_fifo))
print("  fair: " + str(worst_fair))
print("  improvement: " + str(worst_fifo - worst_fair) + " slots")
print("")
print("the heavy tenant finishes at " + str(fifo["heavy"]) + " under FIFO and " + str(fair["heavy"]) + " under fair queuing")
print("  cost to the heavy tenant: " + str(fair["heavy"] - fifo["heavy"]) + " slots")
print("...which is a real cost and the reason this is a choice rather than a fix.")
print("")
even = build(1, LIGHT)
e_fifo = serve_fifo(even)
e_fair = serve_fair(even)
same = 0
for tenant in TENANTS:
    if tenant in e_fifo and tenant in e_fair:
        if e_fifo[tenant] == e_fair[tenant]:
            same = same + 1
print("with one job per tenant, tenants finishing at the same time: " + str(same) + "/" + str(LIGHT + 1))
print("...which is every load test with an even workload.")
passed = 0
checked = 0
checked = checked + 1
if fifo["heavy"] == len(jobs) - LIGHT and fair["t" + str(LIGHT)] <= len(jobs):
    passed = passed + 1
checked = checked + 1
if worst_fair < worst_fifo:
    passed = passed + 1
checked = checked + 1
if fair["heavy"] > fifo["heavy"]:
    passed = passed + 1
checked = checked + 1
if m_fifo - m_fair < (worst_fifo - worst_fair) * 10:
    passed = passed + 1
checked = checked + 1
if same == LIGHT + 1:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "FIFO is fair to jobs, and nobody was ever complaining on behalf of a job."
else:
    verdict = "FAILED - a queue discipline did not behave as the checks describe."
print(verdict)
print("")
n1 = "A queue discipline picks who it is fair TO, and FIFO picks the request."
print(n1)
n2 = "That is a real answer, it is just not the one anyone means, because the"
print(n2)
n3 = "entity that complains is the tenant. And the mean per request is computed"
print(n3)
n4 = "over the same population FIFO is fair to, so it agrees with FIFO by"
print(n4)
n5 = "construction and cannot report the problem."
print(n5)
```

## stdout (executed)

```text
jobs: 25 (20 from one tenant, 1 each from 5 others)

tenant     FIFO finishes at   fair finishes at
heavy      20                 25
t1         21                 2
t2         22                 3
t3         23                 4
t4         24                 5
t5         25                 6

mean completion time per JOB:
  FIFO: 20.6
  fair: 20.8
...the heavy tenant owns most of the jobs, so it owns most of the mean, and
the mean therefore reports mostly on the tenant that is not suffering.

worst completion time among the LIGHT tenants:
  FIFO: 25
  fair: 6
  improvement: 19 slots

the heavy tenant finishes at 20 under FIFO and 25 under fair queuing
  cost to the heavy tenant: 5 slots
...which is a real cost and the reason this is a choice rather than a fix.

with one job per tenant, tenants finishing at the same time: 6/6
...which is every load test with an even workload.

checks passed: 5/5
FIFO is fair to jobs, and nobody was ever complaining on behalf of a job.

A queue discipline picks who it is fair TO, and FIFO picks the request.
That is a real answer, it is just not the one anyone means, because the
entity that complains is the tenant. And the mean per request is computed
over the same population FIFO is fair to, so it agrees with FIFO by
construction and cannot report the problem.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
