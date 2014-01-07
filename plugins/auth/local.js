// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['passport', 'passport-local', 'odo/config', 'odo/hub', 'node-uuid', 'redis', 'odo/projections/userprofile'], function(passport, passportlocal, config, hub, uuid, redis, UserProfile) {
    var LocalAuthentication, db;
    db = redis.createClient();
    return LocalAuthentication = (function() {
      function LocalAuthentication() {
        this.init = __bind(this.init, this);
        this.configure = __bind(this.configure, this);
        var _this = this;
        this.receive = {
          userHasLocalSignin: function(event) {
            console.log('LocalAuthentication userHasLocalSignin');
            return db.hset("" + config.odo.domain + ":localusers", event.payload.profile.username, event.payload.id);
          }
        };
      }

      LocalAuthentication.prototype.configure = function(app) {
        var _this = this;
        return passport.use(new passportlocal.Strategy(function(username, password, done) {
          var userid;
          userid = null;
          return _this.get(username, function(err, userid) {
            if (err != null) {
              done(err);
              return;
            }
            if (userid == null) {
              console.log('User not found');
              done(null, false, {
                message: 'Incorrect username or password.'
              });
              return;
            }
            return new UserProfile().get(userid, function(err, user) {
              if (err != null) {
                done(err);
                return;
              }
              if (user.local.profile.password !== password) {
                console.log('Password not correct');
                done(null, false, {
                  message: 'Incorrect username or password.'
                });
                return;
              }
              console.log('Returning successfully');
              return done(null, user);
            });
          });
        }));
      };

      LocalAuthentication.prototype.init = function(app) {
        var _this = this;
        app.post('/auth/local', passport.authenticate('local', {
          successRedirect: '/',
          failureRedirect: '/'
        }));
        return app.post('/auth/local/signup', function(req, res) {
          var profile, userid;
          if (req.body.displayName == null) {
            res.send(400, 'Full name required');
          }
          if (req.body.username == null) {
            res.send(400, 'Email address required');
          }
          if (req.body.password == null) {
            res.send(400, 'Password required');
          }
          if (req.body.password !== req.body.passwordconfirm) {
            res.send(400, 'Passwords must match');
          }
          userid = null;
          profile = {
            displayName: req.body.displayName,
            username: req.body.username,
            password: req.body.password
          };
          if (req.user != null) {
            console.log('user already exists, creating local signin');
            userid = req.user.id;
            profile.id = req.user.id;
          } else {
            console.log('no user exists yet, creating a new id');
            userid = uuid.v1();
            profile.id = userid;
            hub.send({
              command: 'startTrackingUser',
              payload: {
                id: userid,
                profile: profile
              }
            });
          }
          console.log('creating a local signin for user');
          hub.send({
            command: 'createLocalSigninForUser',
            payload: {
              id: userid,
              profile: profile
            }
          });
          return new UserProfile().get(userid, function(err, user) {
            if (err != null) {
              res.send(500, 'Couldn\'t find user');
              return;
            }
            return req.login(user, function(err) {
              if (err != null) {
                res.send(500, 'Couldn\'t login user');
                return;
              }
              return res.redirect('/');
            });
          });
        });
      };

      LocalAuthentication.prototype.get = function(username, callback) {
        var _this = this;
        console.log;
        return db.hget("" + config.odo.domain + ":localusers", username, function(err, data) {
          if (err != null) {
            callback(err);
            return;
          }
          return callback(null, data);
        });
      };

      return LocalAuthentication;

    })();
  });

}).call(this);
