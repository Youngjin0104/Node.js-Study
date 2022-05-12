const mongoose = require('mongoose');

let database = {};

database.init = function (app, config) {
    console.log('database init() 호출!');
    connect(app, config);
}

function connect(app, config) {
    console.log('connect() 호출!')
    mongoose.Promise = global.Promise;
    // db_url: 'mongodb://localhost:27017/frontenddb
    mongoose.connect(config.db_url); // 데이터베이스 연결
    database.db = mongoose.connection; // 몽고디비 스키마 적용된 컬렉션 생성

    // 데이터베이스 연결에 대한 예외처리
    database.db.on('error', console.error.bind(console, 'mongoose connection error'));
    database.db.on('open', () => {
        console.log('데이터베이스 연결 성공!');
        createSchema(app, config); // 스키마를 생성
    });
};

function createSchema(app, config) {
    const schemaLen = config.db_schemas.length; // 스키마 갯수 설정
    console.log(`스키마의 개수 : ${schemaLen}`);

    for (let i = 0; i < schemaLen; i++) {
        /*
            {
                file: './member_schema',
                collection: 'member2',
                schemaName: 'MemberSchema',
                modelName: 'MemberModel'
            }
        */
        let curItem = config.db_schemas[i]; // 인덱스 값
        let curSchema = require(curItem.file).createSchema(mongoose);
        console.log(`${curItem.file} 모듈을 불러온 후 스키마를 정의함`);

        let curModel = mongoose.momdel(curItem.collection, curSchema);
        console.log(`${curItem.collection} 컬렉션을 위해 모델을 정의함`);

        database[curItem.schemaName] = curSchema; // database[MemberSchema]
        database[curItem.modelName] = curModel;   // database[MemberModel]

        console.log(`스키마이름[${curItem.schemaName}]),
            모델이름[${curItem.modelName}]이 데이터 베이스 객체의 속성으로 추가되었습니다.`);
        app.set('database', database);
        console.log('database 객체가 app객체의 속성으로 추가됨');

    }
}

module.exports = database; // 사용자정의 모듈 내보내기