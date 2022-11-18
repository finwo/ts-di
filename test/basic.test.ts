import 'reflect-metadata';

import tap = require('tap');
import { Service, Container } from '../src';
import { EMPTY_VALUE } from '../src/empty.const';

// Required to test some edge-cases
import { map } from '../src/container';

class NonService {}
@Service()
class ExtendedNonService extends NonService {}
tap.throws(() => Container.get(NonService), 'Fetching NonService throws an error');
tap.ok(Container.get(ExtendedNonService), 'Service extension of NonService can be fetched using Container.get');

@Service()
class BasicService {}
@Service()
class ExtendedBasicService extends BasicService {}
tap.ok(Container.get(BasicService) instanceof BasicService, 'BasicService instance can be fetched using Container.get');
tap.ok(Container.get(ExtendedBasicService) instanceof ExtendedBasicService, 'ExtendedBasicService instance can be fetched using Container.get');
tap.ok(Container.get(ExtendedBasicService) instanceof BasicService, 'ExtendedService inheritance hasn\'t been broken');

@Service()
abstract class AbstractService {}
@Service()
class ExtendedAbstractService extends AbstractService {}
tap.ok(Container.get(ExtendedAbstractService) instanceof ExtendedAbstractService, 'ExtendedAbstractService instance can be fetched using Container.get');
tap.ok(Container.get(ExtendedAbstractService) instanceof AbstractService, 'ExtendedAbstractService inheritance hasn\'t been broken');

@Service()
abstract class ExampleRepository {}
@Service()
class ExampleAdapter extends ExampleRepository {}
Container.set(ExampleRepository, Container.get(ExampleAdapter));
tap.ok(Container.get(ExampleAdapter) instanceof ExampleAdapter, 'ExampleAdapter instance can be fetched using Container.get');
tap.ok(Container.get(ExampleAdapter) instanceof ExampleRepository, 'ExampleAdapter inheritance hasn\'t been broken');
tap.ok(Container.get(ExampleRepository) instanceof ExampleAdapter, 'Abstract class can be used to fetch implementation after custom Container.set');

Container.set('pizza', 'calzone');
tap.equal(Container.get('pizza'), 'calzone', 'Strings can be used as keys in both .get and .set');

map.set('A', { value: EMPTY_VALUE });
tap.throws(() => Container.get('A'), 'Fetching service with missing value & constructor throws an error');

map.set('B', { value: EMPTY_VALUE, fn: {} });
tap.throws(() => Container.get('B'), 'Fetching service with missing value constructor prototype throws an error');

Container.set('falsey', false);
tap.equal(Container.get('falsey'), false, 'A falsey configured key must still be returned');
