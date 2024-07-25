import { Identifier } from './types/identifier.type';
import { EMPTY_VALUE } from './empty.const';

export const map = new Map();
const onDefine = new Map();

export class Container {

  static set<T = unknown>(type: Identifier<T>, value: any): Container {
    map.set(type, { type, value });
    if (onDefine.has(type)) {
      const callbacks = onDefine.get(type);
      onDefine.delete(type);
      callbacks.forEach((callback: ()=>any) => callback());
    }
    return this;
  }

  static get<T = unknown>(type: Identifier<T>): T {
    const descriptor = map.get(type);

    // Unregistered identifier
    if (!descriptor) {
      throw new Error(`No service has been registered for '${String(type)}'`);
    }

    // Known & pre-initialized identifier
    if (descriptor.value !== EMPTY_VALUE) return descriptor.value;

    // Must have a constructor
    if (!descriptor.fn) throw new Error(`Missing constructor for service '${String(type)}'`);
    if (!descriptor.fn.prototype) throw new Error(`Constructor for service '${String(type)}' is not constructable`);

    // Construct with fetched params
    const paramTypes: Identifier[] = Reflect.getMetadata('design:paramtypes', descriptor.fn) || [];
    descriptor.value = new (descriptor.fn)(...(paramTypes.map(paramType => Container.get(paramType))));

    // Return what we just constructor
    return descriptor.value;
  }

  static whenDefined<T = unknown>(type: Identifier<T>): Promise<void> {
    if (map.has(type)) return Promise.resolve();
    return new Promise(resolve => {
      const callbacks = onDefine.get(type) || [];
      callbacks.push(resolve);
      onDefine.set(type, callbacks);
    });
  }

}
