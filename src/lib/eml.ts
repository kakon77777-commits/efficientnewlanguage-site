/**
 * The EML bridge — re-exports the REAL browser-safe EML packages (run-from-source
 * via Vite aliases, see vite.config.ts). The playground uses these to transpile
 * and EXECUTE EML in the browser with no Python runtime: `interpret` is the
 * execution-truth interpreter whose output is gated to equal CPython's.
 */
export { transpileEmlToPython } from '@eml/transpiler-python';
export { transpilePythonToEml, roundTripFromEml, roundTripFromPython } from '@eml/transpiler-eml';
export { interpret, type InterpResult } from '@eml/interp';
export { parse } from '@eml/parser';
export { findAnomalies, summarize, toJsonl, type TraceEvent } from '@eml/trace';
