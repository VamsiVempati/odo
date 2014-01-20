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
          userGoogleConnected: function(event, cb) {
            return db.hset("" + config.odo.domain + ":usergoogle", event.payload.profile.id, event.payload.id, function() {
              return cb();
            });
          },
          userGoogleDisconnected: function(event, cb) {
            return db.hdel("" + config.odo.domain + ":usergoogle", event.payload.profile.id, function() {
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
            if ((req.user != null) && (userid != null) && req.user.id !== userid) {
              done(null, false, {
                message: 'This Google account is connected to another Blackbeard account'
              });
              return;
            }
            if (req.user != null) {
              console.log('user already exists, connecting google to user');
              userid = req.user.id;
              hub.send({
                command: 'connectGoogleToUser',
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
              hub.send({
                command: 'connectGoogleToUser',
                payload: {
                  id: userid,
                  profile: profile
                }
              });
              if (profile.emails.length > 0) {
                hub.send({
                  command: 'assignEmailAddressToUser',
                  payload: {
                    id: userid,
                    email: profile.emails[0].value
                  }
                });
              }
            } else {
              hub.send({
                command: 'connectGoogleToUser',
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
          successRedirect: '/#auth/google/success',
          failureRedirect: '/#auth/google/failure'
        }));
      };

      return GoogleAuthentication;

    })();
  });

}).call(this);
