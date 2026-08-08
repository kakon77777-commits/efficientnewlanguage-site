<!-- canonical: efficientnewlanguage.org/ai/examples/292-count-leaks-hidden-items | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 292 — Count leaks hidden items — the rows were filtered and the total was not

`count_leaks_hidden_items.eml` pages through a listing as four viewers, compares what the header claims against what the pages deliver, and then runs the attack that difference enables.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The rows are
# filtered and the total is not, so the total is a readout of what was
# filtered.
#
# A listing endpoint does two things: fetch a page of rows and report how many
# rows there are. The filter that enforces visibility is applied where the
# rows are rendered, because that is where "which rows can this viewer see"
# is obviously needed. The count is computed from the query, because that is
# where counting obviously belongs. Both are correct in isolation.
#
# What leaks is not a row. It is the DIFFERENCE between two numbers, and the
# viewer can compute it without seeing anything they are not allowed to see.
# A confidential record is invisible and countable, and countable is enough
# to answer questions about it.
#
# The measurement pages through the listing as each viewer, compares what the
# header claims against what the pages deliver, and then runs the attack the
# leak enables: narrowing a filter until the reported total changes tells the
# viewer a property of a record they cannot read.

def visible_to(row, viewer):
    # row is [id, dept, level, title]. "public" rows are visible to everyone;
    # restricted rows only to their own department.
    row[2] => level
    if level == "public":
        return 1
    if viewer == row[1]:
        return 1
    return 0

def matching(rows, dept):
    # The query. Visibility is not its business - and that is the whole point,
    # because the count is taken here.
    [] => out
    for r in rows:
        if dept == "*":
            out + [r] => out
        elif r[1] == dept:
            out + [r] => out
    return out

def page_of(rows, viewer, dept, start, size):
    # The renderer. Visibility IS its business, applied after the slice.
    matching(rows, dept) => q
    q[start:start + size] => window
    [] => out
    for r in window:
        if visible_to(r, viewer) == 1:
            out + [r] => out
    return out

def reported_total(rows, dept):
    # The header. Counts the query, not the page.
    return len(matching(rows, dept))

def truly_visible(rows, viewer, dept):
    # What the viewer is actually entitled to see. Computed here only so the
    # measurement has something to compare against; no endpoint computes it.
    0 => n
    for r in matching(rows, dept):
        if visible_to(r, viewer) == 1:
            n + 1 => n
    return n

# id, dept, level, title
[["r1", "eng", "public", "Release notes"],
 ["r2", "eng", "restricted", "Incident 4471"],
 ["r3", "hr", "public", "Holiday policy"],
 ["r4", "hr", "restricted", "Severance plan"],
 ["r5", "hr", "restricted", "Case 88"],
 ["r6", "legal", "restricted", "Settlement draft"],
 ["r7", "eng", "public", "Style guide"]] => ROWS

["eng", "hr", "legal", "sales"] => VIEWERS
3 => PAGE

"viewer  filter  header-says  rows-delivered  gap"^0
"------- ------- -----------  --------------  ---"^0

0 => rows_ever_leaked
0 => listings
0 => listings_with_a_gap
for viewer in VIEWERS:
    for dept in ["*", "hr"]:
        reported_total(ROWS, dept) => claimed
        0 => delivered
        0 => start
        while start < claimed:
            page_of(ROWS, viewer, dept, start, PAGE) => pg
            delivered + len(pg) => delivered
            start + PAGE => start
        claimed - delivered => gap
        listings + 1 => listings
        if gap > 0:
            listings_with_a_gap + 1 => listings_with_a_gap

        # No row the viewer may not see is ever rendered. That has to be true,
        # or the case would be about a much simpler bug.
        0 => start
        while start < claimed:
            for r in page_of(ROWS, viewer, dept, start, PAGE):
                if visible_to(r, viewer) == 0:
                    rows_ever_leaked + 1 => rows_ever_leaked
            start + PAGE => start

        ((viewer + "       ")[0:7] + " " + (dept + "       ")[0:7] + " " + (str(claimed) + "           ")[0:12] + " " + (str(delivered) + "              ")[0:15] + " " + str(gap))^0

""^0
("listings: " + str(listings) + ", of which the header over-claims: " + str(listings_with_a_gap))^0
("rows rendered that the viewer may not see: " + str(rows_ever_leaked))^0

""^0
"what the gap is worth to someone who cannot read a single hidden row"^0

