<!-- canonical: efficientnewlanguage.org/ai/examples/750-the-backlog-was-counted-in-items-and-the-items-grew | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 750 — The backlog was counted in items and the items grew

`the_backlog_was_counted_in_items_and_the_items_grew.eml` - The backlog is tracked as a count of unprocessed items, charted daily, and it has been flat for a year. What a flat count means is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The backlog is
# tracked as a count of unprocessed items, charted daily, and it has been flat
# for a year. What a flat count means is computed below.
#
# Tracking it is better than not, and the chart is honest. The count is taken
# from the store rather than from the worker's own opinion, it is charted daily
# so a trend is visible rather than a snapshot, the target was agreed rather
# than assumed, and the number has genuinely not moved: the backlog held between
# eleven and thirteen thousand items every week of the year.
#
# The count is of ITEMS. An item is a document to be indexed, and the mean
# document has grown from four kilobytes to thirty-one over the same year,
# because the product started accepting attachments.
#
# The work is in the bytes.

12000 => items_in_the_backlog
4 => mean_item_kilobytes_a_year_ago
31 => mean_item_kilobytes_now
365 => days_charted
0 => charts_of_the_backlog_in_bytes
1 => targets_agreed_with_the_business
0 => alerts_on_the_mean_item_size

items_in_the_backlog * mean_item_kilobytes_a_year_ago => backlog_kilobytes_a_year_ago
items_in_the_backlog * mean_item_kilobytes_now => backlog_kilobytes_now
backlog_kilobytes_now - backlog_kilobytes_a_year_ago => kilobytes_added_with_no_change_in_the_count
int(mean_item_kilobytes_now * 100 / mean_item_kilobytes_a_year_ago) => size_now_as_percent_of_then

"items in the backlog            : " + str(items_in_the_backlog) ^0
"days charted                    : " + str(days_charted) ^0
"targets agreed with the business: " + str(targets_agreed_with_the_business) ^0
"charts of the backlog in bytes  : " + str(charts_of_the_backlog_in_bytes) ^0
"" ^0
"mean item, KB a year ago        : " + str(mean_item_kilobytes_a_year_ago) ^0
"mean item, KB now               : " + str(mean_item_kilobytes_now) ^0
"  as a percent of then          : " + str(size_now_as_percent_of_then) ^0
"alerts on the mean item size    : " + str(alerts_on_the_mean_item_size) ^0
"" ^0
"backlog KB a year ago           : " + str(backlog_kilobytes_a_year_ago) ^0
"backlog KB now                  : " + str(backlog_kilobytes_now) ^0
"  added while the count held flat : " + str(kilobytes_added_with_no_change_in_the_count) ^0
"" ^0

# ---- what the chart verified ----

"the backlog chart" ^0
"  where the number comes from : the store, not the" ^0
"    worker's own opinion" ^0
"  charted : daily, so a trend is visible rather than a" ^0
"    snapshot" ^0
"  target : agreed, not assumed" ^0
"  days charted : " + str(days_charted) ^0
"  has the number moved : no; between eleven and thirteen" ^0
"    thousand every week" ^0
"  verdict : STABLE, AND HONESTLY MEASURED" ^0
"" ^0
"  reading the count from the store rather than from the" ^0
"  consumer is the difference between a metric and a" ^0
"  self-report, and it was done" ^0
"" ^0

# ---- what an item is ----

"the counted unit" ^0
"  what one item is : a document to be indexed" ^0
"  what indexing one costs : proportional to its bytes" ^0
"  mean bytes a year ago : " + str(mean_item_kilobytes_a_year_ago) + " KB" ^0
"  mean bytes now        : " + str(mean_item_kilobytes_now) + " KB" ^0
"  why : the product started accepting attachments" ^0
"  charts in bytes : " + str(charts_of_the_backlog_in_bytes) ^0
"" ^0
"  the count is exact and the unit it counts changed size" ^0
"  underneath it" ^0
"" ^0

# ---- the flat line is the finding ----

# Holding the count flat while each item grew by a factor means the workers
# absorbed the growth. The chart records the absence of a change in a number
# whose stability now costs eight times what it did.
"what a flat line meant then and now" ^0
"  a year ago : the workers keep up with the arrival rate" ^0
"  now        : the workers keep up with an arrival rate" ^0
"    carrying " + str(size_now_as_percent_of_then) + " percent of the bytes" ^0
"  did anything about the chart change : no" ^0
"  did anything about the system change : the work per" ^0
"    item, by that factor" ^0
"  bytes added while the line stayed flat : " ^0
"    " + str(kilobytes_added_with_no_change_in_the_count) + " KB" ^0
"" ^0

# ---- what the target means now ----

"the agreed target" ^0
"  what it says : keep the backlog under a count" ^0
"  when it was agreed : when an item was " + str(mean_item_kilobytes_a_year_ago) + " KB" ^0
"  what it constrains today : a queue holding " ^0
"    " + str(backlog_kilobytes_now) + " KB" ^0
"  was the target renegotiated : it did not appear to need" ^0
"    renegotiating; the number it names is inside it" ^0
"  alerts on the quantity that moved : " ^0
"    " + str(alerts_on_the_mean_item_size) ^0
"" ^0

