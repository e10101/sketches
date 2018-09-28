import {
  Item,
} from './item';
import {
  MisraGries,
} from './misra-gries';

describe('MisraGries', () => {
  let sketch: MisraGries;
  beforeEach(() => {
    sketch = new MisraGries();
  });

  it('should have an empty set after constructed', () => {
    expect(sketch.counters).toBeTruthy();

    expect(sketch.counters.length).toBe(0);
  });

  it('should increase the set after updates', () => {
    expect(sketch.counters.length).toBe(0);

    sketch.update(new Item('A'));

    expect(sketch.counters.length).toBe(1);

    sketch.update(new Item('A'));

    expect(sketch.counters.length).toBe(1);

    sketch.update(new Item('B'));

    expect(sketch.counters.length).toBe(2);

    expect(sketch.estimate(new Item('A'))).toBe(2, 'The count of "A" should be 2');
    expect(sketch.estimate(new Item('B'))).toBe(1, 'The count of "B" should be 1');
  });

  it('should decrement counters', () => {
    expect(sketch.counters.length).toBe(0);

    // 5 times - A
    sketch.update(new Item('A'));
    expect(sketch.counters.length).toBe(1);
    sketch.update(new Item('A'));
    expect(sketch.counters.length).toBe(1);
    sketch.update(new Item('A'));
    expect(sketch.counters.length).toBe(1);
    sketch.update(new Item('A'));
    expect(sketch.counters.length).toBe(1);
    sketch.update(new Item('A'));
    expect(sketch.counters.length).toBe(1);

    // 4 times - B
    sketch.update(new Item('B'));
    expect(sketch.counters.length).toBe(2);
    sketch.update(new Item('B'));
    expect(sketch.counters.length).toBe(2);
    sketch.update(new Item('B'));
    expect(sketch.counters.length).toBe(2);
    sketch.update(new Item('B'));
    expect(sketch.counters.length).toBe(2);

    // 3 times - C
    sketch.update(new Item('C'));
    expect(sketch.counters.length).toBe(3);
    sketch.update(new Item('C'));
    expect(sketch.counters.length).toBe(3);
    sketch.update(new Item('C'));
    expect(sketch.counters.length).toBe(3);

    // 2 times - D
    sketch.update(new Item('D'));
    expect(sketch.counters.length).toBe(4);
    sketch.update(new Item('D'));
    expect(sketch.counters.length).toBe(4);

    sketch.update(new Item('E'));
    expect(sketch.counters.length).toBe(5);

    // Remove last one ('E'): 5 -> 4
    sketch.update(new Item('F'));
    expect(sketch.counters.length).toBe(4);

    // Add a new one ('G'): 4 -> 5
    sketch.update(new Item('G'));
    expect(sketch.counters.length).toBe(5);

    expect(sketch.estimate(new Item('A'))).toBe(4, 'count of "A"');
    expect(sketch.estimate(new Item('B'))).toBe(3, 'count of "B"');
    expect(sketch.estimate(new Item('C'))).toBe(2, 'count of "C"');
    expect(sketch.estimate(new Item('D'))).toBe(1, 'count of "D"');
    expect(sketch.estimate(new Item('E'))).toBe(0, 'count of "E"');
    expect(sketch.estimate(new Item('F'))).toBe(0, 'count of "F"');
    expect(sketch.estimate(new Item('G'))).toBe(1, 'count of "G"');
    expect(sketch.estimate(new Item('H'))).toBe(0, 'count of "H"');
  });
});
