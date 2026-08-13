<!-- canonical: efficientnewlanguage.org/ai/examples/371-two-findings-one-defect | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 371 — Two findings, one defect — 2 causes each, 1 in the intersection

`two_findings_one_defect.eml` measures what routing two reports to two owners destroys.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two findings,
# two owners, two fixes, one cause.
#
# The reports look unrelated: different symptom, different screen, different
# reporter, filed a week apart. They are routed to the two teams that own those
# screens, and each team does a competent job - finds a plausible local cause,
# corrects it, closes the finding with a passing test.
#
# Neither team is wrong about their own evidence. What is destroyed by the
# split is the INTERSECTION: each finding alone is consistent with two causes,
# and only together do they name one. Routing the two reports to two owners
# hands each of them the half that cannot decide.
#
# Nothing is declared. Each candidate cause is enabled alone and its witnesses
# are measured, so the consistency sets are computed rather than argued.

def weekday(day, bad_parser):
    if bad_parser == 1:
        return (day + 1) % 7
    return day % 7

def report_start(day, bad_parser, bad_report):
    weekday(day, bad_parser) => w
    if bad_report == 1:
        return (w + 1) % 7
    return w

def reminder_day(day, bad_parser, bad_sched):
    weekday(day, bad_parser) => w
    if bad_sched == 1:
        return (w + 1) % 7
    return w

def audit_day(day, bad_parser):
    return weekday(day, bad_parser)

def truth(day):
    return day % 7

[3, 10, 17, 24, 31] => days

# ---- the shipped system: only the shared parser is wrong ----

"the shipped system" ^0
0 => r_wrong
0 => s_wrong
0 => a_wrong
for d in days:
    if report_start(d, 1, 0) != truth(d):
        r_wrong + 1 => r_wrong
    if reminder_day(d, 1, 0) != truth(d):
        s_wrong + 1 => s_wrong
    if audit_day(d, 1) != truth(d):
        a_wrong + 1 => a_wrong
"  report screen wrong  : " + str(r_wrong) + " of " + str(len(days)) ^0
"  reminder mails wrong : " + str(s_wrong) + " of " + str(len(days)) ^0
"  audit log wrong      : " + str(a_wrong) + " of " + str(len(days)) + "   (nobody filed this one)" ^0
"" ^0

# ---- which single cause is consistent with which finding ----
#
# Enable one candidate cause at a time and see which findings it reproduces.

["shared parser", "report-local", "scheduler-local"] => candidates
"candidate causes, each enabled alone" ^0
0 => ci
[] => fits_f1
[] => fits_f2
[] => fits_both
for c in candidates:
    0 => bp
    0 => br
    0 => bs
    if ci == 0:
        1 => bp
    if ci == 1:
        1 => br
    if ci == 2:
        1 => bs
    0 => f1
    0 => f2
    for d in days:
        if report_start(d, bp, br) != truth(d):
            1 => f1
        if reminder_day(d, bp, bs) != truth(d):
            1 => f2
    if f1 == 1:
        fits_f1 + [c] => fits_f1
    if f2 == 1:
        fits_f2 + [c] => fits_f2
    if f1 == 1:
        if f2 == 1:
            fits_both + [c] => fits_both
    "  " + c + " : reproduces finding 1 = " + str(f1) + ", finding 2 = " + str(f2) ^0
    ci + 1 => ci
"" ^0
"causes consistent with finding 1 alone : " + str(len(fits_f1)) ^0
for c in fits_f1:
    "    " + c ^0
"causes consistent with finding 2 alone : " + str(len(fits_f2)) ^0
for c in fits_f2:
    "    " + c ^0
"causes consistent with BOTH            : " + str(len(fits_both)) ^0
for c in fits_both:
    "    " + c ^0
"" ^0

# ---- each owner fixes their own screen ----
#
# Owner A cannot change the shared parser (another team owns it), so the fix is
# a compensating offset in the report. Owner B does the same in the scheduler.

def report_patched(day, bad_parser):
    report_start(day, bad_parser, 0) => w
    return (w + 6) % 7

