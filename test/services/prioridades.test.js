const assert = require('assert');
const app = require('../../src/app');

describe('\'prioridades\' service', () => {
  it('registered the service', () => {
    const service = app.service('prioridades');

    assert.ok(service, 'Registered the service');
  });
});
