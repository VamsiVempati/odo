// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['passport', 'passport-facebook', 'odo/config', 'odo/hub', 'node-uuid', 'redis'], function(passport, passportfacebook, config, hub, uuid, redis) {
    var FacebookAuthentication, db;
    db = redis.createClient();
    return FacebookAuthentication = (function() {
      function FacebookAuthentication() {
        this.init = __bind(this.init, this);
        this.configure = __bind(this.configure, this);
        var _this = this;
        this.receive = {
          userFacebookAttached: function(event) {
            return db.hset("" + config.odo.domain + ":userfacebook", event.payload.profile.id, event.payload.id);
          }
        };
      }

      FacebookAuthentication.prototype.configure = function(app) {
        var _this = this;
        return passport.use(new passportfacebook.Strategy({
          clientID: config.passport.facebook['app id'],
          clientSecret: config.passport.facebook['app secret'],
          callbackURL: config.passport.facebook['host'] + '/auth/facebook/callback',
          passReqToCallback: true
        }, function(req, accessToken, refreshToken, profile, done) {
          var userid;
          userid = null;
          return _this.get(profile.id, function(err, userid) {
            var user;
            if (err != null) {
              done(err);
              return;
            }
            if (req.user != null) {
              console.log('user already exists, attaching facebook to user');
              userid = req.user.id;
              hub.send({
                command: 'attachFacebookToUser',
                payload: {
                  id: userid,
                  profile: profile
                }
              });
            } else if (userid == null) {
              console.log('no user exists yet, creating a new id');
              userid = uuid.v1();
              hub.send({
                command: 'startTrackingUser',
                payload: {
                  id: userid,
                  profile: profile
                }
              });
              console.log('attaching facebook to user');
              hub.send({
                command: 'attachFacebookToUser',
                payload: {
                  id: userid,
                  profile: profile
                }
              });
            }
            user = {
              id: userid,
              profile: profile
            };
            return done(null, user);
          });
        }));
      };

      FacebookAuthentication.prototype.init = function(app) {
        app.get('/auth/facebook', passport.authenticate('facebook'));
        return app.get('/auth/facebook/callback', passport.authenticate('facebook', {
          successRedirect: '/',
          failureRedirect: '/'
        }));
      };

      FacebookAuthentication.prototype.get = function(id, callback) {
        var _this = this;
        return db.hget("" + config.odo.domain + ":userfacebook", id, function(err, data) {
          if (err != null) {
            callback(err);
            return;
          }
          if (data != null) {
            callback(null, data);
            return;
          }
          return db.hget("" + config.odo.domain + ":userfacebook", id, function(err, data) {
            if (err != null) {
              callback(err);
              return;
            }
            return callback(null, data);
          });
        });
      };

      return FacebookAuthentication;

    })();
  });

}).call(this);
