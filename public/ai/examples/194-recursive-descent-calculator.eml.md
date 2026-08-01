<!-- canonical: efficientnewlanguage.org/ai/examples/194-recursive-descent-calculator | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 194 — Recursive descent: precedence lives in the nesting

`recursive_descent_calculator.eml` parses and evaluates arithmetic expressions with real operator precedence, parentheses, unary minus and error reporting.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A recursive
# descent parser and evaluator for arithmetic expressions, with real operator
# precedence and parentheses.
#
# This is the classic shape of a parser: one function per precedence level,
# each calling the next one down, and the grammar readable straight off the
# call graph.
#
#     expression  ->  term   (('+' | '-') term)*
#     term        ->  factor (('*' | '/' | '%') factor)*
#     factor      ->  NUMBER | '(' expression ')' | '-' factor
#
# What makes it worth a case is that precedence is not a property of any one
# function - it exists only in the nesting. Swap two levels and every
# individual function still looks right, every expression still parses, and
# `2 + 3 * 4` quietly becomes 20.
#
# So the checks are differential: every expression is evaluated by the parser
# AND written a second time with explicit parentheses that force the intended
# order. The two must agree. An expression whose value depends on precedence
# is worthless as a test if the expected answer was computed by the same code
# being tested.

def tokenize(text):
    [] => tokens
    0 => i
    while i < len(text):
        text[i] => ch
        if ch == " ":
            i + 1 => i
        elif ch >= "0" and ch <= "9":
            "" => digits
            while i < len(text) and text[i] >= "0" and text[i] <= "9":
                digits + text[i] => digits
                i + 1 => i
            tokens + [digits] => tokens
        else:
            tokens + [ch] => tokens
            i + 1 => i
    return tokens


# The parser threads a position through a one-element list, because EML has no
# reference parameters - a list is the smallest mutable box available.
def peek(tokens, pos):
    if pos[0] < len(tokens):
        return tokens[pos[0]]
    return ""

def advance(pos):
    pos[0] + 1 => pos[0]

def parse_factor(tokens, pos):
    peek(tokens, pos) => tok
    if tok == "-":
        advance(pos)
        return 0 - parse_factor(tokens, pos)
    if tok == "(":
        advance(pos)
        parse_expression(tokens, pos) => value
        if peek(tokens, pos) == ")":
            advance(pos)
        else:
            raise ValueError("expected ) at token " + str(pos[0]))
        return value
    if tok == "":
        raise ValueError("unexpected end of expression")
    advance(pos)
    return int(tok)

def parse_term(tokens, pos):
    parse_factor(tokens, pos) => left
    True => going
    while going:
        peek(tokens, pos) => op
        if op == "*":
            advance(pos)
            left * parse_factor(tokens, pos) => left
        elif op == "/":
            advance(pos)
            parse_factor(tokens, pos) => right
            if right == 0:
                raise ValueError("division by zero")
            left / right => left
        elif op == "%":
            advance(pos)
            parse_factor(tokens, pos) => right
            if right == 0:
                raise ValueError("modulo by zero")
            left % right => left
        else:
            False => going
    return left

def parse_expression(tokens, pos):
    parse_term(tokens, pos) => left
    True => going
    while going:
        peek(tokens, pos) => op
        if op == "+":
            advance(pos)
            left + parse_term(tokens, pos) => left
        elif op == "-":
            advance(pos)
            left - parse_term(tokens, pos) => left
        else:
            False => going
    return left

def evaluate(text):
    tokenize(text) => tokens
    [0] => pos
    parse_expression(tokens, pos) => value
    if pos[0] < len(tokens):
        raise ValueError("trailing input at token " + str(pos[0]))
    return value