# The attack. The viewer never reads a restricted row; they read the header
# while narrowing the filter, and the header answers questions about rows
# they cannot see. Each department is probed by an outsider - someone whose
# own department is different - and the header still reports the size.
for probe in ["eng", "hr", "legal", "sales"]:
    reported_total(ROWS, probe) => claimed
    truly_visible(ROWS, "sales", probe) => seen_by_outsider
    ((probe + "      ")[0:6] + " an outsider is shown " + str(seen_by_outsider) + " rows and told the total is " + str(claimed) + " -> restricted rows: " + str(claimed - seen_by_outsider))^0

""^0
"the same leak, as a yes/no oracle"^0

# Sharper: the outsider learns a property of a specific hidden record by
# watching whether the total moves. Nothing they receive contains the record.
0 => oracle_answers
for r in ROWS:
    if visible_to(r, "sales") == 0:
        # Ask "is there a record in this department?" using only the header.
        reported_total(ROWS, r[1]) => claimed
        truly_visible(ROWS, "sales", r[1]) => seen
        if claimed > seen:
            oracle_answers + 1 => oracle_answers
("hidden records whose existence the header confirms to an outsider: " + str(oracle_answers))^0

""^0
0 => checked
0 => passed

# The header must over-claim somewhere, or there is nothing here.
checked + 1 => checked
if listings_with_a_gap > 0:
    passed + 1 => passed

# And it must be silent about the rows themselves. The leak is arithmetic,
# not a rendered row - if a row escaped, the case would be describing a
# different and much more ordinary bug.
checked + 1 => checked
if rows_ever_leaked == 0:
    passed + 1 => passed

# Every hidden record must be confirmable by an outsider through the header
# alone. Not "some" - the oracle is total, because a count is total.
checked + 1 => checked
0 => hidden_from_sales
for r in ROWS:
    if visible_to(r, "sales") == 0:
        hidden_from_sales + 1 => hidden_from_sales
if oracle_answers == hidden_from_sales:
    passed + 1 => passed

# There must actually be hidden records, or the previous check passes on an
# empty set.
checked + 1 => checked
if hidden_from_sales >= 3:
    passed + 1 => passed

# Paging must terminate against the claimed total and still come up short -
# the loop bound is the header's number, which is exactly why an honest
# client cannot tell it is missing rows rather than reaching the end.
checked + 1 => checked
reported_total(ROWS, "*") => all_claimed
truly_visible(ROWS, "sales", "*") => all_seen
if all_claimed > all_seen:
    if all_seen > 0:
        passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "No hidden row was rendered, and every hidden row was counted." => verdict
else:
    "FAILED - the listing did not behave as the checks describe." => verdict
verdict^0

""^0
"Access control was applied to the rows and not to the aggregate, because"^0
"an aggregate does not look like data. It is: a count is a projection of"^0
"the same records, and projecting a record you may not read is reading it"^0
"at lower resolution. The review that catches this asks not 'which rows"^0
"can this viewer see' but 'which QUESTIONS can this viewer ask', and a"^0
"total is a question."^0
```

## Python (deterministic transpilation)

```python
def visible_to(row, viewer):
    level = row[2]
    if level == "public":
        return 1
    if viewer == row[1]:
        return 1
    return 0

def matching(rows, dept):
    out = []
    for r in rows:
        if dept == "*":
            out = out + [r]
        elif r[1] == dept:
            out = out + [r]
    return out

def page_of(rows, viewer, dept, start, size):
    q = matching(rows, dept)
    window = q[start:start + size]
    out = []
    for r in window:
        if visible_to(r, viewer) == 1:
            out = out + [r]
    return out

def reported_total(rows, dept):
    return len(matching(rows, dept))

def truly_visible(rows, viewer, dept):
    n = 0
    for r in matching(rows, dept):
        if visible_to(r, viewer) == 1:
            n = n + 1
    return n

