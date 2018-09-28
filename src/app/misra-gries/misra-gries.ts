import {
  Item,
} from './item';

export class Counter {
  label: string;
  count: number;

  constructor(label?: string, count = 0) {
    this.label = label;
    this.count = count;
  }
}
export class MisraGries {
  counters: Counter[];
  k: number;

  constructor(k = 5) {
    this.k = k;
    this.counters = [];
  }

  update(item: Item, increment = 1) {
    if (this.isItemInSet(item)) {
      this.increaseCount(item, increment);
    } else if (this.counters.length < this.k) {
      // Create a new counter and set the initial value to 1
      const counter = new Counter(item.label, 1);
      this.counters.push(counter);
    } else {
      this.decrementCounters();
    }
  }

  decrementCounters() {
    const newCounters = [];
    this.counters.forEach((counter) => {
      counter.count--;

      if (counter.count > 0) {
        newCounters.push(counter);
      }
    });


    this.counters = newCounters;
  }

  estimate(item: Item) {
    if (this.isItemInSet(item)) {
      const counter = this.getCounter(item);

      return counter.count;
    } else {
      return 0;
    }
  }

  private isItemInSet(item: Item): boolean {
    let isIn = false;
    this.counters.forEach((counter) => {
      if (counter.label === item.label) {
        isIn = true;
      }
    });

    return isIn;
  }

  private increaseCount(item: Item, increment: number): boolean {
    if (this.counters && this.counters.length > 0) {
      this.counters.forEach((counter) => {
        if (counter.label === item.label) {
          // Increase the counter.
          counter.count += increment;

          return true;
        }
      });
    }

    return false;
  }

  private getCounter(item: Item): Counter {
    let result = null;

    this.counters.forEach((counter) => {
      if (counter.label === item.label) {
        result = counter;
      }
    });

    return result;
  }
}
