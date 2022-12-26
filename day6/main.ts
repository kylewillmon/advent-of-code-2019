function parse(input: string, directed: boolean): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const addToMap = (a: string, b: string) => {
    if (!map.has(a)) map.set(a, []);
    map.get(a)!.push(b);
  };
  input
    .split("\n")
    .filter((l) => l.trim())
    .forEach((l) => {
      const [a, b] = l.split(")");
      addToMap(a, b);
      if (!directed) {
        addToMap(b, a);
      }
    });
  return map;
}

export function part1(input: string): number {
  const orbits = parse(input, true);
  let i = 1;
  let total = 0;
  let gen: string[] = ["COM"];
  while (gen.length) {
    const nextGen: string[] = [];
    gen.flatMap((g) => orbits.get(g) ?? []).forEach((o) => {
      nextGen.push(o);
      total += i;
    });
    i++;
    gen = nextGen;
  }
  return total;
}

export function part2(input: string): number {
  const orbits = parse(input, false);
  const dists = new Map<string, number>(
    [...orbits.keys()].map((k) => [k, Number.POSITIVE_INFINITY]),
  );
  dists.set("YOU", 0);
  for (let i = 0; i < orbits.size; i++) {
    for (const [from, to] of orbits.entries()) {
      const distFrom = dists.get(from)!;
      if (distFrom == Number.POSITIVE_INFINITY) continue;
      for (const t of to) {
        if (dists.get(t)! > distFrom + 1) {
          dists.set(t, distFrom + 1);
        }
      }
    }
  }
  return dists.get("SAN")! - 2;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const input = Deno.readTextFileSync("input.txt");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
