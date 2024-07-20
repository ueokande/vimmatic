export class HintTagProducer {
  private counter: number[] = [];

  constructor(private readonly charset: string) {}

  produce(): string {
    if (this.charset === "") {
      throw new Error("charset is not set");
    }
    this.increment();

    return this.counter.map((x) => this.charset[x]).join("");
  }

  produceN(count: number): string[] {
    const tags = [];
    for (let i = 0; i < count; ++i) {
      tags.push(this.produce());
    }
    return tags;
  }

  private increment(): void {
    const max = this.charset.length - 1;
    if (this.counter.every((x) => x === max)) {
      this.counter = new Array(this.counter.length + 1).fill(0);
      return;
    }

    this.counter.reverse();
    const len = this.charset.length;
    let num = this.counter.reduce((x, y, index) => x + y * len ** index) + 1;
    for (let i = 0; i < this.counter.length; ++i) {
      this.counter[i] = num % len;
      num = ~~(num / len);
    }
    this.counter.reverse();
  }
}
