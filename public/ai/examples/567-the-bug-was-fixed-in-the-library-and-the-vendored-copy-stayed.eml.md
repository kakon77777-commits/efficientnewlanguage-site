<!-- canonical: efficientnewlanguage.org/ai/examples/567-the-bug-was-fixed-in-the-library-and-the-vendored-copy-stayed | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 567 — The bug was fixed in the library and the vendored copy stayed

`the_bug_was_fixed_in_the_library_and_the_vendored_copy_stayed.eml` - An advisory is published, the library ships a fix, and the dependency scanner reports every service patched. How many are running the fixed code is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An advisory is
# published, the library ships a fix, and the dependency scanner reports every
# service patched. How many are running the fixed code is computed below.
#
# The scanner is a good scanner and reading the manifest is the right thing for
# it to do. A manifest is the declared truth, it is what the build resolves,
# it is machine-readable, and checking it costs nothing and runs on every push.
# There is no cheaper or more reliable way to answer "which version does this
# service depend on", and that question is answered exactly right, every time.
#
# Six services vendored the library eighteen months ago, each for a real
# reason: one needed a patch that upstream would not take, and the other five
# copied that service's layout because it was the working example. Vendoring
# copies the code into the repository. The manifest entry stays, because the
# build still needs the transitive dependencies.
#
# So the manifest says 2.4 and the import resolves to a directory. Both facts
# are true, and the scanner reads the one that is not executed.

34 => services_declaring_the_library
6 => services_with_a_vendored_copy

services_declaring_the_library - services_with_a_vendored_copy => actually_patched

"services declaring the library  : " + str(services_declaring_the_library) ^0
"of those, vendoring a copy      : " + str(services_with_a_vendored_copy) ^0
"" ^0

"what the scanner reports" ^0
"  services on the fixed version : " + str(services_declaring_the_library) ^0
"  services still vulnerable     : 0" ^0
"  coverage                      : 100 percent" ^0
"" ^0
"what is executing" ^0
"  services on the fixed version : " + str(actually_patched) ^0
"  services still vulnerable     : " + str(services_with_a_vendored_copy) ^0
"  coverage                      : " + str(int(actually_patched * 100 / services_declaring_the_library)) + " percent" ^0
"" ^0

int(services_with_a_vendored_copy * 100 / services_declaring_the_library) => false_negative_rate

"  the scanner's false negative rate : " + str(false_negative_rate) + " percent" ^0
"  the scanner's reported error rate : 0 percent" ^0
"" ^0

# ---- why the scanner cannot see it ----
#
# The question it asks is answered correctly. The question that decides whether
# the fix is running is a different question about a different artifact.

"two questions that sound like one" ^0
"  which version does the manifest declare   answered, correctly, in milliseconds" ^0
"  which code does the import resolve to     not asked" ^0
"  the second needs the repository contents, not the manifest" ^0
"  and for 28 of the 34 services the two answers are the same" ^0
"" ^0
"  a check is trusted in proportion to how often it is right" ^0
"  this one is right " + str(int(actually_patched * 100 / services_declaring_the_library)) + " percent of the time, which is often enough to" ^0
"  be trusted and not often enough to be safe" ^0
"" ^0

# ---- how the six became six ----

"how the vendored copies spread" ^0
"  1 service needed a patch upstream would not take" ^0
"  5 copied that service's layout, because it was the working example" ^0
"  none of the 5 needed the patch" ^0
"  the reason for vendoring stopped applying and the vendoring did not" ^0
"" ^0

# ---- what it costs to find them ----

"cost of the check that would find them" ^0
"  read every manifest              : " + str(services_declaring_the_library) + " files, already done" ^0
"  look for a directory that shadows a declared package : " + str(services_declaring_the_library) + " directory listings" ^0
"  services where the two disagree  : " + str(services_with_a_vendored_copy) ^0
"  the second check is the same order of work as the first" ^0
"" ^0

# ---- the control ----
#
# The scanner against the question it was built for. Every manifest entry it
# reports is correct, every version it resolves is the version the build would
# resolve, and it has never reported a wrong version.

