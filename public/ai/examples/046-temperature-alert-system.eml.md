<!-- canonical: efficientnewlanguage.org/ai/examples/046-temperature-alert-system | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 046 — Temperature alert system

`temperature_alert_system.eml` classifies a day's worth of hourly Celsius readings from a weather station into "cold"/"mild"/"hot" bands, prints a per-reading alert line (flagging severe extremes), and tallies how many readings landed in each band.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Classifies a
# day's hourly Celsius readings from a weather station into cold/mild/hot
# bands using `and`/`or`/`not` boolean logic on threshold comparisons,
# prints a `%`-formatted alert line per reading (tuple right-hand side, one
# `%s`/`%d` substitution per field) that also flags severe extremes via
# `or`, and tallies how many readings fall into each band.

readings^+[-4, 6, 14, 22, 31, 9, 27, 38]

cold_count^+0
mild_count^+0
hot_count^+0

for temp in readings:
    temp < 10 => is_cold
    temp > 25 => is_hot
    (not is_cold) and (not is_hot) => is_mild
    (temp < 0) or (temp > 35) => is_severe

    if is_cold:
        "cold" => category
        cold_count^+1
    elif is_hot:
        "hot" => category
        hot_count^+1
    else:
        "mild" => category
        mild_count^+1

    is_severe ? "SEVERE" : "normal" => flag
    "Reading %d C -> %s (%s)" % (temp, category, flag) => line
    line^0

"Cold: %d, Mild: %d, Hot: %d" % (cold_count, mild_count, hot_count) => summary
summary^0
```

## Python (deterministic transpilation)

```python
readings = [-4, 6, 14, 22, 31, 9, 27, 38]
cold_count = 0
mild_count = 0
hot_count = 0
for temp in readings:
    is_cold = temp < 10
    is_hot = temp > 25
    is_mild = not is_cold and not is_hot
    is_severe = temp < 0 or temp > 35
    if is_cold:
        category = "cold"
        cold_count += 1
    elif is_hot:
        category = "hot"
        hot_count += 1
    else:
        category = "mild"
        mild_count += 1
    flag = "SEVERE" if is_severe else "normal"
    line = "Reading %d C -> %s (%s)" % (temp, category, flag)
    print(line)
summary = "Cold: %d, Mild: %d, Hot: %d" % (cold_count, mild_count, hot_count)
print(summary)
```

## stdout (executed)

```text
Reading -4 C -> cold (SEVERE)
Reading 6 C -> cold (normal)
Reading 14 C -> mild (normal)
Reading 22 C -> mild (normal)
Reading 31 C -> hot (normal)
Reading 9 C -> cold (normal)
Reading 27 C -> hot (normal)
Reading 38 C -> hot (SEVERE)
Cold: 3, Mild: 2, Hot: 3
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
