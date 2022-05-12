module.exports = {
    server_port: 3000, // 기본포트설정
    db_url: 'mongodb://127.0.0.1:2017/frontenddb', // 몽고디비연결 주소설정
    db_schemas: [{
        file: './member_schema', collection: 'member2',
        schemaName: 'MemberSchema', modelName: 'MemberModel'
    }], // 스키마를 개별 생성
    facebook: {
        clientID: '515275780298967',
        clientSecret: '0b7c78b468c8baf566ef3f7fa5f70597',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    } // 페이스북 정보를 설정
}