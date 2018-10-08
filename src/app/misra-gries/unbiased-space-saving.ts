import * as _ from 'lodash';

import {
  Counter,
} from './counter';
import {
  Item,
} from './item';

export class UnbiasedSpaceSaving {
  counters: Counter[];
  k: number;
  randomReplaceCount = 0;
  isPreviousItemReplaced = false;

  private _minCounter: Counter;
  get minCounter(): Counter {
    // If still have spaces, return 0.
    if (this.counters.length < this.k) {
      return new Counter('', 0);
    }
    if (this._minCounter && this._minCounter.count > 0) {
      return this._minCounter;
    }

    return new Counter('', 0);
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
    this.randomReplaceCount = 0;
  }

  update(item: Item, increment = 1) {
    let shouldReplace = false;

    if (this.isItemInSet(item)) {
      this.increaseCount(item, increment);
    } else if (this.counters.length < this.k) {
      // Create a new counter and set the initial value to 1
      const counter = new Counter(item.label, 1);
      this.counters.push(counter);
    } else {
      const minCounter = this.findMinCounter();
      shouldReplace = this.shouldReplace(minCounter);

      // Random replace based on min count
      if (shouldReplace) {
        this.randomReplaceCount++;
        this.replaceMinCounter(item);
      }
    }

    this.isPreviousItemReplaced = shouldReplace;
    this._minCounter = this.findMinCounter();
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

  /**
   * Should replace the target min counter?
   * @param minCounter The counter of min count
   */
  private shouldReplace(minCounter: Counter): boolean {
    let should = false;

    // Pick a number from 1 to (min + 1)
    const rand = _.random(1, minCounter.count + 1);

    // If the random number is 1 (p = 1/(min+1)) then set the 'should' variable to 1
    if (rand === 1) {
      should = true;
    }

    return should;
  }
}
