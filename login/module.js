const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.engine('html', require('ejs').renderFile);
 // views 엔진등록, ejs 파일이 자동으로 html변환, views폴더 생성이 공식
app.use(bodyParser.urlencoded({ extended: false }));

const module1 = require('./router/module1')(app, fs);
 // 모듈객체명 - 모듈객체를 사용하게 객체로 전달

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
});