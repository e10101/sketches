export class Counter {
  label: string;
  count: number;
  decrementCount: number;

  constructor(label?: string, count = 0) {
    this.label = label;
    this.count = count;
  }
}
