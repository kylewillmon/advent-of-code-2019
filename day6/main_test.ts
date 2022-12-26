import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
`;

Deno.test(function addTest() {
  assertEquals(part1(example), 42);
  assertEquals(part2(example.trim() + "\nK)YOU\nI)SAN"), 4);
});
