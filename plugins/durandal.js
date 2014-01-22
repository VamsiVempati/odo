// Generated by CoffeeScript 1.6.3
(function() {
  define(['module'], function(module) {
    var components;
    components = [];
    return {
      configure: function(app) {
        app.route('/odo/durandal', app.modulepath(module.uri) + '/durandal-public');
        return app.durandal = function(component) {
          return components.push(component);
        };
      },
      init: function(app) {
        return app.get('/odo/components', function(req, res) {
          return res.send(components);
        });
      }
    };
  });

}).call(this);
