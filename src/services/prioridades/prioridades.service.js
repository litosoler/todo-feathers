// Initializes the `prioridades` service on path `/prioridades`
const createService = require('feathers-knex');
const createModel = require('../../models/prioridades.model');
const hooks = require('./prioridades.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'prioridades',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/prioridades', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('prioridades');

  service.hooks(hooks);
};
