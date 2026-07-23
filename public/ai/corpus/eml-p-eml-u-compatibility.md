<!--
canonical_domain: efficientnewlanguage.org
canonical_layer: ai-native-interface
project: Efficient New Language
project_alias: EML
document: corpus/eml-p-eml-u-compatibility
maintainer: Neo.K / EveMissLab
status: active-experimental
ai_layer_version: 0.1.0
updated: 2026-07-23
-->

# EML-P ↔ EML-U compatibility

This document covers only the relationship between EML's two profiles. For what each profile is
on its own, see [`eml-current.md`](./eml-current.md) (EML-P, shipping today) and
[`eml-u-profile.md`](./eml-u-profile.md) (EML-U, theory-preservation stage).

## Formal relation: subset

$$
\mathrm{EML\text{-}P} \subseteq \mathrm{EML\text{-}U}
$$

- Every EML-P program should have an EML-U semantic representation.
- EML-U can contain semantics EML-P does not support yet.
- EML-P is the stable, executable subset.
- EML-U is the complete semantic superset.

## Projection relation

EML-P can be understood as a linear projection of EML-U:

$$
\Pi_P : \mathrm{EML\text{-}U} \rightarrow \mathrm{EML\text{-}P} \cup \mathrm{Metadata} \cup \mathrm{Unsupported}
$$

For any EML-U structure:

1. If it fully downgrades, it becomes EML-P.
2. If it is not executable but is preservable, it becomes EML-P plus metadata.
3. If it cannot be safely expressed, it is marked `unsupported` explicitly.

## No silent loss

EML-U can hold constructs EML-P has no way to represent — multi-layer upper-right attachment,
two-dimensional branches, visual causal links, dynamic permissions, semantic confidence, and more.
When EML-P cannot represent one of these, **it must never just leave the surface code behind and
silently drop the rest of the semantics.** The system must instead emit something structured, e.g.:

```json
{
  "status": "partial_projection",
  "preserved": ["core_operation"],
  "metadata": ["confidence", "authority"],
  "unsupported": ["two_dimensional_branch"]
}
```

This structured result is not implemented yet (EML-U is still in its theory-preservation stage),
but **any future code that downgrades an EML-U structure to EML-P must follow this "report
explicitly, never silently drop" rule.** It is a hard requirement set now, not something deferred
until EML-U engineering begins.

## Allowed dependency direction

**Allowed:**
- EML-U understands EML-P.
- EML-U imports EML-P.
- EML-U generates EML-P.

**Not allowed:**
- EML-P specs retroactively deleting EML-U theory.
- EML-P's parser capability defining EML-U's entire boundary — i.e., EML-U's boundary must never
  be inferred backwards from "whatever EML-P's parser currently happens to accept." This is
  precisely the narrowing this whole dual-profile split exists to correct.

## Stability rules

**EML-P stability:** EML-P's formal grammar may not have its meaning silently redefined, may not
be broken by EML-U experiments, requires a deprecation process for any change, requires migration
support, and must keep round-trip fidelity and all existing tests passing.

**EML-U experimentation:** EML-U may swap projections, add symbols, try two-dimensional syntax,
introduce new semantic node types, test new hosts, and test new AI interfaces — but every change
must preserve version, semantic ID, migration path, compatibility notes, and degradation behavior.

## Interchange format (proposed, for when EML-U engineering begins)

```json
{ "eml_family": "EML", "profile": "P", "version": "1.0", "semantic_ir_version": "2.0" }
```

```json
{ "eml_family": "EML", "profile": "U", "version": "0.2", "semantic_ir_version": "2.0" }
```

## Acceptance criteria (dual-profile)

All of the following must hold simultaneously:

1. EML-P no longer claims to be all of EML.
2. EML-U is no longer bounded by the current parser's capability.
3. EML-P programs can enter EML-U's IR.
4. EML-U downgrades never silently lose information.
5. Documentation and the site clearly distinguish the two profiles.
6. The Symbol Palette and the (future) Semantic Overlay are clearly distinguished.
7. Python is an adapter, not all of EML.
8. EML-P continues to compress effectively.
