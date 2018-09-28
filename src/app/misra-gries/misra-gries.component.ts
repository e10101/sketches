import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { MisraGries } from './misra-gries';

import {
  Item,
} from './item';

@Component({
  selector: 'app-misra-gries',
  templateUrl: './misra-gries.component.html',
  styleUrls: ['./misra-gries.component.scss']
})
export class MisraGriesComponent implements OnInit {
  public fruits = '🍎🍐🍊🍋🍌🍉🍇🍓🍒🍑🍍🥝';
  public _k = 5;
  public sampleSize = 20;
  public sample: Item[] = [];

  public fontSize = 32; // px

  public currentIndex: number;

  public sketch: MisraGries;

  public isAutoNext = false;
  public autoNextOffsetSeconds = 100;  // ms
  private autoNextTimer = null;

  public get k(): number {
    return this._k;
  }
  public set k(val: number) {
    this._k = val;

    this.sketch = new MisraGries(this.k);
  }

  public get fruitsList(): string[] {
    return Array.from(this.fruits);
  }

  public get realCounting() {
    const count = _.countBy(this.sample, 'label');
    const arr = Object.keys(count).map(key => ({ key, value: count[key] }));

    const sorted = _.orderBy(arr, 'label', 'desc');
    return sorted;
  }



  constructor() {
    this.sketch = new MisraGries(this.k);
  }

  ngOnInit(): void {}

  onGenerateSample() {
    const sample: Item[] = [];
    for (let i = 0; i < this.sampleSize; i++) {
      const label = _.sample(this.fruitsList);
      console.log('label', label);
      sample.push(new Item(label, i + 1));
    }

    // Reset the index
    this.currentIndex = 0;

    this.sample = sample;

    this.sketch = new MisraGries(this.k);

    this.isAutoNext = false;
    clearInterval(this.autoNextTimer);
  }

  onLargeFont() {
    this.fontSize *= 1.25;
  }

  onSmallFont() {
    this.fontSize *= 0.8;
  }

  onNextStep() {
    console.log('onNextStep');
    if (this.sample && this.sample.length <= this.currentIndex) {
      this.isAutoNext = false;
      return;
    }
    this.currentIndex++;

    console.log('currentIndex', this.currentIndex);

    if (this.currentIndex > 0) {
      const index = this.currentIndex - 1;

      const item = this.sample[index];

      this.sketch.update(item);
    }
  }

  onStartPause() {
    if (this.isAutoNext) {
      clearInterval(this.autoNextTimer);
    } else {
      console.log('timer now');
      if (this.autoNextTimer) {
        clearInterval(this.autoNextTimer);
      }
      this.autoNextTimer = setInterval(() => {
        this.onNextStep();
      }, this.autoNextOffsetSeconds);
    }

    this.isAutoNext = !this.isAutoNext;
  }

  // isItemInSet(item: Item): boolean {
  //   //
  // }
}
