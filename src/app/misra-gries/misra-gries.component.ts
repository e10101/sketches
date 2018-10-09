import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { MisraGries } from './misra-gries';

import {
  Item,
} from './item';
import { SampleGenerator } from './sample-generator';
import {
  SampleType,
  SampleGeneratorType,
  MajorityPosition,
} from './sample-generator-type';
import { SpaceSaving } from './space-saving';
import {
  RealCounter,
} from './real-counter';
import { UnbiasedSpaceSaving } from './unbiased-space-saving';
import {
  UnbiasedMisraGries,
} from './unbiased-misra-gries';

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
  public fruits = '🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓🥝🍅🥥🥑🍆🥔🥕🌽🌶'
    + '🥒🥦🍄🥜🌰🍞🥐🥖🥨🥞🧀🍖🍗🥩🥓🍔🍟🍕🌭🥪🌮🌯🥙🥚🍳🥘🍲🥣🥗🍿'
    + '🥫🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🍡🥟🥠🥡🦀🦐🦑🍦🍧🍨🍩🍪🎂🍰🥧🍫🍬'
    + '🍭🍮🍯🍼🥛☕🍵🍶🍾🍷🍸🍹🍺🍻🥂🥃🥤🥢🍽🍴🥄🔪🏺';
  public categorySize = 7;
  public _k = 5;
  public _kSS = 6;
  public sampleSize = 100;
  public sample: Item[] = [];

  public fontSize = 32; // px

  public currentIndex: number;

  public sketch: MisraGries;
  public spaceSavingSketch: SpaceSaving;
  public realCounter: RealCounter;
  public unbiasedSpaceSaving: UnbiasedSpaceSaving;
  public unbiasedMisraGries: UnbiasedMisraGries;

  public isAutoNext = false;
  public autoNextOffsetSeconds = 1;  // ms
  private autoNextTimer = null;

  public hide = {
    config: true,
    stream: false,
    sketches: true,
    operation: false,
    mg: false,
    ss: false,
    uss: false,
    samples: true,
    rmg: false,
  };

  /**
   * Highlight the index
   */
  public highlightIndex = -1;

  public sampleTypeOptions = [
    new SampleTypeOption('Random', SampleType.RANDOM),
    new SampleTypeOption('Repeat', SampleType.REPEAT),
    new SampleTypeOption('Majority', SampleType.MAJORITY),
  ];
  public sampleTypeOption: SampleTypeOption = this.sampleTypeOptions[0];
  public get isMajorityOptionNow(): boolean {
    return this.sampleTypeOption.type === SampleType.MAJORITY;
  }
  public majorityCountOption = 1;
  public get majorityOptions(): number[] {
    return _.range(1, this.k + 1);
  }
  public majorityPosition: MajorityPosition = MajorityPosition.RANDOM;
  public get majorityPositionOptions(): MajorityPosition[] {
    return [
      MajorityPosition.BEGIN,
      MajorityPosition.END,
      MajorityPosition.RANDOM,
    ]
  }

  public get k(): number {
    return this._k;
  }
  public set k(val: number) {
    this._k = val;

    this.reCreateSketches();
  }
  public get kSS(): number {
    return this._kSS;
  }
  public set kSS(val: number) {
    this._kSS = val;

    this.reCreateSketches();
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

  public get majorityThreshold(): number {
    return Math.floor(this.sample.length / this.k);
  }

  constructor() {
    this.reCreateSketches();
  }

  ngOnInit(): void { }

  onGenerateSample() {
    this.sample = SampleGenerator.gen(this.sampleSize, this.categoryList, new SampleGeneratorType(this.sampleTypeOption.type, {
      k: this.k,
      majorityCount: this.majorityCountOption,
      majorityPosition: this.majorityPosition,
    }));

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
      this.unbiasedMisraGries.update(item);
      this.spaceSavingSketch.update(item);
      this.realCounter.update(item);
      this.unbiasedSpaceSaving.update(item);
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

  public onHighlightIndex(idx: number) {
    if (this.highlightIndex === idx) {
      this.highlightIndex = -1;
    } else {
      this.highlightIndex = idx;
    }
  }


  private cleanIndexAndSketch() {
    // Reset the index
    this.currentIndex = 0;

    this.reCreateSketches();

    this.isAutoNext = false;
    clearInterval(this.autoNextTimer);
  }

  private reCreateSketches() {
    this.sketch = new MisraGries(this.k);
    this.unbiasedMisraGries = new UnbiasedMisraGries(this.k);
    this.spaceSavingSketch = new SpaceSaving(this.kSS);
    this.realCounter = new RealCounter();
    this.unbiasedSpaceSaving = new UnbiasedSpaceSaving(this.kSS);
  }

  // isItemInSet(item: Item): boolean {
  //   //
  // }
}
