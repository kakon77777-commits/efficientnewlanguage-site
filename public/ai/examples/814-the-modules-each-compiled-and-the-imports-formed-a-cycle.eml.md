<!-- canonical: efficientnewlanguage.org/ai/examples/814-the-modules-each-compiled-and-the-imports-formed-a-cycle | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 814 — The modules each compiled and the imports formed a cycle

`the_modules_each_compiled_and_the_imports_formed_a_cycle.eml` - Every module in the build compiles on its own, and each compile is real. What the import graph does is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every module in
# the build compiles on its own, and each compile is real. What the import graph
# does is computed below.
#
# The build is checked per module. Each of the sixty modules compiles in
# isolation; each declares its imports explicitly; the compiler errors on an
# unresolved name; and a module that compiles is cached and not recompiled.
#
# Three modules import each other in a cycle.

60 => modules
60 => modules_that_compile_alone
3 => modules_in_the_cycle
0 => builds_that_failed
1 => startups_that_read_a_half_initialized_module

modules - modules_that_compile_alone => modules_that_failed_to_compile
int(modules_in_the_cycle * 10000 / modules) => cycle_share_of_modules_per_myriad
modules_in_the_cycle => modules_with_no_valid_initialization_order

"modules                         : " + str(modules) ^0
"  that compile alone            : " + str(modules_that_compile_alone) ^0
"  that failed to compile        : " + str(modules_that_failed_to_compile) ^0
"builds that failed              : " + str(builds_that_failed) ^0
"" ^0
"modules in the cycle            : " + str(modules_in_the_cycle) ^0
"  as a share of all modules     : " + str(cycle_share_of_modules_per_myriad) + " per ten thousand" ^0
"  with no valid init order      : " + str(modules_with_no_valid_initialization_order) ^0
"startups reading a half-init module : " + str(startups_that_read_a_half_initialized_module) ^0
"" ^0

# ---- what per-module compilation verified ----

"the per-module build" ^0
"  each module : compiles in isolation" ^0
"  imports : declared explicitly" ^0
"  on an unresolved name : the compiler errors" ^0
"  a compiled module : cached, not recompiled" ^0
"  modules that compiled : all " + str(modules) ^0
"  verdict : BUILDS CLEAN" ^0
"" ^0
"  erroring on an unresolved name is the part done right" ^0
"  here, and it is why a missing symbol never slips" ^0
"    through" ^0
"" ^0

# ---- what compiling alone cannot see ----

"the import graph" ^0
"  what a single compile sees : one module and its" ^0
"    declared imports" ^0
"  what it does not see : whether the imports form a cycle" ^0
"  the three modules : each imports the next, the last" ^0
"    imports the first" ^0
"  a cycle in initialization : has no order that runs each" ^0
"    module after its dependencies" ^0
"  so one module at startup : reads another before it is" ^0
"    initialized" ^0
"" ^0

# ---- what runs at startup ----

"the program starting up" ^0
"  modules loaded : all " + str(modules) ^0
"  the cycle's init order : undefined; something must go" ^0
"    first" ^0
"  what the first of the cycle reads : a module still at" ^0
"    its defaults" ^0
"  startups that read a half-initialized module : " ^0
"    " + str(startups_that_read_a_half_initialized_module) ^0
"  did any module fail to compile : no; the fault is in" ^0
"    the graph, which no compile sees" ^0
"" ^0

# ---- null control ----

# The same modules, checked by a build step that walks the import graph and
# fails on a cycle before startup.
0 => nc_cycles_the_per_module_build_reports
1 => nc_cycles_the_graph_check_reports
3 => nc_modules_it_would_name

"null control - a graph check over the imports" ^0
"  cycles the per-module build reports : " ^0
"    " + str(nc_cycles_the_per_module_build_reports) ^0
"  cycles the graph check reports : " ^0
"    " + str(nc_cycles_the_graph_check_reports) ^0
"  modules it would name : " + str(nc_modules_it_would_name) ^0
"  no module and no import changed; the check moved from" ^0
"  one module at a time to the graph they form" ^0
"" ^0

# ---- the rule ----

"what a clean per-module build guarantees" ^0
"  each module compiles against its declared imports :" ^0
"    exactly, all " + str(modules) + ", the compiler errors on a missing name" ^0
"  the program is well-formed : not addressed; each module" ^0
"    compiles alone, and compiling alone does not see the" ^0
"    import graph - " + str(modules_in_the_cycle) + " modules form a cycle, and one observes" ^0
"    another half-initialized at startup" ^0
"" ^0

"a property of each node is not a property of the graph; compilation ranges over" ^0
"a module and its edges, and a cycle is a fact about the whole graph that no" ^0
"single module's compile can hold" ^0
"" ^0

