import 'reflect-metadata';

import tap = require('tap');
import { Service, Container, Inject } from '../src';

@Service()
class SubDependency {}

@Service()
class Dependency {
  constructor(
    public sub: SubDependency
  ) {}
}

@Service()
class MainService {
  constructor(
    @Inject('environment') public env: string,
    public dep: Dependency
  ) {}
}

Container.set('environment', 'test');

tap.ok(Container.get(MainService) instanceof MainService, 'MainService with dependency can be fetched using Container.get')
tap.ok(Container.get(MainService).dep instanceof Dependency, 'MainService.dep was injected correctly');
tap.ok(Container.get(MainService).dep.sub instanceof SubDependency, 'MainService.dep.sub was injected correctly');
tap.equal(Container.get(MainService).env, 'test', 'MainService.env was injected correctly');
tap.ok(Container.get(MainService) === Container.get(MainService), 'The same instance of MainService is returned on consecutive Container.get calls');




