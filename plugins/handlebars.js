// Generated by IcedCoffeeScript 1.6.3-g
(function() {


  define(['module', 'handlebars', 'express/lib/response', 'consolidate', 'underscore', 'express', 'path'], function(module, handlebars, response, cons, _, express, path) {
    response.render = function(options) {
      var app, fn, req, result, self, view;
      self = this;
      req = this.req;
      app = req.app;
      view = options.view;
      if (options.result != null) {
        result = options.result;
      }
      options = _.extend({}, options.data, self.locals, {
        query: req.query,
        body: req.body,
        partials: _.extend({}, self.locals.partials, options.partials)
      });
      options._locals = self.locals;
      fn = result || function(err, str) {
        if (err) {
          return req.next(err);
        }
        return self.send(str);
      };
      return app.render(view, options, fn);
    };
    return {
      configure: function(app) {
        app.engine('html', cons.handlebars);
        app.set('view engine', 'html');
        app.set('views', path.dirname(module.uri) + '/../');
        handlebars.registerHelper('uppercase', function(string) {
          return string.toUpperCase();
        });
        handlebars.registerHelper('lowercase', function(string) {
          return string.toLowerCase();
        });
        if (String.prototype.toTitleCase != null) {
          handlebars.registerHelper('titlecase', function(string) {
            return string.toTitleCase();
          });
        }
        handlebars.registerHelper('render', function(content, options) {
          if (content != null) {
            return new handlebars.SafeString(handlebars.compile(content)(this));
          }
          return '';
        });
        return handlebars.registerHelper('hook', function(partial, options) {
          if (this.partials[partial] == null) {
            return new handlebars.SafeString(handlebars.compile('{{render ' + partial + '}}')(this));
          }
          return new handlebars.SafeString(handlebars.compile('{{> ' + partial + '}}')(this));
        });
      }
    };
  });

}).call(this);