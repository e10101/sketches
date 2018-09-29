import * as _ from 'lodash';

import {
  SampleGeneratorType, SampleType,
} from './sample-generator-type';
import {
  Item,
} from './item';

export class SampleGenerator {
  public static gen(
    sampleSize: number,
    categories: string[],
    sampleType: SampleGeneratorType
  ) {
    let sample: Item[] = [];

    switch (sampleType.type) {
      case SampleType.RANDOM:
        sample = SampleGenerator.genRandom(sampleSize, categories);
        break;
      case SampleType.REPEAT:
        sample = SampleGenerator.genRepeat(sampleSize, categories);
        break;
      default:
        // Default use the random sample
        sample = SampleGenerator.genRandom(sampleSize, categories);
        break;
    }

    return sample;
  }

  public static genRandom(sampleSize: number, categories: string[]) {
    const sample: Item[] = [];

    for (let i = 0; i < sampleSize; i++) {
      const label = _.sample(categories);
      sample.push(new Item(label, i + 1));
    }

    return sample;
  }

  public static genRepeat(sampleSize: number, categories: string[]) {
    const sample: Item[] = [];
    const cl = categories.length;

    let j = 0;
    for (let i = 0; i < sampleSize && j < categories.length; i++) {
      const category = categories[j];
      sample.push(new Item(category, i + 1));

      j++;
      if (j >= categories.length) {
        j = 0;
      }
    }

    return sample;
  }
}
