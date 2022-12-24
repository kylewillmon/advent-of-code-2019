import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { check } from "./main.ts";

Deno.test("example", () => {
  assertEquals(check(111111, true), true);
  assertEquals(check(223450, true), false);
  assertEquals(check(123789, true), false);

  assertEquals(check(111111, false), false);
  assertEquals(check(223450, false), false);
  assertEquals(check(123789, false), false);
  assertEquals(check(112233, false), true);
  assertEquals(check(123444, false), false);
  assertEquals(check(111122, false), true);
});
