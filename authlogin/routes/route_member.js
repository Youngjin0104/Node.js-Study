module.exports = function (router, passport) {
    console.log('route_member 호출!');

    router.route('/').get((req, res) => {
        res.render('index.ejs');
    });

    router.route('/login').get((req, res) => {
        res.render('login.ejs');
    });

    router.route('/signup').get((req, res) => {
        res.render('signup.ejs');
    });

    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // 사용자 인증 상태 확인
    router.route('/profile').get((req, res) => {
        if (!req.user) {
            console.log('사용자 인증이 안된 상태!');
            res.redirect('/');
            return;
        }
        console.log('사용자 인증 상태');
        if (Array.isArray(req.user)) {
            res.render('profile.ejs', { user: req.user[0] });
        } else {
            res.render('profile.ejs', { user: req.user });
        }
    });

    // 페이스북(서버에서)
    router.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }));

    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));


    // 로그아웃
    router.route('/logout').get((req, res) => {
        req.logout();
        res.redirect('/');
    });
}

// passport 모듈
// 세션을 내부적으로 처리해주는 패키지 구글, 페이스북, 카카옻톡 등 로그인 기능을 구현
// 로컬로그인과 SNS로그인 모두 개발이 가능 노드에서 사용할 수 있는 사용자 인증 모듈입니다.
// 사용방법이 간단할 뿐만 아니라, 사용자 인증 기능을 독립된 모듈 안에서 진행할 수 있도록 도와줍니다.
// 특히 익스프레스를 사용할 경우 미들웨어로 사용할 수 있어서 간단한 설정만으로 로그인 기능을 만들 수 있습니다.
// passport.authenticate
// passport 모듈의 authenticate 를 통해 인증이 성공했을 때와 실패했을 때 리다이렉션할 경로를 지정
// passport.authenticate 함수는 성공했을 때 기본적으로req.login() 함수를 호출
