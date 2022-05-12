const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;// npm i mongodb

const app = express();
const router = express.Router();

const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));

let database;// 몽고디비 연결 객체

//mongodb연결함수
function connentDB() {
    const databaseURL = "mongodb://127.0.0.1:27017";//몽고디비 프로토콜
    MongoClient.connect(databaseURL, (err, db) => {
        if (!err) {
            // const tempdb = db.db(데이터베이스명); 
            const tempdb = db.db('frontenddb');
            database = tempdb;
            console.log('mongodb 데이터베이스 연결 성공!');
        } else {
            console.log(err);
        }
    })
}


// 회원가입
// http://localhost:3000/member/regist (post)
router.route('/member/regist').post((req, res) => {
    console.log('/member/regist 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);
    // post 방식으로 입력된 내용 확인

    if (database) {// 데이터베이스 연결여부 확인
        joinMember(database, userid, userpw, name, age, (err, result) => {
            if (!err) {// 회원가입 실행함수 연결여부 확인
                if (result.insertedCount > 0) {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원가입 성공</h2>');
                    res.write('<p>가입이 성공적으로 완료되었습니다.</p>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>회원가입 실패</h2>');
                res.write('<p>오류발생.</p>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
})

//로그인
// http://localhost:3000/member/login (post)
router.route('/member/login').post((req, res) => {
    console.log('/member/login 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if (database) {
        loginMember(database, userid, userpw, (err, result) => {
            if (!err) {
                if (result) {
                    console.dir(result); // 로그인된 정보를 디비에서 갖고 옴

                    // toArray()를 사용했기 때문에 -> 반복문
                    const resultUserid = result[0].userid;
                    const resultUserpw = result[0].userpw;
                    const resultName = result[0].username;
                    const resultAge = result[0].age;

                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>로그인 성공</h2>');
                    res.write(`<p>${resultUserid}(${resultName})님 환영 합니다.</p>`);
                    res.write(`<p>나이 : ${resultAge}살</p>`);
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>로그인 실패</h2>');
                    res.write('<p>서버오류 발생! 로그인에 실패하였습니다.</p>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>로그인 실패</h2>');
                res.write('<p>서버오류 발생! 로그인에 실패하였습니다.</p>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});

//정보수정
// http://localhost:3000/member/edit (post)
router.route('/member/edit').post((req, res) => {
    console.log('/member/edit 호출!');

    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if (database) {
        editMember(database, userid, userpw, name, age, (err, result) => {
            if (!err) {
                if (result.modifiedCount > 0) {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원정보 수정 성공</h2>');
                    res.write('<p>회원정보수정에 성공했습니다.</p>');
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원정보 수정 실패</h2>');
                    res.write('<p>회원정보수정에 실패했습니다.</p>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>회원정보 수정 실패</h2>');
                res.write('<p>서버 오류 발생! 정보수정에 실패하였습니다.</p>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});


// 회원삭제
// http://localhost:3000/member/delete (post)
router.route('/member/delete').post((req, res) => {
    console.log('/member/delete 호출!');

    const userid = req.body.userid;

    console.log(`userid:${userid}`);

    if (database) {
        deleteMember(database, userid, (err, result) => {
            if (!err) {
                if (result.deletedCount > 0) {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>데이터베이스 삭제 성공</h2>');
                    res.write('<p>회원정보 삭제를 성공하였습니다.</p>');
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>데이터베이스 삭제 실패</h2>');
                    res.write('<p>회원정보 삭제를 실패하였습니다.</p>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>데이터베이스 삭제 실패</h2>');
                res.write('<p>서버오류.. 회원정보 삭제를 실패하였습니다.</p>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});


//====================================================================================
// 회원가입 함수
const joinMember = function (database, userid, userpw, name, age, callback) {
    console.log('joinMember 호출!');
    const members = database.collection('member'); // 컬렉션을 객체로 가져옴
    // members.insertMany() 컬렉션을 저장
    members.insertMany([{ userid: userid, userpw: userpw, username: name, age: age }], (err, result) => {
        if (!err) { // insert에 에러가 발생하지 않는다면
            if (result.insertedCount > 0) {
                console.log(`사용자 document ${result.insertedCount}명 추가 되었음!`);
            } else {
                console.log(`사용자 document 추가되지 않았음!`);
            }
            callback(null, result);
            return;
        } else {
            console.log(err);
            callback(err, null);
        }
    });

}

// 로그인 함수
const loginMember = function (database, userid, userpw, callback) {
    console.log(`loginMember 호출!`);
    const members = database.collection('member');
    members.find({ userid: userid, userpw: userpw }).toArray((err, result) => {
        // find()는 여러개의 객체를 찾을 수 있기 때문에 배열로 toArray()를 사용함
        if (!err) {
            if (result.length > 0) {
                console.log('사용자를 찾았습니다.');
                callback(null, result);
            } else {
                console.log('일치하는 사용자가 없습니다.');
                callback(null, null);
            }
            return;
        } else {
            console.log(err);
            callback(err, null);
        }
    });
}

// 회원정보 수정
const editMember = function (database, userid, userpw, name, age, callback) {
    console.log('editMember 호출!');
    const members = database.collection('member');

    members.updateOne({ userid: userid }, { $set: { userid: userid, userpw: userpw, username: name, age: age } }, (err, result) => {
        if (!err) {
            if (result.modifiedCount > 0) { // modifiedCount 프로퍼티 수정한 갯수
                console.log(`사용자 document ${result.modifiedCount}명 수정됨`);
            } else {
                console.log('수정된 document 없음');
            }
            callback(null, result);
            return;
        } else {
            console.log(err);
            callback(err, null);
        }
    });
}

// 회원삭제
const deleteMember = function (database, userid, callback) {
    console.log('deleteMember 호출!');
    const member = database.collection('member');
    member.deleteOne({ userid: userid }, (err, result) => {
        if (!err) {
            if (result.deletedCount > 0) {
                console.log(`사용자 document ${result.deletedCount}명 삭제됨`);
            } else {
                console.log('삭제된 document 없음');
            }
            callback(null, result);
            return;
        } else {
            console.log(err);
            callback(err, null);
        }
    });
}

app.use("/", router);

app.listen(port, () => {
    console.log(`${port}포트로 서버 동작중...`);
    connentDB();
});
