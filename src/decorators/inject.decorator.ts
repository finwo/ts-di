import { Identifier } from '../types/identifier.type';

// Allows injection of a known identifier into a constructor's parameters (like string keys)
export function Inject(identifier: Identifier): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol | undefined, index: number) {
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target);
    paramTypes[index] = identifier;
    Reflect.defineMetadata('design:paramtypes', paramTypes, target);
  };
}
