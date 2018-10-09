export enum SampleType {
  RANDOM,
  REPEAT,
  MAJORITY,
}

export enum MajorityPosition {
  BEGIN,
  END,
  RANDOM,
}

export class SampleGeneratorType {
  public type: SampleType;
  public options: any;

  constructor(type: SampleType, options?: any) {
    this.type = type;
    this.options = options;
  }
}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'majorityPosition'})
export class MajorityPositionPipe implements PipeTransform {
  transform(value: any): any {
    let str = "";
    switch (value) {
      case MajorityPosition.BEGIN:
        str = "BEGIN";
        break;
      case MajorityPosition.END:
        str = "END";
        break;
      case MajorityPosition.RANDOM:
        str = "RANDOM";
        break;
    }

    return str;
  }
}