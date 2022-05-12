// 패스포트 회원가입
// 로컬 회원가입
// npm i passport-local

const database = require('../../database/database');

// npm i passport-facebook
const LocalStrategy = require('passport-local').Strategy;

// Strategy : 패스포트는 수백 가지의 인증방식을 제공하는데, 어떤 인증 방식을 사용할 것인지 결정하는 것
module.exports = new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'userpw',
    passReqToCallback: true
}, (req, userid, userpw, done) => {
    console.log(`passport의 local-login 호출 : userid:${userid}, userpw:${userpw} `);
    let database = req.app.get('database');
    database.MemberModel.findOne({ userid: userid }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            console.log('계정이 일치하지 않습니다.');
            return done(null, false);
        }
        let authenticate = user.authenticate(userpw, user.salt, user.hashed_password);
        if (!authenticate) {
            console.log('비밀번호가 일치하지 않습니다.');
            return done(null, false);
        }
        return done(null, user);
    })
})