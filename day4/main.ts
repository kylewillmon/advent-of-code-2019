export function check(val: number, three_ok: boolean): boolean {
  const s = val.toString();
  for (let i = 1; i < s.length; i++) {
    if (s.charCodeAt(i) < s.charCodeAt(i - 1)) return false;
  }
  const counts = Array.from({ length: 10 }, () => 0);
  for (let i = 0; i < s.length; i++) {
    const digit = s.charCodeAt(i)! - "0".charCodeAt(0)!;
    counts[digit]++;
  }
  if (three_ok) {
    return counts.some((c) => c > 1);
  } else {
    return counts.some((c) => c == 2);
  }
}

function part1(input: string): number {
  const [start, end] = input.trim().split("-").map(Number);
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (check(i, true)) count++;
  }
  return count;
}

function part2(input: string): number {
  const [start, end] = input.trim().split("-").map(Number);
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (check(i, false)) count++;
  }
  return count;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("input.txt");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