"control - is the scanner wrong about anything it claims" ^0
"  manifests read              : " + str(services_declaring_the_library) ^0
"  versions reported correctly : " + str(services_declaring_the_library) ^0
"  incorrect version reports   : 0" ^0
"  the scanner has never been wrong about a declared version" ^0
"" ^0
"  its output is accurate and its heading is 'services patched'" ^0
"  the heading is a claim about execution and the data is about declaration" ^0
"" ^0

# ---- the null control ----
#
# The same scanner across a fleet with no vendored copies. Declaration and
# execution coincide everywhere, the scanner is exactly right, and its heading
# is true. The tool is not defective; it is a proxy, and a proxy is only as
# good as the gap it stands across.

0 => nc_vendored
services_declaring_the_library - nc_vendored => nc_patched

"null control - the same scanner where nothing is vendored" ^0
"  services vendoring a copy : " + str(nc_vendored) ^0
"  scanner reports patched   : " + str(services_declaring_the_library) ^0
"  actually patched          : " + str(nc_patched) ^0
"  false negatives           : " + str(services_declaring_the_library - nc_patched) ^0
"  same tool, same query, same manifest format" ^0
"  the error is exactly the number of services where the proxy and the thing" ^0
"  it stands for have come apart" ^0
"" ^0

# ---- the rule ----

"a proxy measurement, and the two numbers it needs" ^0
"  is the proxy measured correctly    yes, this is what gets tested" ^0
"  does the proxy track the target    this is a separate measurement" ^0
"  and it is not made by the tool that reads the proxy" ^0
"  a proxy that tracked perfectly when adopted can come apart later" ^0
"  through a change nobody thought of as touching it" ^0
"" ^0

"Reading the manifest is the cheapest and most reliable way to answer which" ^0
"version a service declares, and the scanner answers it correctly for all " + str(services_declaring_the_library) ^0
"of them. " + str(services_with_a_vendored_copy) + " import a directory instead, so the answer that is correct about" ^0
"the manifest is wrong about the process: " + str(actually_patched) + " services are running the fix, the" ^0
"dashboard says " + str(services_declaring_the_library) + ", and it has never reported a version incorrectly." ^0
```

## Python (deterministic transpilation)

```python
services_declaring_the_library = 34
services_with_a_vendored_copy = 6
actually_patched = services_declaring_the_library - services_with_a_vendored_copy
print("services declaring the library  : " + str(services_declaring_the_library))
print("of those, vendoring a copy      : " + str(services_with_a_vendored_copy))
print("")
print("what the scanner reports")
print("  services on the fixed version : " + str(services_declaring_the_library))
print("  services still vulnerable     : 0")
print("  coverage                      : 100 percent")
print("")
print("what is executing")
print("  services on the fixed version : " + str(actually_patched))
print("  services still vulnerable     : " + str(services_with_a_vendored_copy))
print("  coverage                      : " + str(int(actually_patched * 100 / services_declaring_the_library)) + " percent")
print("")
false_negative_rate = int(services_with_a_vendored_copy * 100 / services_declaring_the_library)
print("  the scanner's false negative rate : " + str(false_negative_rate) + " percent")
print("  the scanner's reported error rate : 0 percent")
print("")
print("two questions that sound like one")
print("  which version does the manifest declare   answered, correctly, in milliseconds")
print("  which code does the import resolve to     not asked")
print("  the second needs the repository contents, not the manifest")
print("  and for 28 of the 34 services the two answers are the same")
print("")
print("  a check is trusted in proportion to how often it is right")
print("  this one is right " + str(int(actually_patched * 100 / services_declaring_the_library)) + " percent of the time, which is often enough to")
print("  be trusted and not often enough to be safe")
print("")
print("how the vendored copies spread")
print("  1 service needed a patch upstream would not take")
print("  5 copied that service's layout, because it was the working example")
print("  none of the 5 needed the patch")
print("  the reason for vendoring stopped applying and the vendoring did not")
print("")
print("cost of the check that would find them")
print("  read every manifest              : " + str(services_declaring_the_library) + " files, already done")
print("  look for a directory that shadows a declared package : " + str(services_declaring_the_library) + " directory listings")
print("  services where the two disagree  : " + str(services_with_a_vendored_copy))
print("  the second check is the same order of work as the first")
print("")
print("control - is the scanner wrong about anything it claims")
print("  manifests read              : " + str(services_declaring_the_library))
print("  versions reported correctly : " + str(services_declaring_the_library))
print("  incorrect version reports   : 0")
print("  the scanner has never been wrong about a declared version")
print("")
print("  its output is accurate and its heading is 'services patched'")
print("  the heading is a claim about execution and the data is about declaration")
print("")
nc_vendored = 0
nc_patched = services_declaring_the_library - nc_vendored
print("null control - the same scanner where nothing is vendored")
print("  services vendoring a copy : " + str(nc_vendored))
print("  scanner reports patched   : " + str(services_declaring_the_library))
print("  actually patched          : " + str(nc_patched))
print("  false negatives           : " + str(services_declaring_the_library - nc_patched))
print("  same tool, same query, same manifest format")
print("  the error is exactly the number of services where the proxy and the thing")
print("  it stands for have come apart")
print("")
print("a proxy measurement, and the two numbers it needs")
print("  is the proxy measured correctly    yes, this is what gets tested")
print("  does the proxy track the target    this is a separate measurement")
print("  and it is not made by the tool that reads the proxy")
print("  a proxy that tracked perfectly when adopted can come apart later")
print("  through a change nobody thought of as touching it")
print("")
print("Reading the manifest is the cheapest and most reliable way to answer which")
print("version a service declares, and the scanner answers it correctly for all " + str(services_declaring_the_library))
print("of them. " + str(services_with_a_vendored_copy) + " import a directory instead, so the answer that is correct about")
print("the manifest is wrong about the process: " + str(actually_patched) + " services are running the fix, the")
print("dashboard says " + str(services_declaring_the_library) + ", and it has never reported a version incorrectly.")
```

## stdout (executed)

```text
services declaring the library  : 34
of those, vendoring a copy      : 6

