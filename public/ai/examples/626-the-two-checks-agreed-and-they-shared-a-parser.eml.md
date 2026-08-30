<!-- canonical: efficientnewlanguage.org/ai/examples/626-the-two-checks-agreed-and-they-shared-a-parser | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 626 — The two checks agreed and they shared a parser

`the_two_checks_agreed_and_they_shared_a_parser.eml` - Two validators, written by two teams for two entry points, agree on every input. What their agreement is evidence of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two validators,
# written by two teams for two entry points, agree on every input. What their
# agreement is evidence of is computed below.
#
# Having two is correct and it was a deliberate choice. The API path and the
# batch path accept the same documents, and a rule enforced in one and not the
# other is exactly how a bad record gets in through the quiet door. Two
# independent implementations also catch each other's mistakes, which is the
# whole argument for redundancy, and here it works: they disagree on real
# inputs and every disagreement has been a real defect in one of them.
#
# Independence is a property of the whole path, not of the top of it. Both
# validators call the same parsing library, because it is the only parser for
# this format and writing a second one would be worse in every way anybody
# could name.
#
# Whatever the parser decides before either validator runs, both of them
# inherit, and agreement about an inherited premise is not a second opinion.

240000 => documents
2 => validators
8 => rule_classes
3 => classes_with_separate_logic

"documents checked        : " + str(documents) ^0
"validators               : " + str(validators) ^0
"rule classes             : " + str(rule_classes) ^0
"" ^0

# ---- what the agreement rate is ----

"the two validators, measured against each other" ^0
"  documents where they agree    : " + str(documents) ^0
"  documents where they disagree : 0" ^0
"  agreement rate                : 100 percent" ^0
"" ^0
"  which is read as: two independent checks confirm each other" ^0
"" ^0

# ---- where the independence actually lives ----

rule_classes - classes_with_separate_logic => classes_from_the_parser

"where each rule class is decided" ^0
"  classes with two separate implementations : " + str(classes_with_separate_logic) ^0
"  classes decided by the shared parser      : " + str(classes_from_the_parser) ^0
"" ^0
int(classes_with_separate_logic * 100 / rule_classes) => independent_share
"  share of the rules that two minds looked at : " + str(independent_share) + " percent" ^0
"  share where agreement is arithmetic         : " + str(100 - independent_share) + " percent" ^0
"" ^0

# ---- the class both of them inherit ----
#
# The parser normalises a duplicated key by keeping the last occurrence. Both
# validators see one key and check it. Neither sees the document that was sent.

31 => affected_per_myriad
int(documents * affected_per_myriad / 10000) => documents_with_duplicate_keys

"documents containing a duplicated key" ^0
"  rate                     : " + str(affected_per_myriad) + " per ten thousand" ^0
"  count                    : " + str(documents_with_duplicate_keys) ^0
"  seen by validator one    : the normalised form" ^0
"  seen by validator two    : the normalised form" ^0
"  seen by either as sent   : 0" ^0
"" ^0
"  both accept, both are right about what they were handed," ^0
"  and the document that reaches storage is the one they" ^0
"  were not shown" ^0
"" ^0

# ---- what a disagreement would have required ----

"for the two to disagree about this class" ^0
"  they would need different parsers   : they have one" ^0
"  or one would parse and one would not: neither can" ^0
"  or the rule would have to run on bytes : it runs on the tree" ^0
"" ^0
"  so a disagreement here is not unlikely, it is unreachable," ^0
"  and 0 disagreements is the only value this can ever report" ^0
"" ^0

# ---- the classes where they DO differ ----
#
# This is the part that works, and it is the reason the agreement rate on
# everything else is so persuasive.

7 => disagreements_found_historically

"the " + str(classes_with_separate_logic) + " classes with separate implementations" ^0
"  disagreements found to date : " + str(disagreements_found_historically) ^0
"  of those, a real defect     : " + str(disagreements_found_historically) ^0
"  false alarms                : 0" ^0
"" ^0
"  redundancy is doing exactly what it was added for," ^0
"  on the " + str(independent_share) + " percent of the surface where it exists" ^0
"" ^0

# ---- the control ----
#
# Both validators, against their own contracts. Each accepts precisely the
# documents its rules describe, and each has caught real defects the other let
# through.

