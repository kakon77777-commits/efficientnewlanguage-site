<!--
canonical_domain: efficientnewlanguage.org
canonical_layer: ai-native-interface
project: Efficient New Language
project_alias: EML
document: corpus/eml-u-profile
maintainer: Neo.K / EveMissLab
status: active-experimental
ai_layer_version: 0.1.0
updated: 2026-07-23
-->

# EML-U — Universal Semantic Profile

EML formally splits into two profiles. This document covers **EML-U**, the original, complete
theory. For the practical, shipping subset, see [`eml-current.md`](./eml-current.md) and the
[EML-P Profile on GitHub](https://github.com/kakon77777-commits/efficientnewlanguage/blob/main/docs/EML-P-PROFILE.md).
For how the two relate, see [`eml-p-eml-u-compatibility.md`](./eml-p-eml-u-compatibility.md).
Human-readable version of this page: [`/origins`](https://efficientnewlanguage.org/origins).

## Definition

> EML-U is EML's complete original Profile. It centers on universal semantic attachment,
> high-density symbols, structural and intent compression, non-linear representation, and
> cross-host, AI-native collaboration.

EML-P ⊆ EML-U. EML-P is EML-U's stable, linear, low-ambiguity, engineered subset — see
`eml-current.md` for everything that subset actually is today (parser, Python/C++ transpilers,
Workbench, CLI, LSP, MCP, case corpus, Web Terminal).

## Current status: theory-preservation stage, zero engineering

As of this writing, **EML-U has no code and no independent engineering directory.** Its own
Phase U0 (theory preservation) is itself still in progress:

1. Archive the original historical EML theory documents (their exact file locations have not yet
   been inventoried — likely outside this repository, in the maintainer's own research archive).
2. Build a version timeline.
3. Mark which original concepts are implemented (as EML-P) vs. not yet implemented (still EML-U).
4. Never let EML-P's documentation retroactively define or shrink EML-U's theoretical boundary.

None of these four are complete. This document and its companions are the preservation work
itself, not a report of finished preservation.

## Preserved original capabilities (not implemented — recorded so they are not forgotten)

- Multi-position semantic attachment — upper-right, upper-left, lower-right, lower-left
- Semantic layers above and below the code
- Two-dimensional syntax, non-linear reading order
- Semantic graphs
- Multi-layer symbols, structural folding
- Intent nodes
- Host-neutral Semantic IR
- Multi-host projection — the same semantics projected to Python / C++ / JS / natural-language
  explanation / Agent JSON
- Natural-language attachment (e.g. "ship v1 next week" carrying deadline semantics)
- Data-field attachment (unit, type, source, privacy, quality)
- Workflow-node attachment (retryable, idempotent, needs human review, risk, cost)
- Multimedia time/space attachment (audio, image, video timelines, 3D scenes, game worlds)
- AI-adaptive display, domain-specific semantic packages, multiple reader-projections of the same
  semantics

## Engineering constraints EML-U must honor, even experimentally

EML-U may be more aggressive than EML-P — new symbols, two-dimensional syntax, new hosts, new
semantic node types are all fair game — but it may never lose: semantic identity, provenance,
scope, permissions, constraints, verifiability, degradability, version control, explicit
unsupported-marking, and explicit implementation-status marking. EML-U is not free-form symbol
doodling; it is meant to be a *more* rigorous semantic system than EML-P, not a less rigorous one.

## Downgrade relation to EML-P

$$
\Pi_P : \mathrm{EML\text{-}U} \rightarrow \mathrm{EML\text{-}P} \cup \mathrm{Metadata} \cup \mathrm{Unsupported}
$$

Any EML-U structure that fully downgrades becomes EML-P; anything executable but not fully
preservable becomes EML-P plus explicit metadata; anything unsafe to express is marked
`unsupported` explicitly. **No silent loss is allowed.** Full rules and the JSON interchange
shape live in [`eml-p-eml-u-compatibility.md`](./eml-p-eml-u-compatibility.md).

## EML-U's own roadmap (U0–U4)

Distinct from EML-P's own roadmap and from the deeper source architecture document's system-wide
migration numbering — EML-U's U-numbering belongs only to EML-U.

- **U0 — Theory preservation** (in progress): the four items listed above under "Current status."
- **U1 — Semantic ontology**: Semantic ID, Anchor Model, Overlay Node, Projection, Policy,
  Provenance, Semantic Graph.
- **U2 — 2D & multi-position syntax**: upper/lower semantic layers, two-dimensional flow, folding
  nodes, graph projection.
- **U3 — Cross-host**: code, natural language, tables, JSON, workflow, image, audio, video, game
  worlds.
- **U4 — AI-native interface**: agent semantic graph, intent compression, adaptive projection,
  semantic negotiation, human/AI dual view.

When EML-U engineering starts, it is meant to live in an independent experimental directory, not
mixed into EML-P's current packages.

## Authorship & license

EML is authored by **Neo.K / EveMissLab** and released under **Apache-2.0**. Some aspects are
covered by **Taiwan Utility Model patent M672933** (Taiwan only); Apache-2.0 includes a
patent-license grant, so downstream users are covered.
