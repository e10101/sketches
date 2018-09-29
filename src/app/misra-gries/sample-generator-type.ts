export enum SampleType {
  RANDOM,
  REPEAT,
}

export class SampleGeneratorType {
  public type: SampleType;
  public options: any;

  constructor(type: SampleType, options?: any) {
    this.type = type;
    this.options = options;
  }
}
