// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['passport', 'passport-google', 'odo/config', 'odo/hub', 'node-uuid', 'redis'], function(passport, passportgoogle, config, hub, uuid, redis) {
    var GoogleAuthentication, db;
    db = redis.createClient();
    return GoogleAuthentication = (function() {
      function GoogleAuthentication() {
        this.init = __bind(this.init, this);
        this.configure = __bind(this.configure, this);
        var _this = this;
        this.receive = {
          userGoogleAttached: function(event, cb) {
            return db.hset("" + config.odo.domain + ":usergoogle", event.payload.profile.id, event.payload.id, function() {
              return cb();
            });
          }
        };
      }

      GoogleAuthentication.prototype.get = function(id, callback) {
        var _this = this;
        return db.hget("" + config.odo.domain + ":usergoogle", id, function(err, data) {
          if (err != null) {
            callback(err);
            return;
          }
          if (data != null) {
            callback(null, data);
            return;
          }
          return db.hget("" + config.odo.domain + ":usergoogle", id, function(err, data) {
            if (err != null) {
              callback(err);
              return;
            }
            return callback(null, data);
          });
        });
      };

      GoogleAuthentication.prototype.configure = function(app) {
        var _this = this;
        return passport.use(new passportgoogle.Strategy({
          realm: config.passport.google['realm'],
          returnURL: config.passport.google['host'] + '/odo/auth/google/callback',
          passReqToCallback: true
        }, function(req, identifier, profile, done) {
          var userid;
          userid = null;
          profile.id = identifier;
          return _this.get(profile.id, function(err, userid) {
            var user;
            if (err != null) {
              done(err);
              return;
            }
            if (req.user != null) {
              console.log('user already exists, attaching google to user');
              userid = req.user.id;
              hub.send({
                command: 'attachGoogleToUser',
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
              console.log('attaching google to user');
              hub.send({
                command: 'attachGoogleToUser',
                payload: {
                  id: userid,
                  profile: profile
                }
              });
            } else {
              console.log('attaching google to user');
              hub.send({
                command: 'attachGoogleToUser',
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

      GoogleAuthentication.prototype.init = function(app) {
        app.get('/odo/auth/google', passport.authenticate('google'));
        return app.get('/odo/auth/google/callback', passport.authenticate('google', {
          successRedirect: '/',
          failureRedirect: '/'
        }));
      };

      return GoogleAuthentication;

    })();
  });

}).call(this);
