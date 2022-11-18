import { Identifier } from "../types/identifier.type";

export function Inject(type: Identifier): ParameterDecorator {
  return (target: any, key: string | Symbol, index: number) => {
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target);
    paramTypes[index] = type;
    Reflect.defineMetadata('design:paramtypes', paramTypes, target);
  };
};
