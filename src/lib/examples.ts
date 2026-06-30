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

export interface SymbolRow {
  sym: string;
  py: string;
  desc: Record<Lang, string>;
}

/** A compact slice of the symbol catalog (eml-symbols.json) for the site. */
export const SYMBOLS: SymbolRow[] = [
  { sym: 'x^+100', py: 'x = 100 / x += 100', desc: { en: 'init if undeclared, else add-assign', zh: '未宣告則初始化，否則加法賦值' } },
  { sym: 'x^0', py: 'print(x)', desc: { en: 'output', zh: '輸出' } },
  { sym: 'x^-5  x^*2  x^/2', py: 'x -= 5  x *= 2  x /= 2', desc: { en: 'augmented assign', zh: '複合賦值' } },
  { sym: 'Σ(i^2, i in [1:N])', py: 'sum(i**2 for i in range(1, N+1))', desc: { en: 'summation over an inclusive range', zh: '對閉區間求和' } },
  { sym: 'i in [1:10]', py: 'i in range(1, 11)', desc: { en: 'inclusive range / membership', zh: '閉區間 / 成員測試' } },
  { sym: 'x > 40 ? A : B', py: 'A if x > 40 else B', desc: { en: 'conditional expression', zh: '三元條件式' } },
  { sym: 'f(x) => y', py: 'y = f(x)', desc: { en: 'call + bind', zh: '呼叫並綁定' } },
  { sym: '<M>(data)   m^T', py: 'np.array(data)   np.transpose(m)', desc: { en: 'matrix construct / transpose', zh: '矩陣建立 / 轉置' } },
  { sym: 'list^+[1,2,3]', py: 'lst = [1, 2, 3]', desc: { en: 'list literal', zh: '列表字面量' } },
  { sym: '@cold  @hot', py: '@functools.cache  # @hot', desc: { en: 'cold/hot separation', zh: '冷熱分離' } },
  { sym: '@temporal_loop(...)', py: 'asyncio temporal runtime', desc: { en: 'time loop, no busy-wait', zh: '時間迴圈，不空轉等待' } },
];