# (expression, the same expression fully parenthesised)
[
    ["2 + 3 * 4", "2 + (3 * 4)"],
    ["2 * 3 + 4", "(2 * 3) + 4"],
    ["10 - 2 - 3", "(10 - 2) - 3"],
    ["100 / 5 / 2", "(100 / 5) / 2"],
    ["2 + 3 * 4 - 5", "2 + ((3 * 4) - 5)"],
    ["(2 + 3) * 4", "(2 + 3) * 4"],
    ["17 % 5 + 1", "(17 % 5) + 1"],
    ["1 + 2 * 3 % 4", "1 + ((2 * 3) % 4)"],
    ["-3 + 10", "(0 - 3) + 10"],
    ["2 * -(3 + 1)", "2 * (0 - (3 + 1))"],
    ["((((7))))", "7"],
    ["1 + 2 + 3 + 4 + 5", "((((1 + 2) + 3) + 4) + 5)"],
] => pairs

"expression                 value    parenthesised twin agrees"^0
0 => agree
for pair in pairs:
    evaluate(pair[0]) => a
    evaluate(pair[1]) => b
    if a == b:
        agree + 1 => agree
    ("  %-24s %6s    %s" % (pair[0], str(a), str(a == b)))^0

# ------------------------------------------------------------- malformed input
""^0
"Malformed input must raise, not return a wrong number:"^0
["2 +", "(1 + 2", "1 / 0", "4 5", ")", "1 % 0"] => bad
0 => rejected
for text in bad:
    try:
        evaluate(text) => value
        ("  " + text + " -> returned " + str(value) + "  (SHOULD HAVE RAISED)")^0
    except ValueError as e:
        rejected + 1 => rejected
        ("  %-8s -> %s" % (text, str(e)))^0

""^0
("precedence pairs agreeing: " + str(agree) + "/" + str(len(pairs)))^0
("malformed inputs rejected: " + str(rejected) + "/" + str(len(bad)))^0

""^0
if agree == len(pairs) and rejected == len(bad):
    "Precedence, associativity, parentheses and error handling all hold." => verdict
else:
    "FAILED - the grammar levels are wired wrong." => verdict
verdict^0

""^0
"Precedence lives in the nesting, not in any one function. Swap parse_term" => n1
n1^0
"and parse_expression and every function still reads correctly, every input" => n2
n2^0
"still parses, and 2 + 3 * 4 becomes 20. That is why each expression is" => n3
n3^0
"checked against a parenthesised twin rather than a number typed by hand." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def tokenize(text):
    tokens = []
    i = 0
    while i < len(text):
        ch = text[i]
        if ch == " ":
            i = i + 1
        elif ch >= "0" and ch <= "9":
            digits = ""
            while i < len(text) and text[i] >= "0" and text[i] <= "9":
                digits = digits + text[i]
                i = i + 1
            tokens = tokens + [digits]
        else:
            tokens = tokens + [ch]
            i = i + 1
    return tokens

def peek(tokens, pos):
    if pos[0] < len(tokens):
        return tokens[pos[0]]
    return ""

def advance(pos):
    pos[0] = pos[0] + 1

def parse_factor(tokens, pos):
    tok = peek(tokens, pos)
    if tok == "-":
        advance(pos)
        return 0 - parse_factor(tokens, pos)
    if tok == "(":
        advance(pos)
        value = parse_expression(tokens, pos)
        if peek(tokens, pos) == ")":
            advance(pos)
        else:
            raise ValueError("expected ) at token " + str(pos[0]))
        return value
    if tok == "":
        raise ValueError("unexpected end of expression")
    advance(pos)
    return int(tok)

def parse_term(tokens, pos):
    left = parse_factor(tokens, pos)
    going = True
    while going:
        op = peek(tokens, pos)
        if op == "*":
            advance(pos)
            left = left * parse_factor(tokens, pos)
        elif op == "/":
            advance(pos)
            right = parse_factor(tokens, pos)
            if right == 0:
                raise ValueError("division by zero")
            left = left / right
        elif op == "%":
            advance(pos)
            right = parse_factor(tokens, pos)
            if right == 0:
                raise ValueError("modulo by zero")
            left = left % right
        else:
            going = False
    return left

def parse_expression(tokens, pos):
    left = parse_term(tokens, pos)
    going = True
    while going:
        op = peek(tokens, pos)
        if op == "+":
            advance(pos)
            left = left + parse_term(tokens, pos)
        elif op == "-":
            advance(pos)
            left = left - parse_term(tokens, pos)
        else:
            going = False
    return left

