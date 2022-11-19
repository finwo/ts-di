import { map } from '../container';
import { EMPTY_VALUE } from '../empty.const';

export function Service(): ClassDecorator {
  return targetConstructor => {
    map.set(targetConstructor, {
      type  : targetConstructor,
      fn    : targetConstructor,
      value : EMPTY_VALUE,
    });
  };
}
