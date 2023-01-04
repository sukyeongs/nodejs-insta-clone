// app.js: 핵심적인 서버 역할, 미들웨어 관리

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');  //morgan: 로그를 관리하기 위한 미들웨어

// env 파일 정보 가져오기
require('dotenv').config();
const { PORT, MONGODB_URI } = process.env;

// express 패키지 호출하여 app 변수 객체 생성
const app = express();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const connectDB = require('./db/connect');

// view engine setup -> app.set()으로 익스프레스 앱 설정
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// app.use -> 미들웨어 연결하는 부분 (미들웨어: 반드시 next()를 호출해야 다음 미들웨어로 넘어감)
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));  // parse requests of content-type => application/x-www-form-urlencoded
app.use(cookieParser());
app.use(bodyParser.json());  // parse requests of content-type => application/json
//xapp.use(express.static(path.join(__dirname, 'public')));

// DB 연동
connectDB();

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(PORT, ()=>{
    console.log(`Example app listening on port ${PORT}`)
})