# ---- null control ----

# The same chart, with the backlog also plotted in bytes, and the target
# expressed in the quantity the workers actually spend.
1 => nc_charts_of_the_backlog_in_bytes
1 => nc_alerts_on_the_mean_item_size

"null control - plot the backlog in bytes as well" ^0
"  items in the backlog : " + str(items_in_the_backlog) + ", unchanged and still exact" ^0
"  charts in bytes : " + str(nc_charts_of_the_backlog_in_bytes) ^0
"  alerts on the mean item size : " + str(nc_alerts_on_the_mean_item_size) ^0
"  the count did not become wrong; a second line appeared" ^0
"  in the unit the work is denominated in" ^0
"" ^0

# ---- the rule ----

"what a flat backlog count guarantees" ^0
"  the number of unprocessed items is not growing :" ^0
"    exactly, measured from the store, charted daily for" ^0
"    " + str(days_charted) + " days" ^0
"  the backlog is not growing : not addressed; the count" ^0
"    is in items and the work is in bytes, and nothing" ^0
"    holds the conversion still" ^0
"" ^0
"a count is a measurement only while the thing counted keeps" ^0
"its size; where the unit can grow, a flat line records that" ^0
"the growth was absorbed rather than that it did not happen" ^0
"" ^0

"The chart is honestly built - read from the store rather than the worker, drawn" ^0
"daily for " + str(days_charted) + " days against an agreed target - and the count has genuinely not" ^0
"moved. It counts items, and the mean item went from " + str(mean_item_kilobytes_a_year_ago) + " KB to " + str(mean_item_kilobytes_now) + ", " ^0
str(size_now_as_percent_of_then) + " percent of what it was, so " + str(kilobytes_added_with_no_change_in_the_count) + " KB entered the backlog while the" ^0
"line stayed flat, under " + str(charts_of_the_backlog_in_bytes) + " charts in bytes and " + str(alerts_on_the_mean_item_size) + " alerts on the size." ^0
```

## Python (deterministic transpilation)

```python
items_in_the_backlog = 12000
mean_item_kilobytes_a_year_ago = 4
mean_item_kilobytes_now = 31
days_charted = 365
charts_of_the_backlog_in_bytes = 0
targets_agreed_with_the_business = 1
alerts_on_the_mean_item_size = 0
backlog_kilobytes_a_year_ago = items_in_the_backlog * mean_item_kilobytes_a_year_ago
backlog_kilobytes_now = items_in_the_backlog * mean_item_kilobytes_now
kilobytes_added_with_no_change_in_the_count = backlog_kilobytes_now - backlog_kilobytes_a_year_ago
size_now_as_percent_of_then = int(mean_item_kilobytes_now * 100 / mean_item_kilobytes_a_year_ago)
print("items in the backlog            : " + str(items_in_the_backlog))
print("days charted                    : " + str(days_charted))
print("targets agreed with the business: " + str(targets_agreed_with_the_business))
print("charts of the backlog in bytes  : " + str(charts_of_the_backlog_in_bytes))
print("")
print("mean item, KB a year ago        : " + str(mean_item_kilobytes_a_year_ago))
print("mean item, KB now               : " + str(mean_item_kilobytes_now))
print("  as a percent of then          : " + str(size_now_as_percent_of_then))
print("alerts on the mean item size    : " + str(alerts_on_the_mean_item_size))
print("")
print("backlog KB a year ago           : " + str(backlog_kilobytes_a_year_ago))
print("backlog KB now                  : " + str(backlog_kilobytes_now))
print("  added while the count held flat : " + str(kilobytes_added_with_no_change_in_the_count))
print("")
print("the backlog chart")
print("  where the number comes from : the store, not the")
print("    worker's own opinion")
print("  charted : daily, so a trend is visible rather than a")
print("    snapshot")
print("  target : agreed, not assumed")
print("  days charted : " + str(days_charted))
print("  has the number moved : no; between eleven and thirteen")
print("    thousand every week")
print("  verdict : STABLE, AND HONESTLY MEASURED")
print("")
print("  reading the count from the store rather than from the")
print("  consumer is the difference between a metric and a")
print("  self-report, and it was done")
print("")
print("the counted unit")
print("  what one item is : a document to be indexed")
print("  what indexing one costs : proportional to its bytes")
print("  mean bytes a year ago : " + str(mean_item_kilobytes_a_year_ago) + " KB")
print("  mean bytes now        : " + str(mean_item_kilobytes_now) + " KB")
print("  why : the product started accepting attachments")
print("  charts in bytes : " + str(charts_of_the_backlog_in_bytes))
print("")
print("  the count is exact and the unit it counts changed size")
print("  underneath it")
print("")
print("what a flat line meant then and now")
print("  a year ago : the workers keep up with the arrival rate")
print("  now        : the workers keep up with an arrival rate")
print("    carrying " + str(size_now_as_percent_of_then) + " percent of the bytes")
print("  did anything about the chart change : no")
print("  did anything about the system change : the work per")
print("    item, by that factor")
print("  bytes added while the line stayed flat : ")
print("    " + str(kilobytes_added_with_no_change_in_the_count) + " KB")
print("")
print("the agreed target")
print("  what it says : keep the backlog under a count")
print("  when it was agreed : when an item was " + str(mean_item_kilobytes_a_year_ago) + " KB")
print("  what it constrains today : a queue holding ")
print("    " + str(backlog_kilobytes_now) + " KB")
print("  was the target renegotiated : it did not appear to need")
print("    renegotiating; the number it names is inside it")
print("  alerts on the quantity that moved : ")
print("    " + str(alerts_on_the_mean_item_size))
print("")
nc_charts_of_the_backlog_in_bytes = 1
nc_alerts_on_the_mean_item_size = 1
print("null control - plot the backlog in bytes as well")
print("  items in the backlog : " + str(items_in_the_backlog) + ", unchanged and still exact")
print("  charts in bytes : " + str(nc_charts_of_the_backlog_in_bytes))
print("  alerts on the mean item size : " + str(nc_alerts_on_the_mean_item_size))
print("  the count did not become wrong; a second line appeared")
print("  in the unit the work is denominated in")
print("")
print("what a flat backlog count guarantees")
print("  the number of unprocessed items is not growing :")
print("    exactly, measured from the store, charted daily for")
print("    " + str(days_charted) + " days")
print("  the backlog is not growing : not addressed; the count")
print("    is in items and the work is in bytes, and nothing")
print("    holds the conversion still")
print("")
print("a count is a measurement only while the thing counted keeps")
print("its size; where the unit can grow, a flat line records that")
print("the growth was absorbed rather than that it did not happen")
print("")
print("The chart is honestly built - read from the store rather than the worker, drawn")
print("daily for " + str(days_charted) + " days against an agreed target - and the count has genuinely not")
print("moved. It counts items, and the mean item went from " + str(mean_item_kilobytes_a_year_ago) + " KB to " + str(mean_item_kilobytes_now) + ", ")
print(str(size_now_as_percent_of_then) + " percent of what it was, so " + str(kilobytes_added_with_no_change_in_the_count) + " KB entered the backlog while the")
print("line stayed flat, under " + str(charts_of_the_backlog_in_bytes) + " charts in bytes and " + str(alerts_on_the_mean_item_size) + " alerts on the size.")
```

## stdout (executed)

```text
items in the backlog            : 12000
days charted                    : 365
targets agreed with the business: 1
charts of the backlog in bytes  : 0