"control - is either validator wrong" ^0
"  incorrect accepts against its own input : 0" ^0
"  incorrect rejects                       : 0" ^0
"  rules implemented but not enforced      : 0" ^0
"  defects in either validator             : 0" ^0
"" ^0
"  neither one needs fixing; what needs stating is which" ^0
"  fraction of the rules their agreement covers" ^0
"" ^0

# ---- the null control ----
#
# The same two validators, where one is handed the raw bytes and the other the
# parsed tree. Same rules, same teams, same code for the rules themselves.

"null control - one validator reading the bytes instead" ^0
"  classes now decided independently : " + str(rule_classes) ^0
"  documents where they disagree     : " + str(documents_with_duplicate_keys) ^0
"  agreement rate                    : " + str(100 - int(documents_with_duplicate_keys * 100 / documents)) + " percent, and lower is the finding" ^0
"  the checks did not improve; the shared premise was removed" ^0
"" ^0

# ---- the rule ----

"what two checks agreeing establishes" ^0
"  they agree about their inputs      : yes, exactly" ^0
"  they received the same input       : usually assumed" ^0
"  they reached it by separate routes : only where the routes" ^0
"    are actually separate, which is not where the code is" ^0
"    separate but where the DATA path is" ^0
"" ^0
"the question is not how many checks there are, it is how far" ^0
"back they share a step; count the rules whose answer is fixed" ^0
"before either check runs" ^0
"" ^0

"The two validators agree on all " + str(documents) + " documents with 0 disagreements, and on" ^0
"the " + str(classes_with_separate_logic) + " rule classes they implement separately that redundancy has caught " + str(disagreements_found_historically) ^0
"real defects with 0 false alarms. The other " + str(classes_from_the_parser) + " classes - " + str(100 - independent_share) + " percent - are" ^0
"settled by one shared parser before either validator runs, so on the " + str(documents_with_duplicate_keys) ^0
"documents with a duplicated key both accept the normalised form, and a" ^0
"disagreement there is not improbable but unreachable." ^0
```

## Python (deterministic transpilation)

```python
documents = 240000
validators = 2
rule_classes = 8
classes_with_separate_logic = 3
print("documents checked        : " + str(documents))
print("validators               : " + str(validators))
print("rule classes             : " + str(rule_classes))
print("")
print("the two validators, measured against each other")
print("  documents where they agree    : " + str(documents))
print("  documents where they disagree : 0")
print("  agreement rate                : 100 percent")
print("")
print("  which is read as: two independent checks confirm each other")
print("")
classes_from_the_parser = rule_classes - classes_with_separate_logic
print("where each rule class is decided")
print("  classes with two separate implementations : " + str(classes_with_separate_logic))
print("  classes decided by the shared parser      : " + str(classes_from_the_parser))
print("")
independent_share = int(classes_with_separate_logic * 100 / rule_classes)
print("  share of the rules that two minds looked at : " + str(independent_share) + " percent")
print("  share where agreement is arithmetic         : " + str(100 - independent_share) + " percent")
print("")
affected_per_myriad = 31
documents_with_duplicate_keys = int(documents * affected_per_myriad / 10000)
print("documents containing a duplicated key")
print("  rate                     : " + str(affected_per_myriad) + " per ten thousand")
print("  count                    : " + str(documents_with_duplicate_keys))
print("  seen by validator one    : the normalised form")
print("  seen by validator two    : the normalised form")
print("  seen by either as sent   : 0")
print("")
print("  both accept, both are right about what they were handed,")
print("  and the document that reaches storage is the one they")
print("  were not shown")
print("")
print("for the two to disagree about this class")
print("  they would need different parsers   : they have one")
print("  or one would parse and one would not: neither can")
print("  or the rule would have to run on bytes : it runs on the tree")
print("")
print("  so a disagreement here is not unlikely, it is unreachable,")
print("  and 0 disagreements is the only value this can ever report")
print("")
disagreements_found_historically = 7
print("the " + str(classes_with_separate_logic) + " classes with separate implementations")
print("  disagreements found to date : " + str(disagreements_found_historically))
print("  of those, a real defect     : " + str(disagreements_found_historically))
print("  false alarms                : 0")
print("")
print("  redundancy is doing exactly what it was added for,")
print("  on the " + str(independent_share) + " percent of the surface where it exists")
print("")
print("control - is either validator wrong")
print("  incorrect accepts against its own input : 0")
print("  incorrect rejects                       : 0")
print("  rules implemented but not enforced      : 0")
print("  defects in either validator             : 0")
print("")
print("  neither one needs fixing; what needs stating is which")
print("  fraction of the rules their agreement covers")
print("")
print("null control - one validator reading the bytes instead")
print("  classes now decided independently : " + str(rule_classes))
print("  documents where they disagree     : " + str(documents_with_duplicate_keys))
print("  agreement rate                    : " + str(100 - int(documents_with_duplicate_keys * 100 / documents)) + " percent, and lower is the finding")
print("  the checks did not improve; the shared premise was removed")
print("")
print("what two checks agreeing establishes")
print("  they agree about their inputs      : yes, exactly")
print("  they received the same input       : usually assumed")
print("  they reached it by separate routes : only where the routes")
print("    are actually separate, which is not where the code is")
print("    separate but where the DATA path is")
print("")
print("the question is not how many checks there are, it is how far")
print("back they share a step; count the rules whose answer is fixed")
print("before either check runs")
print("")
print("The two validators agree on all " + str(documents) + " documents with 0 disagreements, and on")
print("the " + str(classes_with_separate_logic) + " rule classes they implement separately that redundancy has caught " + str(disagreements_found_historically))
print("real defects with 0 false alarms. The other " + str(classes_from_the_parser) + " classes - " + str(100 - independent_share) + " percent - are")
print("settled by one shared parser before either validator runs, so on the " + str(documents_with_duplicate_keys))
print("documents with a duplicated key both accept the normalised form, and a")
print("disagreement there is not improbable but unreachable.")
```

## stdout (executed)

```text
documents checked        : 240000
validators               : 2
rule classes             : 8