what the scanner reports
  services on the fixed version : 34
  services still vulnerable     : 0
  coverage                      : 100 percent

what is executing
  services on the fixed version : 28
  services still vulnerable     : 6
  coverage                      : 82 percent

  the scanner's false negative rate : 17 percent
  the scanner's reported error rate : 0 percent

two questions that sound like one
  which version does the manifest declare   answered, correctly, in milliseconds
  which code does the import resolve to     not asked
  the second needs the repository contents, not the manifest
  and for 28 of the 34 services the two answers are the same

  a check is trusted in proportion to how often it is right
  this one is right 82 percent of the time, which is often enough to
  be trusted and not often enough to be safe

how the vendored copies spread
  1 service needed a patch upstream would not take
  5 copied that service's layout, because it was the working example
  none of the 5 needed the patch
  the reason for vendoring stopped applying and the vendoring did not

cost of the check that would find them
  read every manifest              : 34 files, already done
  look for a directory that shadows a declared package : 34 directory listings
  services where the two disagree  : 6
  the second check is the same order of work as the first

control - is the scanner wrong about anything it claims
  manifests read              : 34
  versions reported correctly : 34
  incorrect version reports   : 0
  the scanner has never been wrong about a declared version

  its output is accurate and its heading is 'services patched'
  the heading is a claim about execution and the data is about declaration

null control - the same scanner where nothing is vendored
  services vendoring a copy : 0
  scanner reports patched   : 34
  actually patched          : 34
  false negatives           : 0
  same tool, same query, same manifest format
  the error is exactly the number of services where the proxy and the thing
  it stands for have come apart

a proxy measurement, and the two numbers it needs
  is the proxy measured correctly    yes, this is what gets tested
  does the proxy track the target    this is a separate measurement
  and it is not made by the tool that reads the proxy
  a proxy that tracked perfectly when adopted can come apart later
  through a change nobody thought of as touching it

Reading the manifest is the cheapest and most reliable way to answer which
version a service declares, and the scanner answers it correctly for all 34
of them. 6 import a directory instead, so the answer that is correct about
the manifest is wrong about the process: 28 services are running the fix, the
dashboard says 34, and it has never reported a version incorrectly.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