def reminder_patched(day, bad_parser):
    reminder_day(day, bad_parser, 0) => w
    return (w + 6) % 7

"after both owners patch their own screen" ^0
0 => rp
0 => sp
0 => ap
for d in days:
    if report_patched(d, 1) != truth(d):
        rp + 1 => rp
    if reminder_patched(d, 1) != truth(d):
        sp + 1 => sp
    if audit_day(d, 1) != truth(d):
        ap + 1 => ap
"  report screen wrong  : " + str(rp) ^0
"  reminder mails wrong : " + str(sp) ^0
"  audit log wrong      : " + str(ap) + "   still, and still unreported" ^0
0 => closed
if rp == 0:
    closed + 1 => closed
if sp == 0:
    closed + 1 => closed
["report", "scheduler"] => patched_sites
"  findings closed      : " + str(closed) ^0
"  compensating offsets now in the codebase : " + str(len(patched_sites)) ^0
"" ^0

# ---- fixing the one cause instead ----

"after fixing the shared parser" ^0
0 => rf
0 => sf
0 => af
for d in days:
    if report_start(d, 0, 0) != truth(d):
        rf + 1 => rf
    if reminder_day(d, 0, 0) != truth(d):
        sf + 1 => sf
    if audit_day(d, 0) != truth(d):
        af + 1 => af
"  report screen wrong  : " + str(rf) ^0
"  reminder mails wrong : " + str(sf) ^0
"  audit log wrong      : " + str(af) ^0
"  compensating offsets : 0" ^0
"" ^0

# ---- and the patches become defects the day the parser is fixed ----

"if the shared parser is fixed later, with the two patches still in place" ^0
0 => rr
0 => ss
for d in days:
    if report_patched(d, 0) != truth(d):
        rr + 1 => rr
    if reminder_patched(d, 0) != truth(d):
        ss + 1 => ss
"  report screen wrong  : " + str(rr) + " of " + str(len(days)) ^0
"  reminder mails wrong : " + str(ss) + " of " + str(len(days)) ^0
"" ^0

"Two findings is a count of reports. It was read as a count of defects, and" ^0
"the two numbers are produced by different processes - one by how many people" ^0
"looked, one by the code." ^0
```

## Python (deterministic transpilation)

```python
def weekday(day, bad_parser):
    if bad_parser == 1:
        return (day + 1) % 7
    return day % 7

def report_start(day, bad_parser, bad_report):
    w = weekday(day, bad_parser)
    if bad_report == 1:
        return (w + 1) % 7
    return w

def reminder_day(day, bad_parser, bad_sched):
    w = weekday(day, bad_parser)
    if bad_sched == 1:
        return (w + 1) % 7
    return w

def audit_day(day, bad_parser):
    return weekday(day, bad_parser)

def truth(day):
    return day % 7

days = [3, 10, 17, 24, 31]
print("the shipped system")
r_wrong = 0
s_wrong = 0
a_wrong = 0
for d in days:
    if report_start(d, 1, 0) != truth(d):
        r_wrong = r_wrong + 1
    if reminder_day(d, 1, 0) != truth(d):
        s_wrong = s_wrong + 1
    if audit_day(d, 1) != truth(d):
        a_wrong = a_wrong + 1
print("  report screen wrong  : " + str(r_wrong) + " of " + str(len(days)))
print("  reminder mails wrong : " + str(s_wrong) + " of " + str(len(days)))
print("  audit log wrong      : " + str(a_wrong) + " of " + str(len(days)) + "   (nobody filed this one)")
print("")
candidates = ["shared parser", "report-local", "scheduler-local"]
print("candidate causes, each enabled alone")
ci = 0
fits_f1 = []
fits_f2 = []
fits_both = []
for c in candidates:
    bp = 0
    br = 0
    bs = 0
    if ci == 0:
        bp = 1
    if ci == 1:
        br = 1
    if ci == 2:
        bs = 1
    f1 = 0
    f2 = 0
    for d in days:
        if report_start(d, bp, br) != truth(d):
            f1 = 1
        if reminder_day(d, bp, bs) != truth(d):
            f2 = 1
    if f1 == 1:
        fits_f1 = fits_f1 + [c]
    if f2 == 1:
        fits_f2 = fits_f2 + [c]
    if f1 == 1:
        if f2 == 1:
            fits_both = fits_both + [c]
    print("  " + c + " : reproduces finding 1 = " + str(f1) + ", finding 2 = " + str(f2))
    ci = ci + 1
