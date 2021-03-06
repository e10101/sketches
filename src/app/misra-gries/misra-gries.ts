import * as _ from 'lodash';

import {
  Item,
} from './item';
import {
  Counter,
} from './counter';

export class MisraGries {
  counters: Counter[];
  k: number;
  decrementCount: number;
  updatesCount = 0;

  get majorityThreshold(): number {
    const k = this.k > 0 ? this.k : 1;

    return Math.floor(this.updatesCount / k);
  }

  get sumCounts(): number {
    let sum = 0;
    this.counters.forEach((counter) => {
      sum += counter.count;
    });

    return sum;
  }

  filteredCounters(sorted = true): Counter[] {
    if (sorted) {
      return _.orderBy(this.counters, 'count', 'desc');
    }

    return this.counters;
  }

  get emptyCounters(): Counter[] {
    const count = this.k - this.counters.length;

    return _.range(0, count).map((idx) => {
      return new Counter();
    });
  }

  constructor(k = 5) {
    this.k = k;
    this.counters = [];

    this.decrementCount = 0;
    this.updatesCount = 0;
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

    this.updatesCount += increment;
  }

  decrementCounters() {
    this.decrementCount++;

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
