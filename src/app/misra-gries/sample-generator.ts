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
      case SampleType.MAJORITY:
        sample = SampleGenerator.genMajority(sampleSize, categories, sampleType.options.k);
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

  public static genMajority(sampleSize: number, categories: string[], k: number) {
    // K should not equal to 0
    k = k > 0 ? k : 1;

    let sample = SampleGenerator.genRandom(sampleSize, categories);

    if (sample && sample.length > 0) {
      const firstItem = sample[0];
      const minCount = Math.ceil(sampleSize / k);

      // Repeat the first sample item 'minCount' times.
      sample = _.fill(sample, firstItem, 0, minCount);

      sample = _.shuffle(sample);
    }

    return sample;
  }
}
