// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['passport', 'passport-twitter', 'odo/config', 'odo/hub', 'node-uuid', 'redis'], function(passport, passporttwitter, config, hub, uuid, redis) {
    var TwitterAuthentication, db;
    db = redis.createClient();
    return TwitterAuthentication = (function() {
      function TwitterAuthentication() {
        this.init = __bind(this.init, this);
        this.configure = __bind(this.configure, this);
        var _this = this;
        this.receive = {
          userTwitterAttached: function(event) {
            console.log('TwitterAuthentication userTwitterAttached');
            return db.hset("" + config.odo.domain + ":usertwitter", event.payload.profile.id, event.payload.id);
          }
        };
      }

      TwitterAuthentication.prototype.configure = function(app) {
        var _this = this;
        return passport.use(new passporttwitter.Strategy({
          consumerKey: config.passport.twitter['consumer key'],
          consumerSecret: config.passport.twitter['consumer secret'],
          callbackURL: config.passport.twitter['host'] + '/auth/twitter/callback',
          passReqToCallback: true
        }, function(req, token, tokenSecret, profile, done) {
          var userid;
          userid = null;
          if (req.user != null) {
            console.log('user already exists, using it\'s id');
            userid = req.user.id;
          }
          return _this.get(profile.id, function(err, userid) {
            var user;
            if (err != null) {
              done(err);
              return;
            }
            if (userid == null) {
              console.log('no user exists yet, creating a new id');
              userid = uuid.v1();
              hub.send({
                command: 'startTrackingUser',
                payload: {
                  id: userid,
                  profile: profile
                }
              });
              console.log('attaching twitter to user');
              hub.send({
                command: 'attachTwitterToUser',
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

      TwitterAuthentication.prototype.init = function(app) {
        app.get('/auth/twitter', passport.authenticate('twitter'));
        return app.get('/auth/twitter/callback', passport.authenticate('twitter', {
          successRedirect: '/',
          failureRedirect: '/'
        }));
      };

      TwitterAuthentication.prototype.get = function(id, callback) {
        var _this = this;
        return db.hget("" + config.odo.domain + ":usertwitter", id, function(err, data) {
          if (err != null) {
            callback(err);
            return;
          }
          if (data != null) {
            callback(null, data);
            return;
          }
          return db.hget("" + config.odo.domain + ":usertwitter", id, function(err, data) {
            if (err != null) {
              callback(err);
              return;
            }
            return callback(null, data);
          });
        });
      };

      return TwitterAuthentication;

    })();
  });

}).call(this);
