import { map } from '../container';
import { EMPTY_VALUE } from '../empty.const';
import { Identifier } from '../types/identifier.type';

export function Service<T = unknown>(): ClassDecorator {
  return targetConstructor => {
    map.set(targetConstructor, {
      type  : targetConstructor,
      fn    : targetConstructor,
      value : EMPTY_VALUE
    });
  };
}
