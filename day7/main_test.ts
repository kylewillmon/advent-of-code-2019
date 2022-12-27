import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { part1, part2 } from "./main.ts";

const example = `
3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0
`;

const example2 = `
3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
`;

Deno.test("example", async () => {
  assertEquals(await part1(example), 43210);
  assertEquals(await part2(example2), 139629729);
});
