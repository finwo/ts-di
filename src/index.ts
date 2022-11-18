
// Guard against missing reflect-metadata
if (!Reflect || !(Reflect as any).getMetadata) {
  throw new Error('Reflect.getMetadata is not a function. Please import the "reflect-metadata" package at the first line of your application.');
}

export { Container } from './container';
export { Service   } from './decorators/service.decorator';
