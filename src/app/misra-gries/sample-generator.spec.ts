import { SampleGenerator } from './sample-generator';
import { Item } from './item';

describe('SampleGenerator', () => {
  it('genRandom() should work correctly.', () => {
    const categories = ['A', 'B', 'C'];
    const sampleSize = 6;

    const sample = SampleGenerator.genRandom(sampleSize, categories);

    expect(sample).toBeTruthy();
    expect(sample.length).toBe(6);
  });

  it('genRepeat() should work correctly.', () => {
    const categories = ['A', 'B', 'C'];
    const sampleSize = 6;

    const sample = SampleGenerator.genRepeat(sampleSize, categories);

    expect(sample).toBeTruthy();
    expect(sample.length).toBe(6, 'sample size should be correct.');

    expect(sample[0].index).toBe(1);
    expect(sample[0].label).toBe('A');

    expect(sample[2].index).toBe(3);
    expect(sample[2].label).toBe('C');

    expect(sample[5].index).toBe(6);
    expect(sample[5].label).toBe('C');
  });
});
