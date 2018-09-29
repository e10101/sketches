import {
  Counter,
} from './counter';
import {
  Item,
} from './item';

export class SpaceSaving {
  counters: Counter[];
  k: number;

  get sumCounts(): number {
    let sum = 0;
    this.counters.forEach((counter) => {
      sum += counter.count;
    });

    return sum;
  }

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
      this.replaceMinCounter(item);
    }
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

  private findMinCounter(): Counter {
    let result = null;

    const sorted = this.counters.sort((a, b) => {
      return a.count - b.count;
    });

    if (sorted.length > 0) {
      result = sorted[0];
    }

    return result;
  }

  private replaceMinCounter(item: Item) {
    const minCounter = this.findMinCounter();

    if (minCounter) {
      minCounter.label = item.label;
      minCounter.count++;
    }
  }
}