def evaluate(text):
    tokens = tokenize(text)
    pos = [0]
    value = parse_expression(tokens, pos)
    if pos[0] < len(tokens):
        raise ValueError("trailing input at token " + str(pos[0]))
    return value

pairs = [["2 + 3 * 4", "2 + (3 * 4)"], ["2 * 3 + 4", "(2 * 3) + 4"], ["10 - 2 - 3", "(10 - 2) - 3"], ["100 / 5 / 2", "(100 / 5) / 2"], ["2 + 3 * 4 - 5", "2 + ((3 * 4) - 5)"], ["(2 + 3) * 4", "(2 + 3) * 4"], ["17 % 5 + 1", "(17 % 5) + 1"], ["1 + 2 * 3 % 4", "1 + ((2 * 3) % 4)"], ["-3 + 10", "(0 - 3) + 10"], ["2 * -(3 + 1)", "2 * (0 - (3 + 1))"], ["((((7))))", "7"], ["1 + 2 + 3 + 4 + 5", "((((1 + 2) + 3) + 4) + 5)"]]
print("expression                 value    parenthesised twin agrees")
agree = 0
for pair in pairs:
    a = evaluate(pair[0])
    b = evaluate(pair[1])
    if a == b:
        agree = agree + 1
    print("  %-24s %6s    %s" % (pair[0], str(a), str(a == b)))
print("")
print("Malformed input must raise, not return a wrong number:")
bad = ["2 +", "(1 + 2", "1 / 0", "4 5", ")", "1 % 0"]
rejected = 0
for text in bad:
    try:
        value = evaluate(text)
        print("  " + text + " -> returned " + str(value) + "  (SHOULD HAVE RAISED)")
    except ValueError as e:
        rejected = rejected + 1
        print("  %-8s -> %s" % (text, str(e)))
print("")
print("precedence pairs agreeing: " + str(agree) + "/" + str(len(pairs)))
print("malformed inputs rejected: " + str(rejected) + "/" + str(len(bad)))
print("")
if agree == len(pairs) and rejected == len(bad):
    verdict = "Precedence, associativity, parentheses and error handling all hold."
else:
    verdict = "FAILED - the grammar levels are wired wrong."
print(verdict)
print("")
n1 = "Precedence lives in the nesting, not in any one function. Swap parse_term"
print(n1)
n2 = "and parse_expression and every function still reads correctly, every input"
print(n2)
n3 = "still parses, and 2 + 3 * 4 becomes 20. That is why each expression is"
print(n3)
n4 = "checked against a parenthesised twin rather than a number typed by hand."
print(n4)
```

## stdout (executed)

```text
expression                 value    parenthesised twin agrees
  2 + 3 * 4                    14    True
  2 * 3 + 4                    10    True
  10 - 2 - 3                    5    True
  100 / 5 / 2                10.0    True
  2 + 3 * 4 - 5                 9    True
  (2 + 3) * 4                  20    True
  17 % 5 + 1                    3    True
  1 + 2 * 3 % 4                 3    True
  -3 + 10                       7    True
  2 * -(3 + 1)                 -8    True
  ((((7))))                     7    True
  1 + 2 + 3 + 4 + 5            15    True

Malformed input must raise, not return a wrong number:
  2 +      -> unexpected end of expression
  (1 + 2   -> expected ) at token 4
  1 / 0    -> division by zero
  4 5      -> trailing input at token 1
  )        -> invalid literal for int() with base 10: ')'
  1 % 0    -> modulo by zero

precedence pairs agreeing: 12/12
malformed inputs rejected: 6/6

Precedence, associativity, parentheses and error handling all hold.

Precedence lives in the nesting, not in any one function. Swap parse_term
and parse_expression and every function still reads correctly, every input
still parses, and 2 + 3 * 4 becomes 20. That is why each expression is
checked against a parenthesised twin rather than a number typed by hand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
