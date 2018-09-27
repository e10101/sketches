import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

class Item {
  value: string;
  index: number;
}

@Component({
  selector: 'app-misra-gries',
  templateUrl: './misra-gries.component.html',
  styleUrls: ['./misra-gries.component.scss']
})
export class MisraGriesComponent implements OnInit {
  public fruits = '🍎🍐🍊🍋🍌🍉🍇🍓🍒🍑🍍🥝';
  public k = 5;
  public sampleSize = 100;
  public sample: Item[] = [];

  public fontSize = 32; // px

  public currentIndex: number;

  public get fruitsList(): string[] {
    return Array.from(this.fruits);
  }

  public get realCounting() {
    const count = _.countBy(this.sample, 'value');
    const arr = Object.keys(count).map(key => ({ key, value: count[key] }));

    const sorted = _.orderBy(arr, 'value', 'desc');
    return sorted;
  }

  constructor() { }

  ngOnInit(): void {}

  onGenerateSample() {
    const sample: Item[] = [];
    for (let i = 0; i < this.sampleSize; i++) {
      sample.push({
        value: _.sample(this.fruitsList),
        index: i + 1,
      });
    }

    // Reset the index
    this.currentIndex = 1;

    this.sample = sample;
  }

  onLargeFont() {
    this.fontSize *= 1.25;
  }

  onSmallFont() {
    this.fontSize *= 0.8;
  }

  onNextStep() {
    this.currentIndex++;
  }
}
