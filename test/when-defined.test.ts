import 'reflect-metadata';

import tap = require('tap');
import { Service, Container } from '../src';
import { EMPTY_VALUE } from '../src/empty.const';

abstract class MyAbstractClass {}

function promiseState(p: Promise<any>): Promise<string> {
  const t = {};
  return Promise.race([p, t])
    .then(v => (v === t)? "pending" : "resolved", () => "rejected");
}

(async () => {

  let calledA: boolean = false;
  let waiter = Container.whenDefined(MyAbstractClass).then(() => {
    calledA = true;
  });

  tap.ok((await promiseState(waiter)) == 'pending', 'Initial when-defined returns pending promise');
  tap.ok(calledA == false, 'Initial when-defined on non-defined class is false');

  Container.set(MyAbstractClass, "defined");
  await waiter;
  // @ts-ignore
  tap.ok(calledA == true, 'Initial when-defined on non-defined class is false');


  tap.ok((await promiseState(Container.whenDefined(MyAbstractClass))) == 'resolved', 'When-defined on already-defined class returns a resolved promise');

})();
