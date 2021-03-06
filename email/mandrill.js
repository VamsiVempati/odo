// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['q', 'mandrill-api/mandrill', 'odo/config'], function(Q, mandrill, config) {
    var Mandrill;
    return Mandrill = (function() {
      var client;

      function Mandrill() {
        this.send = __bind(this.send, this);
      }

      client = new mandrill.Mandrill(config.mandrill['api key']);

      Mandrill.prototype.send = function(options) {
        var dfd,
          _this = this;
        dfd = Q.defer();
        client.messages.send(options, function(result) {
          return dfd.resolve(result);
        }, function(error) {
          console.log("A mandrill error occurred: " + e.name + " - " + e.message);
          return dfd.reject(error);
        });
        return dfd.promise;
      };

      return Mandrill;

    })();
  });

}).call(this);
