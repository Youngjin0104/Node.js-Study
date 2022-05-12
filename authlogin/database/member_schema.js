const { Schema } = requrie('mongoose');
const crypto = require('crypto');
 // npm i crypto : 암호화를 선언
const paasport = require('passport');

Schema.createSchema = function (mongoose) {
    console.log('createSchema() 호출!');

    const MemberSchema = mongoose.Schema({
        userid: { type: String, require: true, default: '' },
        hashed_password: { type: String, default: '' },
        name: { type: String, default: '' },
        salt: { type: String },
        age: { type: Number, default: 0 },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        provider: { type: String, default: '' },
        authToken: { type: String, default: '' },
        facebook: {}
        // 서버에서 사용자를 식별할 수 있는 정보를 담아 클라이언트에 내려줄 때 쓰는 토큰
    });
    // virtual : 암호화하기 전 비밀번호를 받기 위해 virtyal 메소드를 사용
    // virtyal 메소드 내에서 받은 값을 암호화하여 데이터베이스에 저장할 수 있다.
    MemberSchema.virtual('userpw').set(function (userpw) {
        this._userpw = userpw;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(userpw);
    }).get(function () {
        return this._userpw;
    });
    // get는 변수 또는 변수의 값을 구하는 것, set은 변수값을 설정하는 것

    MemberSchema.method('makeSalt', function () {
        console.log('makeSalt() 호출!');
        return Math.round((new Date().valueOf() * Math.random())) + ''; // 문자열
        // valueOf() 메서드는 특정 객체의 원시값을 반환
    });

    MemberSchema.method('encryptPassword', function (plainText, inSalt) {
        if (inSalt) { // 로그인
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        } else {    // 회원가입
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
            // 1234 -> salt에 저장된 값을 가져와서 sha1 암호화를 통해 1234를 섞어줌 -> 16진수로
        }
        // 암호화 과정
        // 1. 사용자로부터 비밀번호를 받음
        // 2. 암호화를 위한 salt 값을 생성함
        // 3. 비밀번호를 암호화 함
        // 4. 암호화한 비밀번호와 salt 값을 저장
    });

    MemberSchema.method('authenticate', function (plainText, inSalt, hashed_password) {
        // 클라이언트에서 보낸 인증정보를 처리하기 위해 authenticate메소드를 호출
        // 인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
        if (inSalt) {
            console.log('authenticate() 호출! <inSalt 있음>');
            return this.encryptPassword(plainText, inSalt) == hashed_password;
        } else {
            console.log('authenticate() 호출! <inSalt 없음>');
            return this.encryptPassword(plainText) == this.hashed_password;
        }
    });


    // pre() : 특정 작업이 일어나기 전에 미리 호출되는 메소드입니다. 트리거 역활입니다.
    MemberSchema.pre('save', (next) => {
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.userpw)) {
            next(new Error('유효하지 않은 password입니다.'));
        } else {
            next();
        }
    });

    const validatePresenceOf = function (value) {
        return value && value.length; // 데이터에 있는지 여부
    }

    console.log('MemberSchema 정의 완료!');
    return MemberSchema;
}