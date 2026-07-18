import type { Lang } from '../i18n';

export interface Example {
  id: string;
  name: Record<Lang, string>;
  eml: string;
}

/** EML programs for the playground (EML → Python direction). */
export const EML_EXAMPLES: Example[] = [
  {
    id: 'sum',
    name: { en: 'Sum of squares', zh: '平方和' },
    eml: 'N^+100\nΣ(i^2, i in [1:N]) => r\nr^0',
  },
  {
    id: 'coldhot',
    name: { en: 'Cold / hot functions', zh: '冷 / 熱函數' },
    eml: [
      '# cold = pure, cacheable logic',
      '@cold',
      'def square_sum(N):',
      '    Σ(i^2, i in [1:N]) => r',
      '    return r',
      '',
      '# hot = dynamic state / I/O',
      '@hot',
      'def greet(name):',
      '    name^0',
      '    return name',
      '',
      'square_sum(100) => total',
      'total^0',
      'greet(total)',
    ].join('\n'),
  },
  {
    id: 'closure',
    name: { en: 'Closures', zh: '閉包' },
    eml: 'def adder(n):\n    def add(x):\n        return x + n\n    add(10) => r\n    return r\n\nadder(5) => out\nout^0',
  },
  {
    id: 'conditional',
    name: { en: 'Conditional + range', zh: '條件 + 區間' },
    eml: 'x^+50\nx > 40 ? 1 : 0 => y\ny^0\nx in [1:100] => inRange\ninRange^0',
  },
  {
    id: 'recursion',
    name: { en: 'Recursion', zh: '遞迴' },
    eml: 'def fact(n):\n    n <= 1 ? 1 : n * fact(n - 1) => r\n    return r\n\nfact(6) => x\nx^0',
  },
  {
    id: 'augmented',
    name: { en: 'Augmented assign', zh: '複合賦值' },
    eml: 'x^+100\nx^+10\nx^*2\nx^0',
  },
  {
    id: 'porttictactoe',
    name: { en: 'Real port: Tic-Tac-Toe', zh: '真實移植：圈叉遊戲' },
    eml: [
      '# Ported from Python-World/python-mini-projects (MIT) — a real,',
      '# independently-authored program, not written to test one feature.',
      '# The original is interactive (input()); this version scripts a fixed',
      '# move sequence, including one deliberately invalid move, so it stays',
      '# fully deterministic here.',
      'class TicTacToe:',
      '    def __init__(self):',
      '        [" ", " ", " ", " ", " ", " ", " ", " ", " "] => self.squares',
      '        [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]] => self.win_lines',
      '        "X" => self.current',
      '',
      '    def play_move(self, position):',
      '        if self.squares[position] != " ":',
      '            raise ValueError("square already taken")',
      '        self.current => self.squares[position]',
      '',
      '    def has_won(self):',
      '        for line in self.win_lines:',
      '            {self.squares[line[0]], self.squares[line[1]], self.squares[line[2]]} == {self.current} ? 1 : 0 => hit',
      '            if hit == 1:',
      '                return 1',
      '        return 0',
      '',
      '    def next_turn(self):',
      '        self.current == "X" ? "O" : "X" => self.current',
      '',
      'TicTacToe() => game',
      'moves^+[0, 4, 1, 5, 0, 2]',
      'winner^+""',
      '',
      'for move in moves:',
      '    try:',
      '        game.play_move(move)',
      '    except ValueError:',
      '        continue',
      '    game.has_won() => won',
      '    if won == 1:',
      '        game.current => winner',
      '        break',
      '    game.next_turn()',
      '',
      'game.squares => final_board',
      'final_board^0',
      'winner^0',
    ].join('\n'),
  },
];

/** Python programs for the reverse (Python → EML) direction. */
export const PY_EXAMPLES: Example[] = [
  {
    id: 'pysum',
    name: { en: 'Sum of squares', zh: '平方和' },
    eml: 'N = 100\nr = sum(i**2 for i in range(1, N+1))\nprint(r)',
  },
  {
    id: 'pycond',
    name: { en: 'Conditional', zh: '條件式' },
    eml: 'x = 50\ny = 1 if x > 40 else 0\nprint(y)',
  },
  {
    id: 'pyaug',
    name: { en: 'Augmented', zh: '複合賦值' },
    eml: 'x = 100\nx += 10\nx *= 2\nprint(x)',
  },
];

/** Implementation status, matching the vocabulary in eml-semantic-model-v1.5.md §2. */
export type SymbolStatus = 'implemented' | 'partial' | 'conceptual' | 'planned';

export interface SymbolRow {
  sym: string;
  py: string;
  desc: Record<Lang, string>;
  /** Syntax family / category, matching eml-symbols.json's `category` field. */
  family: string;
  status: SymbolStatus;
}

/** A compact slice of the symbol catalog (eml-symbols.json) for the site, grouped into syntax
 * families with an implementation-status label. See eml-semantic-model-v1.5.md §2-3. */
