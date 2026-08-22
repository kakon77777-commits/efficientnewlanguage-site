<!-- canonical: efficientnewlanguage.org/ai/examples/503-the-rule-binds-the-party-with-no-leverage | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 503 — The rule binds the party with no leverage

`the_rule_binds_the_party_with_no_leverage.eml` - The integration standard applies to every partner. Which partners it has actually been applied to is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The integration
# standard applies to every partner. Which partners it has actually been applied
# to is computed below.
#
# Having one standard is right. It is written once, it is the same document for
# everybody, and a platform that negotiates its interface separately with each
# partner ends up with as many interfaces as partners. Nothing in the document
# distinguishes between them.
#
# Applying it needs the platform to be willing to refuse the integration. That
# willingness is not constant across partners: a partner who is 40% of revenue
# is refused differently from one who is 0.3%, and the standard has no term for
# revenue.
#
# Compliance is counted against leverage.

# [partner, share of revenue in tenths of a percent, violations of the standard, exemptions granted, integration blocked]
[["alpha", 400, 6, 6, 0], ["beta", 220, 4, 4, 0], ["gamma", 90, 3, 1, 0], ["delta", 30, 3, 0, 1], ["epsilon", 12, 2, 0, 1], ["zeta", 8, 5, 0, 1], ["eta", 180, 2, 2, 0], ["theta", 5, 1, 0, 1]] => partners

len(partners) => n
0 => total_v
0 => total_exempt
0 => blocked
for p in partners:
    total_v + p[2] => total_v
    total_exempt + p[3] => total_exempt
    blocked + p[4] => blocked

"partners : " + str(n) ^0
"violations of the standard : " + str(total_v) ^0
"exemptions granted         : " + str(total_exempt) ^0
"integrations blocked       : " + str(blocked) ^0
"" ^0

"partner   revenue share   violations   exempted   blocked" ^0
for p in partners:
    "" => b
    if p[4] == 1:
        b + "yes" => b
    else:
        b + "no " => b
    "  " + p[0] + "     " + str(int(p[1] / 10)) + "." + str(p[1] % 10) + "%           " + str(p[2]) + "            " + str(p[3]) + "          " + b ^0
"" ^0

# ---- exemption rate against leverage ----

0 => big_v
0 => big_e
0 => small_v
0 => small_e
for p in partners:
    if p[1] >= 100:
        big_v + p[2] => big_v
        big_e + p[3] => big_e
    else:
        small_v + p[2] => small_v
        small_e + p[3] => small_e
"partners at 10% of revenue or more" ^0
"  violations : " + str(big_v) + ", exempted : " + str(big_e) ^0
if big_v > 0:
    "  exemption rate : " + str(int(big_e * 100 / big_v)) + "%" ^0
"partners under 10%" ^0
"  violations : " + str(small_v) + ", exempted : " + str(small_e) ^0
if small_v > 0:
    "  exemption rate : " + str(int(small_e * 100 / small_v)) + "%" ^0
"" ^0

# ---- who the standard has actually stopped ----

"integrations blocked, by partner size" ^0
for p in partners:
    if p[4] == 1:
        "  " + p[0] + " : " + str(int(p[1] / 10)) + "." + str(p[1] % 10) + "% of revenue, " + str(p[2]) + " violations" ^0
0 => blocked_share
for p in partners:
    if p[4] == 1:
        blocked_share + p[1] => blocked_share
"  combined revenue share of every blocked partner : " + str(int(blocked_share / 10)) + "." + str(blocked_share % 10) + "%" ^0
"" ^0

# ---- the partner with the most violations ----

0 => worst_v
"" => worst_p
for p in partners:
    if p[2] > worst_v:
        p[2] => worst_v
        p[0] => worst_p
"the partner with the most violations : " + worst_p + ", " + str(worst_v) ^0
for p in partners:
    if p[0] == worst_p:
        "  revenue share : " + str(int(p[1] / 10)) + "." + str(p[1] % 10) + "%" ^0
        if p[4] == 1:
            "  blocked : yes" ^0
        else:
            "  blocked : no, exempted " + str(p[3]) + " times" ^0
"" ^0

# ---- what the standard document says ----

"what the document contains" ^0
"  requirements     : the same for every partner" ^0
"  exemption clause : discretionary, no criteria written" ^0
"  revenue          : not mentioned" ^0
"  the discretion is the only place a difference can enter, and it is the" ^0
"  only part with no criteria" ^0
"" ^0

# ---- what a written criterion would change ----

"if the exemption clause named its criteria" ^0
"  exemptions that would survive a stated rule : whatever the rule says" ^0
"  exemptions that would have to be argued     : " + str(total_exempt) ^0
"  what changes is not the outcome but whether the reason is on the record" ^0
"  where the next partner can point at it" ^0
"" ^0

# ---- the control: a standard enforced by the protocol itself ----
#
# Where the requirement is a property of the wire format, a non-compliant
# integration cannot connect, and leverage has nothing to act on.

"control - a requirement the handshake rejects" ^0
"  partners that can violate it : 0, the connection fails" ^0
"  exemptions possible          : 0, there is nobody to ask" ^0
"  the same standard, moved from a document into the protocol, and the" ^0
"  difference is that refusing is no longer a decision somebody makes" ^0
"" ^0

