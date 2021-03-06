import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(User, email, password, done) {
  User.findOne( { email: email.toLowerCase() })
    .then(user => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      user.decryptify('password', password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, { message: 'This password is not correct.' });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

function localDecipher(User, email, verificationCode, done){
  User.findOne( { email: email.toLowerCase() } )
    .then(user => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered'
        });
      }
      user.decryptify('password','verificationCode',verificationCode, function (authError, authenticated){
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null,false, {message: 'This Verification Code is not correct. '});
        } else {
          return done(null,user);
        }
      })
    })
    .catch(err => done(err))
}

export function setup(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function(email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}
