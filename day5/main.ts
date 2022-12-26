export class Program {
  public ip: number;
  public input: () => number = () => {
    throw new Error("No input");
  };
  public output: (n: number) => void = () => {};
  public pmode = 0;
  constructor(
    public program: number[],
    input?: () => number,
    output?: (n: number) => void,
  ) {
    this.ip = 0;
    if (input) this.input = input;
    if (output) this.output = output;
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

  doInput() {
    this.set(this.outParam(), this.input());
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

  run() {
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
          this.doInput();
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

function part1(input: string): number {
  const prog = Program.parse(input);
  let out = 0;
  prog.input = () => 1;
  prog.output = (n) => {
    console.log(n);
    out = n;
  };
  prog.run();
  return out;
}

function part2(input: string): number {
  const prog = Program.parse(input);
  let out = 0;
  prog.input = () => 5;
  prog.output = (n) => {
    console.log(n);
    out = n;
  };
  prog.run();
  return out;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("input.txt");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
