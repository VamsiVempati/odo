// Generated by CoffeeScript 1.6.3
(function() {
  defineQ(['q', 'odo/auth'], function(Q, auth) {
    var dfd;
    dfd = Q.defer();
    auth.getUser().then(function(user) {
      return dfd.resolve(user);
    }).fail(function(err) {
      return dfd.resolve(null);
    });
    return dfd.promise;
  });

}).call(this);
