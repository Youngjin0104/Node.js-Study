const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan'); // npm i morgan
// 로깅을 도와주는 모듈... 로길은 현재 앱에서 일어나는 일들을 기록하는 것을 의미
const mongoose = require('mongoose'); // npm i mongoose
// 데이터베이스 스키마를 생성하는 모듈

const app = express();
const port = 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

// 데이터 베이스 연결
let database;
let UserSchema;
let UserModel;

function connentDB() {
    const url = 'mongodb://127.0.0.1:27017/frontenddb';
    console.log('데이터베이스 연결 시도중 ...');

    mongoose.Promise = global.Promise;
    // 몽구스의 프로미스 객체를 global의 프로미스 객체로 사용 동기식이더라도 비동기적으로 사용
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    database = mongoose.connection;
    database.on('error', console.error.bind(console, "mongoose 연결 실패!"));
    database.on('open', () => {
        console.log('데이터베이스 연결 성공!');
        UserSchema = mongoose.Schema({
            userid: String,
            userpw: String,
            name: String,
            gender: String
        });
        console.log('UserSchema 생성 완료!');

        // 가상의 함수를 생성 list 생성시 사용
        UserSchema.static('findAll', function () {
            return this.find({}, callBack);
        });

        // 모델 생성
        UserModel = mongoose.model('user', UserSchema);
        console.log('UserModel이 정의되었습니다.');
    });
}

// localhost:3000/user/regist (post)
router.route('/user/regist').post((req, res) => {
    console.log('/user/regist 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const gender = req.body.gender;
    console.log(`userid:${userid}, userpw:${userpw}, username:${name}, gender:${gender}`);

    if (database) {// 데이터베이스 연결여부 확인
        joinUser(database, userid, userpw, name, gender, (err, result) => {
            if (!err) {// 회원가입 실행함수 연결여부 확인
                if (result) {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원가입 성공</h2>');
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원가입 실패</h2>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>서버오류... 회원가입 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

// 로그인
// http://localhost:3000/user/login (post)
router.route('/user/login').post((req, res) => {
    console.log('/user/login 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if (database) {
        loginUser(database, userid, userpw, (err, result) => {
            if (!err) {
                if (result) {
                    console.dir(result);
                    const name = result[0].name;
                    const gender = result[0].gender;

                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write(`<h2>로그인 성공</h2>`);
                    res.write(`<p>아이디 : ${userid}</p>`);
                    res.write(`<p>이름 :  ${name}</p>`);
                    res.write(`<p>성별 :  ${gender}</p>`);
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>로그인실패</h2>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>서버오류... 로그인실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});







const joinUser = function (database, userid, userpw, name, gender, callback) {
    console.log('joinUser 호출!');
    const users = new UserModel({ userid: userid, userpw: userpw, name: name, gender: gender });

    users.save((err, result) => {
        if (!err) {
            console.log('회원 document가 추가되었습니다.');
            callback(null, result);
            return;
        } else {
            callback(err, null);
        }
    })
}

const loginUser = function (database, userid, userpw, callback) {
    console.log('loginUser 호출!');

    UserModel.find({ userid: userid, userpw: userpw }, (err, result) => {
        if (!err) {
            if (result.length > 0) {
                console.log('일치하는 사용자를 찾음');
                callback(null, result);
            } else {
                console.log('일치하는 사용자가 없음');
                callback(null, null);
            }
            return;
        }
        callback(err, null);
    });
}


app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
    connentDB(); // 데이터베이스 연결함수 호출
});