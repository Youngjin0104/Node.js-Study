// 각각의 패스포트 파일 연결
const local_signup = require('./passport/local_signup');
const local_login = require('./passport/local_login');
const facebook = require('./passport/facebook');

module.exports = function (app, passport) {
    console.log('config/passport 호출!');

    // 사용자 인증에 성공했을 때 호출
    // serializeUser 사용자 정보 객체를 세션에 아이디(객체)로 저장
    passport.serializeUser((user, done) => {
        console.log('serializeUser() 호출!', user);
        // done(null, user.id); // id만 세션에 저장
        done(null, user); // user 객체 세션에 저장
    });

    // 사용자 인증 이후 사용자 요청이 있을 때 호출
    // deserializeUser 세션에 저장한 아이디(객체)를 통해서 사용자 정보 객체를 불러옴
    passport.deserializeUser((user, done) => {
        console.log('deserializeUser() 호출!', user);
        // done(null, user.id); // id만 세션에 저장
        done(null, user); // user 객체 세션에 저장
    });

    passport.use('local-signup', local_signup);
    passport.use('local-login', local_login);
    passport.use('facebook', facebook(app, passport));

}