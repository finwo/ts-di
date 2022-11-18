import tap = require('tap');

tap.throws(() => require('../src'), 'Error thrown when required when reflect-metadata is missing');
