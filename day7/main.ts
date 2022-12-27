export class Program {
  public ip: number;
  public input: () => Promise<number> = () => {
    throw new Error("No input");
  };
  public output: (n: number) => void = () => {};
  public pmode = 0;
  constructor(
    public program: number[],
    input?: () => Promise<number>,
    output?: (n: number) => void,
  ) {
    this.ip = 0;
    if (input) this.input = input;
    if (output) this.output = output;
  }

  clone() {
    return new Program([...this.program], this.input, this.output);
  }

  static parse(input: string): Program {
    const nums = input.trim().split(",").map(Number);
    return new Program(nums);
  }

  get(p: number) {
    const val = this.program[p];
    if (val === undefined) throw new Error("Out of bounds");
    return val;
  }

  set(p: number, val: number) {
    if (p < 0 || p >= this.program.length) throw new Error("Out of bounds");
    this.program[p] = val;
  }

  inParam(pmode?: number) {
    const val = this.program[this.ip++];
    pmode ??= this.pmode % 10;
    this.pmode = Math.floor(this.pmode / 10);
    if (pmode == 0) return this.get(val);
    return val;
  }

  outParam() {
    return this.inParam(1);
  }

  doAdd() {
    const sum = this.inParam() + this.inParam();
    this.set(this.outParam(), sum);
  }

  doMul() {
    const prod = this.inParam() * this.inParam();
    this.set(this.outParam(), prod);
  }

  async doInput() {
    this.set(this.outParam(), await this.input());
  }

  doOutput() {
    this.output(this.inParam());
  }

  doJumpIfTrue() {
    const cond = this.inParam();
    const dest = this.inParam();
    if (cond) this.ip = dest;
  }

  doJumpIfFalse() {
    const cond = this.inParam();
    const dest = this.inParam();
    if (!cond) this.ip = dest;
  }

  doLess() {
    const a = this.inParam();
    const b = this.inParam();
    this.set(this.outParam(), a < b ? 1 : 0);
  }

  doEqual() {
    const a = this.inParam();
    const b = this.inParam();
    this.set(this.outParam(), a == b ? 1 : 0);
  }

  async run() {
    while (true) {
      let opcode = this.get(this.ip++);
      this.pmode = Math.floor(opcode / 100);
      opcode %= 100;
      switch (opcode) {
        case 99:
          return;
        case 1:
          this.doAdd();
          break;
        case 2:
          this.doMul();
          break;
        case 3:
          await this.doInput();
          break;
        case 4:
          this.doOutput();
          break;
        case 5:
          this.doJumpIfTrue();
          break;
        case 6:
          this.doJumpIfFalse();
          break;
        case 7:
          this.doLess();
          break;
        case 8:
          this.doEqual();
          break;
      }
    }
  }
}

function* permutations(nums: number[]): Generator<number[]> {
  if (nums.length <= 1) {
    yield nums;
    return;
  }
  for (const n of nums) {
    const oth = nums.filter((v) => v != n);
    for (const p of permutations(oth)) {
      p.push(n);
      yield p;
    }
  }
}

export async function part1(input: string): Promise<number> {
  const prog = Program.parse(input);
  let maxThruster = Number.NEGATIVE_INFINITY;
  for (const perm of permutations([0, 1, 2, 3, 4])) {
    let thruster = 0;
    for (const phase of perm) {
      const p = prog.clone();
      let i = 0;
      p.input = () => Promise.resolve(i++ ? thruster : phase);
      p.output = (n) => {
        thruster = n;
      };
      await p.run();
    }
    maxThruster = Math.max(thruster, maxThruster);
  }
  return maxThruster;
}

export async function part2(input: string): Promise<number> {
  const prog = Program.parse(input);
  let maxThruster = Number.NEGATIVE_INFINITY;
  for (const perm of permutations([5, 6, 7, 8, 9])) {
    const outputs = [[], [], [], [], [0]];
    const awaiting: ((n: number) => void)[][] = [[], [], [], [], []];
    let amp = 0;
    const progs: Program[] = [];
    for (const phase of perm) {
      progs.push(((amp: number): Program => {
        const p = prog.clone();
        let i = 0;
        p.input = (): Promise<number> => {
          if (i++ == 0) return Promise.resolve(phase);
          const tgt = (amp + 4) % 5;
          return new Promise((resolve) => {
            const val = outputs[tgt].pop();
            if (val === undefined) {
              awaiting[tgt].push(resolve);
            } else {
              resolve(val);
            }
          });
        };
        p.output = (n) => {
          const res = awaiting[amp].pop();
          if (res) {
            res(n);
          } else {
            outputs[amp].push(n);
          }
        };
        return p;
      })(amp));
      amp++;
    }
    await Promise.all(progs.map((p) => p.run()));
    maxThruster = Math.max(outputs[4].pop()!, maxThruster);
  }
  return maxThruster;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const input = Deno.readTextFileSync("input.txt");
  console.log("Part 1:", await part1(input));
  console.log("Part 2:", await part2(input));
}
