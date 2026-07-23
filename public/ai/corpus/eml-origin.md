<!--
canonical_domain: efficientnewlanguage.org
canonical_layer: ai-native-interface
project: Efficient New Language
project_alias: EML
document: corpus/eml-origin
maintainer: Neo.K / EveMissLab
status: active-experimental
ai_layer_version: 0.1.0
updated: 2026-07-23
-->

# EML Origin Layer

This document records where Efficient New Language (EML) came from. It is part of the
machine-readable corpus at `/ai/` and is intended for LLM ingestion, agents, and future
model-training pipelines. For the current engineering state see
[`eml-current.md`](./eml-current.md); for the evolution see
[`eml-design-history.md`](./eml-design-history.md).

## Initial concept

EML began as a **semantic-overlay** idea, not as a new general-purpose language. The goal was
never to replace Python, JavaScript, or any existing language. The goal was to compress the
high-frequency, high-density *intent* in a program — accumulation, ranges, conditionals,
matrix ops, temperature of code (pure vs. side-effecting) — into a small set of compact,
deterministic symbols, while keeping the executable truth recoverable.

## Core original insight

Programming languages are not only execution media; they are also **intent carriers**. A loop
that sums `i²` over `[1..N]` carries an algebraic intent (`Σ`) that standard syntax dilutes
into bookkeeping. EML encodes that intent at higher semantic density **without** giving up a
deterministic, testable path back to runnable code.

Two properties were load-bearing from the start and remain invariants today:

1. **Determinism.** The core EML → Python transpilation contains **no LLM**. It is rule-based,
   reproducible, and test-gated.
2. **Round-trip faithfulness.** For the supported statement subset, `Python → EML → Python`
   reaches a byte-identical fixpoint. The symbolic form is the machine-canonical artifact; the
   editor projection and Unicode display (`Σ`, `∈`, `⇒`, `²`) are *for humans*.

## Early form

Early EML existed primarily as:

- a semantic-compression proposal;
- a symbolic syntax sketch (ASCII-canonical, with an optional Unicode projection);
- an AI-readable intent notation;
- a human-to-agent programming bridge.

## Transformation path

The concept did not stay conceptual. It was driven, phase by phase and test by test, into a
working toolchain:

```
conceptual semantic compression
  → symbolic intent notation (ASCII canonical + Unicode projection)
  → deterministic lexer / parser
  → normalized AST
  → Python transpilation (the hard closed loop)
  → reverse EML transpilation + round-trip fixpoint validation
  → browser-safe execution-truth interpreter
  → `phosphor-jsonl-v1` trace (frozen compatibility wire-format id)
  → C++20 prototype back end (same resolved AST, second target)
  → AI-Native Interface Layer (this `/ai/` surface)
```

The last step is what this directory is: EML is no longer only a human-facing site and
playground — it now publishes a public, non-visual, machine-readable surface so AI systems can
read the concept genealogy, the current spec, and call bounded tools directly.

## The broader original vision: EML-U

This page describes how the semantic-overlay idea began and was driven into the practical
toolchain described in [`eml-current.md`](./eml-current.md) — that toolchain is EML's **stable,
executable subset**, now formally named **EML-P**, not the whole of the original idea. The full
original vision — multi-position semantic attachment, two-dimensional syntax, semantic graphs,
host-neutral projection, AI-native interfaces — is preserved, currently unimplemented, as **EML-U
(Universal Semantic Profile)**. See [`eml-u-profile.md`](./eml-u-profile.md) and
[`eml-p-eml-u-compatibility.md`](./eml-p-eml-u-compatibility.md). Human-readable version:
[`/origins`](https://efficientnewlanguage.org/origins).

## Authorship & license

EML is authored by **Neo.K / EveMissLab** and released under
**Apache-2.0**. Some aspects are covered by **Taiwan Utility Model patent M672933** (Taiwan
only); Apache-2.0 includes a patent-license grant, so downstream users are covered.