mean item, KB a year ago        : 4
mean item, KB now               : 31
  as a percent of then          : 775
alerts on the mean item size    : 0

backlog KB a year ago           : 48000
backlog KB now                  : 372000
  added while the count held flat : 324000

the backlog chart
  where the number comes from : the store, not the
    worker's own opinion
  charted : daily, so a trend is visible rather than a
    snapshot
  target : agreed, not assumed
  days charted : 365
  has the number moved : no; between eleven and thirteen
    thousand every week
  verdict : STABLE, AND HONESTLY MEASURED

  reading the count from the store rather than from the
  consumer is the difference between a metric and a
  self-report, and it was done

the counted unit
  what one item is : a document to be indexed
  what indexing one costs : proportional to its bytes
  mean bytes a year ago : 4 KB
  mean bytes now        : 31 KB
  why : the product started accepting attachments
  charts in bytes : 0

  the count is exact and the unit it counts changed size
  underneath it

what a flat line meant then and now
  a year ago : the workers keep up with the arrival rate
  now        : the workers keep up with an arrival rate
    carrying 775 percent of the bytes
  did anything about the chart change : no
  did anything about the system change : the work per
    item, by that factor
  bytes added while the line stayed flat : 
    324000 KB

the agreed target
  what it says : keep the backlog under a count
  when it was agreed : when an item was 4 KB
  what it constrains today : a queue holding 
    372000 KB
  was the target renegotiated : it did not appear to need
    renegotiating; the number it names is inside it
  alerts on the quantity that moved : 
    0

null control - plot the backlog in bytes as well
  items in the backlog : 12000, unchanged and still exact
  charts in bytes : 1
  alerts on the mean item size : 1
  the count did not become wrong; a second line appeared
  in the unit the work is denominated in

what a flat backlog count guarantees
  the number of unprocessed items is not growing :
    exactly, measured from the store, charted daily for
    365 days
  the backlog is not growing : not addressed; the count
    is in items and the work is in bytes, and nothing
    holds the conversion still

a count is a measurement only while the thing counted keeps
its size; where the unit can grow, a flat line records that
the growth was absorbed rather than that it did not happen

The chart is honestly built - read from the store rather than the worker, drawn
daily for 365 days against an agreed target - and the count has genuinely not
moved. It counts items, and the mean item went from 4 KB to 31, 
775 percent of what it was, so 324000 KB entered the backlog while the
line stayed flat, under 0 charts in bytes and 0 alerts on the size.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
