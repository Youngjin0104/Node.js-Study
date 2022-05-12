const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const static = require('serve-static'); // 페이지에 직접접근해주는 모듈
const path = require('path'); // url 접근을 해야 하므로 패스모듈 설치

const expressErrorHandler = require('express-error-handler');
// 페이지 연결이 잘못 요청이 되었을 때 정상적으로 페이지 이동
// npm i express-error-handler

const passport = require('passport');
// npm i passport 노드에서 사용할 수 있는 사용자 인증 모듈

// 클라이언트                                         서버
//                -------> 인증요청(세션관리) ------->  DB
// 로컬계정(페이스북) <------- 패스포트 모듈 <---------  DB

const app = express();
const router = express.Router();

// 쿠키설정
app.use(cookieParser());
app.use(expressSession({
    secret: '!@#$%^&*()',
    resave: false, // 세션이 계속 저장되어 있는 것을 방지
    saveUninitialized: true, // 초기화 되지 않은 상태에서 저장
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(logger('dev')); // 사용자 정보를 관리
app.use(passport.initialize()); // 패스포트 초기화
// passport의 세션을 사용하려면 그전에 express의 세션을 사용하는 코드가 먼저 나와야 합니다.
app.use(passport.session()); // 세션객체 생성
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', static(path.join(__dirname, "public"))); // public폴더에 직접 연결
app.use('/', router);

// 페이지 연결이 오류일 때 뜽 404 페이지 설정
const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404)); // 404오류발생
app.use(errorHandler);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// 페이스 정보 config 연결
const config = require('./config/config');

// 데이터베이스 연결
const database = require('./database/database');

// 라우터 설정
const userPassport = require('./routes/route_member');
userPassport(router, passport);


app.listen(config.server_port, () => {
    console.log(`${config.server_port}포트로 서버 실행중`);
    // 데이터베이스 연결 함수
    database.init(app, config);
});