print("")
print("causes consistent with finding 1 alone : " + str(len(fits_f1)))
for c in fits_f1:
    print("    " + c)
print("causes consistent with finding 2 alone : " + str(len(fits_f2)))
for c in fits_f2:
    print("    " + c)
print("causes consistent with BOTH            : " + str(len(fits_both)))
for c in fits_both:
    print("    " + c)
print("")

def report_patched(day, bad_parser):
    w = report_start(day, bad_parser, 0)
    return (w + 6) % 7

def reminder_patched(day, bad_parser):
    w = reminder_day(day, bad_parser, 0)
    return (w + 6) % 7

print("after both owners patch their own screen")
rp = 0
sp = 0
ap = 0
for d in days:
    if report_patched(d, 1) != truth(d):
        rp = rp + 1
    if reminder_patched(d, 1) != truth(d):
        sp = sp + 1
    if audit_day(d, 1) != truth(d):
        ap = ap + 1
print("  report screen wrong  : " + str(rp))
print("  reminder mails wrong : " + str(sp))
print("  audit log wrong      : " + str(ap) + "   still, and still unreported")
closed = 0
if rp == 0:
    closed = closed + 1
if sp == 0:
    closed = closed + 1
patched_sites = ["report", "scheduler"]
print("  findings closed      : " + str(closed))
print("  compensating offsets now in the codebase : " + str(len(patched_sites)))
print("")
print("after fixing the shared parser")
rf = 0
sf = 0
af = 0
for d in days:
    if report_start(d, 0, 0) != truth(d):
        rf = rf + 1
    if reminder_day(d, 0, 0) != truth(d):
        sf = sf + 1
    if audit_day(d, 0) != truth(d):
        af = af + 1
print("  report screen wrong  : " + str(rf))
print("  reminder mails wrong : " + str(sf))
print("  audit log wrong      : " + str(af))
print("  compensating offsets : 0")
print("")
print("if the shared parser is fixed later, with the two patches still in place")
rr = 0
ss = 0
for d in days:
    if report_patched(d, 0) != truth(d):
        rr = rr + 1
    if reminder_patched(d, 0) != truth(d):
        ss = ss + 1
print("  report screen wrong  : " + str(rr) + " of " + str(len(days)))
print("  reminder mails wrong : " + str(ss) + " of " + str(len(days)))
print("")
print("Two findings is a count of reports. It was read as a count of defects, and")
print("the two numbers are produced by different processes - one by how many people")
print("looked, one by the code.")
```

## stdout (executed)

```text
the shipped system
  report screen wrong  : 5 of 5
  reminder mails wrong : 5 of 5
  audit log wrong      : 5 of 5   (nobody filed this one)

candidate causes, each enabled alone
  shared parser : reproduces finding 1 = 1, finding 2 = 1
  report-local : reproduces finding 1 = 1, finding 2 = 0
  scheduler-local : reproduces finding 1 = 0, finding 2 = 1

causes consistent with finding 1 alone : 2
    shared parser
    report-local
causes consistent with finding 2 alone : 2
    shared parser
    scheduler-local
causes consistent with BOTH            : 1
    shared parser

after both owners patch their own screen
  report screen wrong  : 0
  reminder mails wrong : 0
  audit log wrong      : 5   still, and still unreported
  findings closed      : 2
  compensating offsets now in the codebase : 2

after fixing the shared parser
  report screen wrong  : 0
  reminder mails wrong : 0
  audit log wrong      : 0
  compensating offsets : 0

if the shared parser is fixed later, with the two patches still in place
  report screen wrong  : 5 of 5
  reminder mails wrong : 5 of 5

Two findings is a count of reports. It was read as a count of defects, and
the two numbers are produced by different processes - one by how many people
looked, one by the code.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
