import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { MisraGries } from './misra-gries';

import {
  Item,
} from './item';
import { SampleGenerator } from './sample-generator';
import { SampleType, SampleGeneratorType } from './sample-generator-type';
import { SpaceSaving } from './space-saving';

export class SampleTypeOption {
  label: string;
  type: SampleType;

  constructor(label?: string, type: SampleType = SampleType.RANDOM) {
    this.label = label;
    this.type = type;
  }
}

@Component({
  selector: 'app-misra-gries',
  templateUrl: './misra-gries.component.html',
  styleUrls: ['./misra-gries.component.scss']
})
export class MisraGriesComponent implements OnInit {
  public fruits = '🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓🥝🍅🥥🥑🍆🥔🥕🌽🌶🥒🥦🍄🥜🌰';
  public categorySize = 6;
  public _k = 5;
  public sampleSize = 80;
  public sample: Item[] = [];

  public fontSize = 32; // px

  public currentIndex: number;

  public sketch: MisraGries;
  public spaceSavingSketch: SpaceSaving;

  public isAutoNext = false;
  public autoNextOffsetSeconds = 10;  // ms
  private autoNextTimer = null;

  public sampleTypeOptions = [
    new SampleTypeOption('Random', SampleType.RANDOM),
    new SampleTypeOption('Repeat', SampleType.REPEAT),
  ];
  public sampleTypeOption: SampleTypeOption = this.sampleTypeOptions[0];

  public get k(): number {
    return this._k;
  }
  public set k(val: number) {
    this._k = val;

    this.sketch = new MisraGries(this.k);
    this.spaceSavingSketch = new SpaceSaving(this.k);
  }

  public get fruitsList(): string[] {
    const list = Array.from(this.fruits).filter((ch) => {
      return ch.charCodeAt(0) > 1000;
    });

    return _.uniq(list);
  }

  public get categoryList(): string[] {
    return this.fruitsList.slice(0, this.categorySize);
  }

  public get realCounting() {
    const count = _.countBy(this.sample, 'label');
    const arr = Object.keys(count).map(key => ({ key, value: count[key] }));

    const sorted = _.orderBy(arr, 'value', 'desc');
    return sorted;
  }

  constructor() {
    this.sketch = new MisraGries(this.k);
    this.spaceSavingSketch = new SpaceSaving(this.k);
  }

  ngOnInit(): void { }

  onGenerateSample() {
    this.sample = SampleGenerator.gen(this.sampleSize, this.categoryList, new SampleGeneratorType(this.sampleTypeOption.type));

    this.cleanIndexAndSketch();
  }

  onLargeFont() {
    this.fontSize *= 1.25;
  }

  onSmallFont() {
    this.fontSize *= 0.8;
  }

  onNextStep() {
    if (this.sample && this.sample.length <= this.currentIndex) {
      this.isAutoNext = false;
      return;
    }
    this.currentIndex++;

    if (this.currentIndex > 0) {
      const index = this.currentIndex - 1;

      const item = this.sample[index];

      this.sketch.update(item);
      this.spaceSavingSketch.update(item);
    }
  }

  onStartPause() {
    if (this.isAutoNext) {
      clearInterval(this.autoNextTimer);
    } else {
      if (this.autoNextTimer) {
        clearInterval(this.autoNextTimer);
      }
      this.autoNextTimer = setInterval(() => {
        this.onNextStep();
      }, this.autoNextOffsetSeconds);
    }

    this.isAutoNext = !this.isAutoNext;
  }

  onResetIndex() {
    this.cleanIndexAndSketch();
  }

  private cleanIndexAndSketch() {
    // Reset the index
    this.currentIndex = 0;

    this.sketch = new MisraGries(this.k);
    this.spaceSavingSketch = new SpaceSaving(this.k);

    this.isAutoNext = false;
    clearInterval(this.autoNextTimer);
  }

  // isItemInSet(item: Item): boolean {
  //   //
  // }
}
