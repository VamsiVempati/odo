// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define([], function() {
    var User;
    return User = (function() {
      function User(id) {
        this._userHasLocalSignin = __bind(this._userHasLocalSignin, this);
        this._userFacebookAttached = __bind(this._userFacebookAttached, this);
        this._userTwitterAttached = __bind(this._userTwitterAttached, this);
        this._userTrackingStarted = __bind(this._userTrackingStarted, this);
        this.createLocalSigninForUser = __bind(this.createLocalSigninForUser, this);
        this.attachFacebookToUser = __bind(this.attachFacebookToUser, this);
        this.attachTwitterToUser = __bind(this.attachTwitterToUser, this);
        this.startTrackingUser = __bind(this.startTrackingUser, this);
        this.id = id;
      }

      User.prototype.startTrackingUser = function(command, callback) {
        this["new"]('userTrackingStarted', {
          id: this.id,
          profile: command.profile
        });
        return callback(null);
      };

      User.prototype.attachTwitterToUser = function(command, callback) {
        this["new"]('userTwitterAttached', {
          id: this.id,
          profile: command.profile
        });
        return callback(null);
      };

      User.prototype.attachFacebookToUser = function(command, callback) {
        this["new"]('userFacebookAttached', {
          id: this.id,
          profile: command.profile
        });
        return callback(null);
      };

      User.prototype.createLocalSigninForUser = function(command, callback) {
        this["new"]('userHasLocalSignin', {
          id: this.id,
          profile: command.profile
        });
        return callback(null);
      };

      User.prototype._userTrackingStarted = function(event) {};

      User.prototype._userTwitterAttached = function(event) {};

      User.prototype._userFacebookAttached = function(event) {};

      User.prototype._userHasLocalSignin = function(event) {};

      return User;

    })();
  });

}).call(this);