ROWS = [["r1", "eng", "public", "Release notes"], ["r2", "eng", "restricted", "Incident 4471"], ["r3", "hr", "public", "Holiday policy"], ["r4", "hr", "restricted", "Severance plan"], ["r5", "hr", "restricted", "Case 88"], ["r6", "legal", "restricted", "Settlement draft"], ["r7", "eng", "public", "Style guide"]]
VIEWERS = ["eng", "hr", "legal", "sales"]
PAGE = 3
print("viewer  filter  header-says  rows-delivered  gap")
print("------- ------- -----------  --------------  ---")
rows_ever_leaked = 0
listings = 0
listings_with_a_gap = 0
for viewer in VIEWERS:
    for dept in ["*", "hr"]:
        claimed = reported_total(ROWS, dept)
        delivered = 0
        start = 0
        while start < claimed:
            pg = page_of(ROWS, viewer, dept, start, PAGE)
            delivered = delivered + len(pg)
            start = start + PAGE
        gap = claimed - delivered
        listings = listings + 1
        if gap > 0:
            listings_with_a_gap = listings_with_a_gap + 1
        start = 0
        while start < claimed:
            for r in page_of(ROWS, viewer, dept, start, PAGE):
                if visible_to(r, viewer) == 0:
                    rows_ever_leaked = rows_ever_leaked + 1
            start = start + PAGE
        print((viewer + "       ")[0:7] + " " + (dept + "       ")[0:7] + " " + (str(claimed) + "           ")[0:12] + " " + (str(delivered) + "              ")[0:15] + " " + str(gap))
print("")
print("listings: " + str(listings) + ", of which the header over-claims: " + str(listings_with_a_gap))
print("rows rendered that the viewer may not see: " + str(rows_ever_leaked))
print("")
print("what the gap is worth to someone who cannot read a single hidden row")
for probe in ["eng", "hr", "legal", "sales"]:
    claimed = reported_total(ROWS, probe)
    seen_by_outsider = truly_visible(ROWS, "sales", probe)
    print((probe + "      ")[0:6] + " an outsider is shown " + str(seen_by_outsider) + " rows and told the total is " + str(claimed) + " -> restricted rows: " + str(claimed - seen_by_outsider))
print("")
print("the same leak, as a yes/no oracle")
oracle_answers = 0
for r in ROWS:
    if visible_to(r, "sales") == 0:
        claimed = reported_total(ROWS, r[1])
        seen = truly_visible(ROWS, "sales", r[1])
        if claimed > seen:
            oracle_answers = oracle_answers + 1
print("hidden records whose existence the header confirms to an outsider: " + str(oracle_answers))
print("")
checked = 0
passed = 0
checked = checked + 1
if listings_with_a_gap > 0:
    passed = passed + 1
checked = checked + 1
if rows_ever_leaked == 0:
    passed = passed + 1
checked = checked + 1
hidden_from_sales = 0
for r in ROWS:
    if visible_to(r, "sales") == 0:
        hidden_from_sales = hidden_from_sales + 1
if oracle_answers == hidden_from_sales:
    passed = passed + 1
checked = checked + 1
if hidden_from_sales >= 3:
    passed = passed + 1
checked = checked + 1
all_claimed = reported_total(ROWS, "*")
all_seen = truly_visible(ROWS, "sales", "*")
if all_claimed > all_seen:
    if all_seen > 0:
        passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "No hidden row was rendered, and every hidden row was counted."
else:
    verdict = "FAILED - the listing did not behave as the checks describe."
print(verdict)
print("")
print("Access control was applied to the rows and not to the aggregate, because")
print("an aggregate does not look like data. It is: a count is a projection of")
print("the same records, and projecting a record you may not read is reading it")
print("at lower resolution. The review that catches this asks not 'which rows")
print("can this viewer see' but 'which QUESTIONS can this viewer ask', and a")
print("total is a question.")
```

## stdout (executed)

```text
viewer  filter  header-says  rows-delivered  gap
------- ------- -----------  --------------  ---
eng     *       7            4               3
eng     hr      3            1               2
hr      *       7            5               2
hr      hr      3            3               0
legal   *       7            4               3
legal   hr      3            1               2
sales   *       7            3               4
sales   hr      3            1               2

listings: 8, of which the header over-claims: 7
rows rendered that the viewer may not see: 0

what the gap is worth to someone who cannot read a single hidden row
eng    an outsider is shown 2 rows and told the total is 3 -> restricted rows: 1
hr     an outsider is shown 1 rows and told the total is 3 -> restricted rows: 2
legal  an outsider is shown 0 rows and told the total is 1 -> restricted rows: 1
sales  an outsider is shown 0 rows and told the total is 0 -> restricted rows: 0

the same leak, as a yes/no oracle
hidden records whose existence the header confirms to an outsider: 4

checks passed: 5/5
No hidden row was rendered, and every hidden row was counted.

Access control was applied to the rows and not to the aggregate, because
an aggregate does not look like data. It is: a count is a projection of
the same records, and projecting a record you may not read is reading it
at lower resolution. The review that catches this asks not 'which rows
can this viewer see' but 'which QUESTIONS can this viewer ask', and a
total is a question.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
