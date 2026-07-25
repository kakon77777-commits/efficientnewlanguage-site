<!-- canonical: efficientnewlanguage.org/ai/examples/093-rpn-evaluator | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 093 — Reverse Polish Notation evaluator

`rpn_evaluator.eml` evaluates four RPN expressions, e.g. `[3, 4, '+', 2, '*', 7, '/'] = 2` and `[5, 1, 2, '+', 4, '*', '+', 3, '-'] = 14`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Evaluates
# expressions in Reverse Polish Notation with a list as a stack: push
# operands, and on an operator pop two, combine, push the result back. The
# corpus's second stack application after
# examples/balanced-brackets-checker/ — that one only pushes and pops, this
# one computes with what it pops.
#
# Token lists mix numbers and operator strings directly, rather than
# parsing a text expression, because converting a string to an int is an
# interpreter-deferred construct; keeping the tokens pre-typed keeps this
# case fully covered by the eml:equiv execution-truth gate.

def evaluate_rpn(tokens):
    stack^+[]
    for token in tokens:
        if token == "+" or token == "-" or token == "*" or token == "/":
            len(stack) => depth
            stack[depth - 2] => a
            stack[depth - 1] => b
            stack[0:depth - 2] => stack
            if token == "+":
                a + b => value
            elif token == "-":
                a - b => value
            elif token == "*":
                a * b => value
            else:
                int(a / b) => value
            stack + [value] => stack
        else:
            stack + [token] => stack
    return stack[0]

expressions^+[[3, 4, "+", 2, "*", 7, "/"], [5, 1, 2, "+", 4, "*", "+", 3, "-"], [9], [2, 3, "*", 4, "-"]]

for tokens in expressions:
    evaluate_rpn(tokens) => result
    str(tokens) + " = " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def evaluate_rpn(tokens):
    stack = []
    for token in tokens:
        if token == "+" or token == "-" or token == "*" or token == "/":
            depth = len(stack)
            a = stack[depth - 2]
            b = stack[depth - 1]
            stack = stack[0:depth - 2]
            if token == "+":
                value = a + b
            elif token == "-":
                value = a - b
            elif token == "*":
                value = a * b
            else:
                value = int(a / b)
            stack = stack + [value]
        else:
            stack = stack + [token]
    return stack[0]

expressions = [[3, 4, "+", 2, "*", 7, "/"], [5, 1, 2, "+", 4, "*", "+", 3, "-"], [9], [2, 3, "*", 4, "-"]]
for tokens in expressions:
    result = evaluate_rpn(tokens)
    line = str(tokens) + " = " + str(result)
    print(line)
```

## stdout (executed)

```text
[3, 4, '+', 2, '*', 7, '/'] = 2
[5, 1, 2, '+', 4, '*', '+', 3, '-'] = 14
[9] = 9
[2, 3, '*', 4, '-'] = 2
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
