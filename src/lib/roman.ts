const MAP: ReadonlyArray<readonly [string, number]> = [
  ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
  ['C', 100],  ['XC', 90],  ['L', 50],  ['XL', 40],
  ['X', 10],   ['IX', 9],   ['V', 5],   ['IV', 4],
  ['I', 1],
];

export function toRoman(n: number): string {
  let num = n;
  let out = '';
  for (const [s, v] of MAP) {
    while (num >= v) { out += s; num -= v; }
  }
  return out;
}