"One standard for every partner is the right design and the document does not" ^0
"mention revenue. Applying it means being willing to refuse, and that" ^0
"willingness is the part that varies." ^0
```

## Python (deterministic transpilation)

```python
partners = [["alpha", 400, 6, 6, 0], ["beta", 220, 4, 4, 0], ["gamma", 90, 3, 1, 0], ["delta", 30, 3, 0, 1], ["epsilon", 12, 2, 0, 1], ["zeta", 8, 5, 0, 1], ["eta", 180, 2, 2, 0], ["theta", 5, 1, 0, 1]]
n = len(partners)
total_v = 0
total_exempt = 0
blocked = 0
for p in partners:
    total_v = total_v + p[2]
    total_exempt = total_exempt + p[3]
    blocked = blocked + p[4]
print("partners : " + str(n))
print("violations of the standard : " + str(total_v))
print("exemptions granted         : " + str(total_exempt))
print("integrations blocked       : " + str(blocked))
print("")
print("partner   revenue share   violations   exempted   blocked")
for p in partners:
    b = ""
    if p[4] == 1:
        b = b + "yes"
    else:
        b = b + "no "
    print("  " + p[0] + "     " + str(int(p[1] / 10)) + "." + str(p[1] % 10) + "%           " + str(p[2]) + "            " + str(p[3]) + "          " + b)
print("")
big_v = 0
big_e = 0
small_v = 0
small_e = 0
for p in partners:
    if p[1] >= 100:
        big_v = big_v + p[2]
        big_e = big_e + p[3]
    else:
        small_v = small_v + p[2]
        small_e = small_e + p[3]
print("partners at 10% of revenue or more")
print("  violations : " + str(big_v) + ", exempted : " + str(big_e))
if big_v > 0:
    print("  exemption rate : " + str(int(big_e * 100 / big_v)) + "%")
print("partners under 10%")
print("  violations : " + str(small_v) + ", exempted : " + str(small_e))
if small_v > 0:
    print("  exemption rate : " + str(int(small_e * 100 / small_v)) + "%")
print("")
print("integrations blocked, by partner size")
for p in partners:
    if p[4] == 1:
        print("  " + p[0] + " : " + str(int(p[1] / 10)) + "." + str(p[1] % 10) + "% of revenue, " + str(p[2]) + " violations")
blocked_share = 0
for p in partners:
    if p[4] == 1:
        blocked_share = blocked_share + p[1]
print("  combined revenue share of every blocked partner : " + str(int(blocked_share / 10)) + "." + str(blocked_share % 10) + "%")
print("")
worst_v = 0
worst_p = ""
for p in partners:
    if p[2] > worst_v:
        worst_v = p[2]
        worst_p = p[0]
print("the partner with the most violations : " + worst_p + ", " + str(worst_v))
for p in partners:
    if p[0] == worst_p:
        print("  revenue share : " + str(int(p[1] / 10)) + "." + str(p[1] % 10) + "%")
        if p[4] == 1:
            print("  blocked : yes")
        else:
            print("  blocked : no, exempted " + str(p[3]) + " times")
print("")
print("what the document contains")
print("  requirements     : the same for every partner")
print("  exemption clause : discretionary, no criteria written")
print("  revenue          : not mentioned")
print("  the discretion is the only place a difference can enter, and it is the")
print("  only part with no criteria")
print("")
print("if the exemption clause named its criteria")
print("  exemptions that would survive a stated rule : whatever the rule says")
print("  exemptions that would have to be argued     : " + str(total_exempt))
print("  what changes is not the outcome but whether the reason is on the record")
print("  where the next partner can point at it")
print("")
print("control - a requirement the handshake rejects")
print("  partners that can violate it : 0, the connection fails")
print("  exemptions possible          : 0, there is nobody to ask")
print("  the same standard, moved from a document into the protocol, and the")
print("  difference is that refusing is no longer a decision somebody makes")
print("")
print("One standard for every partner is the right design and the document does not")
print("mention revenue. Applying it means being willing to refuse, and that")
print("willingness is the part that varies.")
```

## stdout (executed)

```text
partners : 8
violations of the standard : 26
exemptions granted         : 13
integrations blocked       : 4

partner   revenue share   violations   exempted   blocked
  alpha     40.0%           6            6          no 
  beta     22.0%           4            4          no 
  gamma     9.0%           3            1          no 
  delta     3.0%           3            0          yes
  epsilon     1.2%           2            0          yes
  zeta     0.8%           5            0          yes
  eta     18.0%           2            2          no 
  theta     0.5%           1            0          yes

partners at 10% of revenue or more
  violations : 12, exempted : 12
  exemption rate : 100%
partners under 10%
  violations : 14, exempted : 1
  exemption rate : 7%

integrations blocked, by partner size
  delta : 3.0% of revenue, 3 violations
  epsilon : 1.2% of revenue, 2 violations
  zeta : 0.8% of revenue, 5 violations
  theta : 0.5% of revenue, 1 violations
  combined revenue share of every blocked partner : 5.5%

the partner with the most violations : alpha, 6
  revenue share : 40.0%
  blocked : no, exempted 6 times

what the document contains
  requirements     : the same for every partner
  exemption clause : discretionary, no criteria written
  revenue          : not mentioned
  the discretion is the only place a difference can enter, and it is the
  only part with no criteria

if the exemption clause named its criteria
  exemptions that would survive a stated rule : whatever the rule says
  exemptions that would have to be argued     : 13
  what changes is not the outcome but whether the reason is on the record
  where the next partner can point at it

control - a requirement the handshake rejects
  partners that can violate it : 0, the connection fails
  exemptions possible          : 0, there is nobody to ask
  the same standard, moved from a document into the protocol, and the
  difference is that refusing is no longer a decision somebody makes

One standard for every partner is the right design and the document does not
mention revenue. Applying it means being willing to refuse, and that
willingness is the part that varies.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