"Every module compiles alone against its declared imports, the compiler errors" ^0
"on a missing name - the build is clean. Three modules import each other in a" ^0
"cycle, which no single compile sees, so initialization has no valid order and " ^0
"" + str(startups_that_read_a_half_initialized_module) + " startup reads a half-initialized module, under " + str(builds_that_failed) + " build failures." ^0
```

## Python (deterministic transpilation)

```python
modules = 60
modules_that_compile_alone = 60
modules_in_the_cycle = 3
builds_that_failed = 0
startups_that_read_a_half_initialized_module = 1
modules_that_failed_to_compile = modules - modules_that_compile_alone
cycle_share_of_modules_per_myriad = int(modules_in_the_cycle * 10000 / modules)
modules_with_no_valid_initialization_order = modules_in_the_cycle
print("modules                         : " + str(modules))
print("  that compile alone            : " + str(modules_that_compile_alone))
print("  that failed to compile        : " + str(modules_that_failed_to_compile))
print("builds that failed              : " + str(builds_that_failed))
print("")
print("modules in the cycle            : " + str(modules_in_the_cycle))
print("  as a share of all modules     : " + str(cycle_share_of_modules_per_myriad) + " per ten thousand")
print("  with no valid init order      : " + str(modules_with_no_valid_initialization_order))
print("startups reading a half-init module : " + str(startups_that_read_a_half_initialized_module))
print("")
print("the per-module build")
print("  each module : compiles in isolation")
print("  imports : declared explicitly")
print("  on an unresolved name : the compiler errors")
print("  a compiled module : cached, not recompiled")
print("  modules that compiled : all " + str(modules))
print("  verdict : BUILDS CLEAN")
print("")
print("  erroring on an unresolved name is the part done right")
print("  here, and it is why a missing symbol never slips")
print("    through")
print("")
print("the import graph")
print("  what a single compile sees : one module and its")
print("    declared imports")
print("  what it does not see : whether the imports form a cycle")
print("  the three modules : each imports the next, the last")
print("    imports the first")
print("  a cycle in initialization : has no order that runs each")
print("    module after its dependencies")
print("  so one module at startup : reads another before it is")
print("    initialized")
print("")
print("the program starting up")
print("  modules loaded : all " + str(modules))
print("  the cycle's init order : undefined; something must go")
print("    first")
print("  what the first of the cycle reads : a module still at")
print("    its defaults")
print("  startups that read a half-initialized module : ")
print("    " + str(startups_that_read_a_half_initialized_module))
print("  did any module fail to compile : no; the fault is in")
print("    the graph, which no compile sees")
print("")
nc_cycles_the_per_module_build_reports = 0
nc_cycles_the_graph_check_reports = 1
nc_modules_it_would_name = 3
print("null control - a graph check over the imports")
print("  cycles the per-module build reports : ")
print("    " + str(nc_cycles_the_per_module_build_reports))
print("  cycles the graph check reports : ")
print("    " + str(nc_cycles_the_graph_check_reports))
print("  modules it would name : " + str(nc_modules_it_would_name))
print("  no module and no import changed; the check moved from")
print("  one module at a time to the graph they form")
print("")
print("what a clean per-module build guarantees")
print("  each module compiles against its declared imports :")
print("    exactly, all " + str(modules) + ", the compiler errors on a missing name")
print("  the program is well-formed : not addressed; each module")
print("    compiles alone, and compiling alone does not see the")
print("    import graph - " + str(modules_in_the_cycle) + " modules form a cycle, and one observes")
print("    another half-initialized at startup")
print("")
print("a property of each node is not a property of the graph; compilation ranges over")
print("a module and its edges, and a cycle is a fact about the whole graph that no")
print("single module's compile can hold")
print("")
print("Every module compiles alone against its declared imports, the compiler errors")
print("on a missing name - the build is clean. Three modules import each other in a")
print("cycle, which no single compile sees, so initialization has no valid order and ")
print("" + str(startups_that_read_a_half_initialized_module) + " startup reads a half-initialized module, under " + str(builds_that_failed) + " build failures.")
```

## stdout (executed)

```text
modules                         : 60
  that compile alone            : 60
  that failed to compile        : 0
builds that failed              : 0

modules in the cycle            : 3
  as a share of all modules     : 500 per ten thousand
  with no valid init order      : 3
startups reading a half-init module : 1

the per-module build
  each module : compiles in isolation
  imports : declared explicitly
  on an unresolved name : the compiler errors
  a compiled module : cached, not recompiled
  modules that compiled : all 60
  verdict : BUILDS CLEAN

  erroring on an unresolved name is the part done right
  here, and it is why a missing symbol never slips
    through

the import graph
  what a single compile sees : one module and its
    declared imports
  what it does not see : whether the imports form a cycle
  the three modules : each imports the next, the last
    imports the first
  a cycle in initialization : has no order that runs each
    module after its dependencies
  so one module at startup : reads another before it is
    initialized

the program starting up
  modules loaded : all 60
  the cycle's init order : undefined; something must go
    first
  what the first of the cycle reads : a module still at
    its defaults
  startups that read a half-initialized module : 
    1
  did any module fail to compile : no; the fault is in
    the graph, which no compile sees

null control - a graph check over the imports
  cycles the per-module build reports : 
    0
  cycles the graph check reports : 
    1
  modules it would name : 3
  no module and no import changed; the check moved from
  one module at a time to the graph they form

what a clean per-module build guarantees
  each module compiles against its declared imports :
    exactly, all 60, the compiler errors on a missing name
  the program is well-formed : not addressed; each module
    compiles alone, and compiling alone does not see the
    import graph - 3 modules form a cycle, and one observes
    another half-initialized at startup

a property of each node is not a property of the graph; compilation ranges over
a module and its edges, and a cycle is a fact about the whole graph that no
single module's compile can hold

Every module compiles alone against its declared imports, the compiler errors
on a missing name - the build is clean. Three modules import each other in a
cycle, which no single compile sees, so initialization has no valid order and 
1 startup reads a half-initialized module, under 0 build failures.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