export const SYMBOLS: SymbolRow[] = [
  { sym: 'x^+100', py: 'x = 100 / x += 100', family: 'assignment', status: 'implemented', desc: { en: 'init if undeclared, else add-assign', zh: '未宣告則初始化，否則加法賦值' } },
  { sym: 'x^0', py: 'print(x)', family: 'control', status: 'implemented', desc: { en: 'output', zh: '輸出' } },
  { sym: 'x^-5  x^*2  x^/2', py: 'x -= 5  x *= 2  x /= 2', family: 'assignment', status: 'implemented', desc: { en: 'augmented assign', zh: '複合賦值' } },
  { sym: 'Σ(i^2, i in [1:N])', py: 'sum(i**2 for i in range(1, N+1))', family: 'algebraic', status: 'implemented', desc: { en: 'summation over an inclusive range', zh: '對閉區間求和' } },
  { sym: 'i in [1:10]', py: 'i in range(1, 11)', family: 'range', status: 'implemented', desc: { en: 'inclusive range / membership', zh: '閉區間 / 成員測試' } },
  { sym: 'x > 40 ? A : B', py: 'A if x > 40 else B', family: 'conditional', status: 'implemented', desc: { en: 'conditional expression', zh: '三元條件式' } },
  { sym: 'x and y  x or y  not x', py: 'x and y  x or y  not x', family: 'boolean', status: 'implemented', desc: { en: 'short-circuit and/or, unary not', zh: '短路 and/or，一元 not' } },
  { sym: 'f(x) => y', py: 'y = f(x)', family: 'assignment', status: 'implemented', desc: { en: 'call + bind', zh: '呼叫並綁定' } },
  { sym: '<M>(data)   m^T', py: 'np.array(data)   np.transpose(m)', family: 'matrix', status: 'implemented', desc: { en: 'matrix construct / transpose (round-trips too)', zh: '矩陣建立 / 轉置（也可還原）' } },
  { sym: 'list^+[1,2,3]', py: 'lst = [1, 2, 3]', family: 'collection', status: 'implemented', desc: { en: 'list literal', zh: '列表字面量' } },
  { sym: 'def f(...): ...', py: 'def f(...): ...', family: 'function', status: 'implemented', desc: { en: 'function definition (round-trips, except @hot — see below)', zh: '函數定義（可還原，@hot 除外，見下）' } },
  { sym: '@cold  @hot', py: '@functools.cache  # @hot', family: 'temperature', status: 'implemented', desc: { en: 'cold/hot separation — @hot is a permanent, comment-only round-trip exception', zh: '冷熱分離 — @hot 是永久性、僅限註解的還原例外' } },
  { sym: '@temporal_loop(...)', py: 'asyncio temporal runtime', family: 'temporal', status: 'partial', desc: { en: 'time loop, no busy-wait; forward-only', zh: '時間迴圈，不空轉等待；僅能正向轉譯' } },
];

export interface LoopTaxonomyRow {
  id: string;
  name: Record<Lang, string>;
  rule: Record<Lang, string>;
  status: SymbolStatus;
  /** loopKind tag(s) currently emitted for this class, when partial/implemented. */
  loopKind?: string;
}

/** The recovered twelve-loop semantic taxonomy. See eml-semantic-model-v1.5.md §5. */
export const LOOP_TAXONOMY: LoopTaxonomyRow[] = [
  { id: 'L1', name: { en: 'Basic repetition', zh: '基本重複' }, rule: { en: 'Repeat a deterministic body a bounded number of times.', zh: '以固定次數重複一段確定性的程式區塊。' }, status: 'partial', loopKind: 'basic_repeat, for_loop' },
  { id: 'L2', name: { en: 'Conditional loop', zh: '條件迴圈' }, rule: { en: 'Continue while a predicate holds.', zh: '在條件成立期間持續執行。' }, status: 'partial', loopKind: 'while_loop' },
  { id: 'L3', name: { en: 'Algebraic loop', zh: '代數迴圈' }, rule: { en: 'Accumulate under an algebraic operator.', zh: '以代數運算子進行累加。' }, status: 'partial', loopKind: 'algebraic_sum' },
  { id: 'L4', name: { en: 'Event loop', zh: '事件迴圈' }, rule: { en: 'Wait for and dispatch external events.', zh: '等待並派發外部事件。' }, status: 'conceptual' },
  { id: 'L5', name: { en: 'Convergent loop', zh: '收斂迴圈' }, rule: { en: 'Iterate toward a fixed point within tolerance.', zh: '在容許誤差內迭代逼近不動點。' }, status: 'conceptual' },
  { id: 'L6', name: { en: 'Recursive loop', zh: '遞迴迴圈' }, rule: { en: 'Generate repetition through self- or cycle-calls.', zh: '透過自我或循環呼叫產生重複。' }, status: 'partial', loopKind: 'recursive' },
  { id: 'L7', name: { en: 'Fractal loop', zh: '碎形迴圈' }, rule: { en: 'Repeat a self-similar transformation across depth.', zh: '在不同深度重複自相似的轉換。' }, status: 'conceptual' },
  { id: 'L8', name: { en: 'Quantum loop', zh: '量子迴圈' }, rule: { en: 'Evolve a superposed state and collapse by measurement.', zh: '演化疊加狀態並透過量測坍縮。' }, status: 'conceptual' },
  { id: 'L9', name: { en: 'Chaotic loop', zh: '混沌迴圈' }, rule: { en: 'Deterministic transition with high sensitivity to initial conditions.', zh: '確定性轉移，但對初始條件高度敏感。' }, status: 'conceptual' },
  { id: 'L10', name: { en: 'Spiral loop', zh: '螺旋迴圈' }, rule: { en: 'Follow one selected, progressively refined trajectory.', zh: '沿單一路徑逐步精煉軌跡。' }, status: 'conceptual' },
  { id: 'L11', name: { en: 'Evolutionary loop', zh: '演化迴圈' }, rule: { en: 'Generate multiple candidates and select by an objective function.', zh: '產生多個候選並依目標函數選擇。' }, status: 'conceptual' },
  { id: 'L12', name: { en: 'Temporal loop', zh: '時間迴圈' }, rule: { en: 'Suspend without busy-waiting until a condition, event, or deadline matures.', zh: '在不空轉等待的情況下暫停，直到條件、事件或期限成熟。' }, status: 'partial', loopKind: 'temporal' },
];
