import { map } from '../container';
import { Identifier } from '../types/identifier.type';

export function Service<T = unknown>(): ClassDecorator {
  return targetConstructor => {
    map.set(targetConstructor, { type: targetConstructor, fn: targetConstructor });
  };
}
