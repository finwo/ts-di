@finwo/di
=========

[![license](https://img.shields.io/github/license/finwo/di)](https://github.com/finwo/di/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@finwo/di)](https://npmjs.com/package/@finwo/di)

@finwo/di is a
[dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) tool
for TypeScript inspired by [TypeDI](https://npmjs.com/package/typedi). With it
you can build well-structured and easily-testable applications in Node or in the
browser.

Main features include:
- constructor-based injection
- singleton services

This package makes use of decorators and decorator metadata using the
[reflect-metadata][npm:reflect-metadata:url] package, which requires enabling
experimental decorators and emitting decorator metadata. It is not compatible
with the TS5 stage 3 decorators
[and this is not the only library affected](https://github.com/microsoft/tsyringe/issues/225).

## Installation

To start using @finwo/di, install the required packages via NPM:

```sh
npm install --save @finwo/di reflect-metadata
```

Import the [reflect-metadata][npm:reflect-metadata:url] package at the
**first line** of your application:

```ts
import 'reflect-metadata';

// Your other imports and initialization code
// comes here after you imported the reflect-metadata package!
```

As a last step, you need to enable emitting decorator metadata in your
TypeScript config. Add these two lines to your `tsconfig.json` file under the
`compilerOptions` key:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

Now you are ready to use @finwo/di with TypeScript!

## Usage

Basic usage is as follows:

```ts
import { Container, Service } from '@finwo/di';

@Service()
class ExampleInjectedService {
  printMessage() {
    console.log('I am alive!');
  }
}

@Service()
class ExampleService {
  constructor(
    // because we annotated ExampleInjectedService with the @Service()
    // decorator, @finwo/di will automatically inject an instance of
    // ExampleInjectedService here when the ExampleService class is requested
    // from @finwo/di
    private injectedService: ExampleInjectedService
  ) {}
}

const serviceInstance = Container.get(ExampleService);
// we reguest an instance of ExampleService from @finwo/di

serviceInstance.injectedService.printMessage();
// logs "I am alive!" to the console
```

You can use @finwo/di to further decouple your code by aliasing an abstract to
an implementation:

```ts
import { Container, Service } from '@finwo/di';

// Not required, just good practice
@Service()
abstract class UserRepository {
  public async create(userData: Partial<User>): Promise<User>;
}

// An actual implementation of the user repository
@Service()
class PersistentUserAdapter extends UserRepository {
  constructor(
    private connector: PersistenceAdapter
  ) {
    super();
  }

  public async create(userData: Partial<User>): Promise<User> {
    // Actual implementation code here
  }
}

// Alias the abstract to the implementation, usually done during the
// configuration stage of your application.
Container.set(UserRepository, Container.get(PersistentUserAdapter));

// Logs 'true' to the console
console.log(Container.get(UserRepository) instanceof PersistentUserAdapter);
```

Or, if you want to be able to inject 3rd-party classes or text-based
configuration throughout your application, you can manually set that using the
`Container.set(identifier, value)` command and the `Inject(identifier)`
decorator:

```ts
import { Container, Service } from '@finwo/di';
import { Party } from '3rd-party-package';

@Service()
class TestService {
  constructor(
    @Inject('environment') private env: string,
    private party: Party,
  ) {}

  public print(): void {
    console.log(`Environment: ${this.env}`);
  }
}

// Application configuration
Container.set('environment', 'test');
Container.set(Party, new Party());

// And run this example
Container.get(TestService).print();
// Shows "Environment: test" in the console
```

The same instance of a got service is returned over multiple requests. Transient
or one-off services are not yet supported

```ts
import { Container, Service } from '@finwo/di';

@Service()
class SomeService {}

const firstCall = Container.get(SomeService);
const secondCall = Container.get(SomeService);

// Logs 'true' to the console
console.log(firstCall === secondCall);
```

[npm:reflect-metadata:url]: https://npmjs.com/package/reflect-metadata