the two validators, measured against each other
  documents where they agree    : 240000
  documents where they disagree : 0
  agreement rate                : 100 percent

  which is read as: two independent checks confirm each other

where each rule class is decided
  classes with two separate implementations : 3
  classes decided by the shared parser      : 5

  share of the rules that two minds looked at : 37 percent
  share where agreement is arithmetic         : 63 percent

documents containing a duplicated key
  rate                     : 31 per ten thousand
  count                    : 744
  seen by validator one    : the normalised form
  seen by validator two    : the normalised form
  seen by either as sent   : 0

  both accept, both are right about what they were handed,
  and the document that reaches storage is the one they
  were not shown

for the two to disagree about this class
  they would need different parsers   : they have one
  or one would parse and one would not: neither can
  or the rule would have to run on bytes : it runs on the tree

  so a disagreement here is not unlikely, it is unreachable,
  and 0 disagreements is the only value this can ever report

the 3 classes with separate implementations
  disagreements found to date : 7
  of those, a real defect     : 7
  false alarms                : 0

  redundancy is doing exactly what it was added for,
  on the 37 percent of the surface where it exists

control - is either validator wrong
  incorrect accepts against its own input : 0
  incorrect rejects                       : 0
  rules implemented but not enforced      : 0
  defects in either validator             : 0

  neither one needs fixing; what needs stating is which
  fraction of the rules their agreement covers

null control - one validator reading the bytes instead
  classes now decided independently : 8
  documents where they disagree     : 744
  agreement rate                    : 100 percent, and lower is the finding
  the checks did not improve; the shared premise was removed

what two checks agreeing establishes
  they agree about their inputs      : yes, exactly
  they received the same input       : usually assumed
  they reached it by separate routes : only where the routes
    are actually separate, which is not where the code is
    separate but where the DATA path is

the question is not how many checks there are, it is how far
back they share a step; count the rules whose answer is fixed
before either check runs

The two validators agree on all 240000 documents with 0 disagreements, and on
the 3 rule classes they implement separately that redundancy has caught 7
real defects with 0 false alarms. The other 5 classes - 63 percent - are
settled by one shared parser before either validator runs, so on the 744
documents with a duplicated key both accept the normalised form, and a
disagreement there is not improbable but unreachable.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
