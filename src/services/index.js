const todos = require('./todos/todos.service.js');
const prioridades = require('./prioridades/prioridades.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(todos);
  app.configure(prioridades);
};
