# Node.js 프로젝트 아키텍처 설계 방법

## 1. 3계층 설계
- Principle of seperation of concerns를 적용하기 위해, 비즈니스 로직을 node.js의 API Routes와 분리시킨다. (node.js 서버에서 API를 호출하는 것은 좋지 않다)


## 2. 비즈니스 로직은 Controller 계층이 아닌, `Service` 계층에 넣는다. 
- Controller에 비즈니스 로직을 넣게 되면 스파게티 코드가 됨
- Service 계층: 분명한 목적이 있는 클래스들의 집합
    - req와 res 객체를 전달하지 않는다.
    - 상태코드나 헤더 같은 HTTP 전송 계층과 관련된 것들은 반환하지 않는다.

*Example*
``` javascript
// controller
route.post('/', 
  validators.userSignup, // this middleware take care of validation
  async (req, res, next) => {
    // The actual responsability of the route layer.
    const userDTO = req.body;

    // Call to service layer.
    // Abstraction on how to access the data layer and the business logic.
    const { user, company } = await UserService.Signup(userDTO);

    // Return a response to client.
    return res.json({ user, company });
  });
```

``` javascript
// service
import UserModel from '../models/user';
import CompanyModel from '../models/company';

export default class UserService() {

  async Signup(user) {
    const userRecord = await UserModel.create(user);
    const companyRecord = await CompanyModel.create(userRecord); // needs userRecord to have the database id 
    const salaryRecord = await SalaryModel.create(userRecord, companyRecord); // depends on user and company to be created
    
    ...whatever
    
    await EmailService.startSignupSequence(userRecord)

    ...do more stuff

    return { user: userRecord, company: companyRecord };
  }
}
```


## 3. Pub/Sub 계층을 사용한다.
- 간단한 node.js API EndPoint에서 사용자를 생성한 후에 서드파티 서비스를 호출하거나, 서비스 분석을 시도하는 등의 작업을 할 때 사용한다.
- principle of single responsibility를 준수하기 위해, 코드 작성 시작부터 `책임들을 분리`하여 간결하게 코드를 유지 관리한다.
- `이벤트`를 발생시켜 리스너들에게 책임을 분리하는 것이 좋다.

```javascript
import UserModel from '../models/user';
import CompanyModel from '../models/company';
import SalaryModel from '../models/salary';

export default class UserService() {

  async Signup(user) {
    const userRecord = await UserModel.create(user);
    const companyRecord = await CompanyModel.create(user);
    const salaryRecord = await SalaryModel.create(user, salary);

    eventTracker.track(
      'user_signup',
      userRecord,
      companyRecord,
      salaryRecord
    );

    intercom.createUser(
      userRecord
    );

    gaAnalytics.event(
      'user_signup',
      userRecord
    );
    
    await EmailService.startSignupSequence(userRecord)

    ...more stuff

    return { user: userRecord, company: companyRecord };
  }

}
```


## 4. 의존성 주입(DI)
- 생성자를 통해 클래스와 함수의 의존성을 주입하는 방식
- `service` 에 대한 유닛 테스트를 작성할 때나 다른 context에서 코드를 사용할 때 도움이 된다.
- *`typedi`* : node.js에서 의존성을 사용할 수 있게 해주는 npm 라이브러리

```javascript
import { Service } from 'typedi';
@Service()
export default class UserService {
  constructor(
    private userModel,
    private companyModel, 
    private salaryModel
  ){}

  getMyUser(userId){
    const user = this.userModel.findById(userId);
    return user;
  }
}
```

```javascript
// routing layer
route.post('/', 
  async (req, res, next) => {
    const userDTO = req.body;

    const userServiceInstance = Container.get(UserService) // Service locator

    const { user, company } = userServiceInstance.Signup(userDTO);

    return res.json({ user, company });
  });
```


## 5. 설정이나 시크릿 파일은 dotenv를 사용한다.
- `.env` 파일은 만들되 절대 커밋해서는 안된다.
- npm 패키지인 `dotenv` 는 `.env` 파일을 로드하여 안에 있는 값들을 node.js의 `process.env` 객체에 대입한다.



## 6. Loaders를 사용하여 서비스의 시작 프로세스를 테스트 가능한 모듈로 나눈다.
- `Loaders` : 간단한 목적이 있는 작은 파일들

*Example*

```javascript
// loaders/index.js

import expressLoader from './express';
import mongooseLoader from './mongoose';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  console.log('MongoDB Intialized');
  await expressLoader({ app: expressApp });
  console.log('Express Intialized');

  // ... more loaders can be here

  // ... Initialize agenda
  // ... or Redis, or whatever you want
}
```

```javascript
// loaders/express.js

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

export default async ({ app }: { app: express.Application }) => {

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });
  app.enable('trust proxy');

  app.use(cors());
  app.use(require('morgan')('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));

  // ...More middlewares

  // Return the express app
  return app;
})
```

```javascript
// loaders/mongoose.js

import * as mongoose from 'mongoose'
export default async (): Promise<any> => {
  const connection = await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
  return connection.connection.db;
}
```