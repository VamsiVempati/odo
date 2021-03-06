// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['passport', 'passport-twitter', 'odo/config', 'odo/messaging/hub', 'node-uuid', 'redis', 'odo/express/app'], function(passport, passporttwitter, config, hub, uuid, redis, app) {
    var TwitterAuthentication, db;
    db = redis.createClient();
    return TwitterAuthentication = (function() {
      function TwitterAuthentication() {
        this.signin = __bind(this.signin, this);
        this.projection = __bind(this.projection, this);
        this.web = __bind(this.web, this);
      }

      TwitterAuthentication.prototype.web = function() {
        passport.use(new passporttwitter.Strategy({
          consumerKey: config.passport.twitter['consumer key'],
          consumerSecret: config.passport.twitter['consumer secret'],
          callbackURL: config.passport.twitter['host'] + '/odo/auth/twitter/callback',
          passReqToCallback: true
        }, this.signin));
        app.get('/odo/auth/twitter', passport.authenticate('twitter'));
        return app.get('/odo/auth/twitter/callback', passport.authenticate('twitter', {
          successRedirect: '/#auth/twitter/success',
          failureRedirect: '/#auth/twitter/failure'
        }));
      };

      TwitterAuthentication.prototype.projection = function() {
        var _this = this;
        hub.receive('userTwitterConnected', function(event, cb) {
          return db.hset("" + config.odo.domain + ":usertwitter", event.payload.profile.id, event.payload.id, function() {
            return cb();
          });
        });
        return hub.receive('userTwitterDisconnected', function(event, cb) {
          return db.hdel("" + config.odo.domain + ":usertwitter", event.payload.profile.id, function() {
            return cb();
          });
        });
      };

      TwitterAuthentication.prototype.signin = function(req, token, tokenSecret, profile, done) {
        var userid,
          _this = this;
        userid = null;
        return this.get(profile.id, function(err, userid) {
          var user;
          if (err != null) {
            done(err);
            return;
          }
          if ((req.user != null) && (userid != null) && req.user.id !== userid) {
            done(null, false, {
              message: 'This Twitter account is connected to another Blackbeard account'
            });
            return;
          }
          if (req.user != null) {
            console.log('user already exists, connecting twitter to user');
            userid = req.user.id;
            hub.send({
              command: 'connectTwitterToUser',
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
              command: 'connectTwitterToUser',
              payload: {
                id: userid,
                profile: profile
              }
            });
            hub.send({
              command: 'assignDisplayNameToUser',
              payload: {
                id: userid,
                displayName: profile.displayName
              }
            });
          } else {
            hub.send({
              command: 'connectTwitterToUser',
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
