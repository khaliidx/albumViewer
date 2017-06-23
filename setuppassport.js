var passport = require("passport");
var User = require("./models/user");
var fbConfig = require('./fb.js');
module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};


var FacebookStrategy = require('passport-facebook').Strategy;




passport.use('facebook',new FacebookStrategy({
    clientID: fbConfig.appID,
    clientSecret: fbConfig.appSecret,
    callbackURL: fbConfig.callbackUrl,
    profileFields:['id','displayName','email']
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){

            //handle error where user doesnt have verified email
            var me = new User();
            if(!profile.emails){
                me.facebook.username = profile.displayName;
                me.facebook.email = "NOT VERIFIED";        
            }
            else{
                me.facebook.username = profile.emails[0].value;
                me.facebook.email = profile.emails[0].value;    
            }
            
            me.facebook.id = profile.id;
            me.facebook.token = accessToken;

            /* save if new */
            User.findOne({'facebook.id': profile.id}, function(err, u) {
                if (err) { return next(err); }
                if(!u) {
                    me.save(function(err, me) {
                        if(err) return done(err);
                        done(null,me);
                    });
                } else {
                    done(null, u);
                }
            });

        });
        
  }
));