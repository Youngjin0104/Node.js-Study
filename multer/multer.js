const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // npm i multer
// multer 파일업로드 하기 위한 익스프레스 미들웨어
const static = require('serve-static'); // npm i serve-static
// 특정 폴더를 요청에 의해 직접 파일에 접근할 수 있도록 기능을 제공하는 익스프레스 미들웨어
const path = require('path'); // url(주소를) 컨트롤하는 모듈
const logger = require('morgan');  // npm i morgan
const fs = require('fs');
// 로그를 관리하기 위한 라이브러리 모듈
// 특정사이트에 접속했을 떄 정보(접속시간, 함수 등등)_확인하는 모듈

const port = 3000;
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(logger('dev')); // dev, short, common, bombined


const storage = multer.diskStorage({
    // destination : 저장될 폴더를 설정합니다.
    destination: (req, file, callback) => {
        callback(null, 'uploads'); // 파일을 저장할 디렉토리 설정
    }, // filename : 저장될 파일이름을 설정합니다.
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname); // 원래 파일명인 apple.png
        const basename = path.basename(file.originalname, extension); // 파일명만 추출 apple
        callback(null, basename + "_" + Date.now() + extension);
        // apple.png -> apple -> apple날짜 -> apple.png -> apple날짜.png
    }
});

const upload = multer({
    storage: storage, // diskStorage 설정객체
    limit: { // 제한설정
        files: 5, // 파일전송개수
        fileSize: 1024 * 1024 * 100 // 파일전송용량 1024는 1메가
    }
});

// 라우터생성
router.route('/write').post(upload.array('photo', 1), (req, res) => {
    console.log('/write 호출!');
    try {
        const title = req.body.title;
        const content = req.body.content;
        const files = req.files;
        console.dir(req.files[0]);
        const originalname = files[0].originalname;
        const filename = files[0].filename;
        const mimetype = files[0].mimetype;
        const size = files[0].size;

        console.log(`파일정보 : 원본파일명:${originalname}, 파일이름:${filename},
        mimetype :${mimetype}, 파일크기:${size}}`);

        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>파일 업로드 성공</h2>');
        res.write('<hr>');
        res.write(`<p>제목 : ${title}</p>`);
        res.write(`<p>내용 : ${content}</p>`);
        res.write(`<p>원본파일명 : ${originalname}</p>`);
        res.write(`<p>파일명 : ${filename}</p>`);
        res.write(`<p>mimetype : ${mimetype}</p>`);
        res.write(`<p>파일크기 : ${size}</p>`);
        res.write(`<p><img src='/uploads/${filename}' width='200'></p>`);
        res.end();
    } catch (e) {
        console.log(e);
    }
});



app.use("/", router);

app.listen(port, () => {
    console.log(`${port}포트로 서버 동작중...`);
});