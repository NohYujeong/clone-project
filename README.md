# Trello Clone Project

[![ezgif-com-gif-maker.gif](https://i.postimg.cc/gJPrpP07/ezgif-com-gif-maker.gif)](https://postimg.cc/B8MJ5kH5)

### 제한 조건

- Javascript Library 사용 금지
- HTML / JS / CSS 직접 작성

### 구현 기능

- [x] List 추가
- [x] List Title 변경
- [x] Item 추가
- [x] Item Title 변경
- [x] Drag & Drop 기능으로 Item 위치 변경
- [x] 변경 내용, 서버를 통해 다른 클라이언트에도 동기화
  - `json-server` 를 사용하여 db.json 파일에 동기화 작업 진행

### 프로젝트 시작

```
npm install

// nodemon 이 깔려있을 경우
npm run start

// or
node index.js & node server.js

client : http://localhost:3000
server : http://localhost:8080
```

### 프로젝트 구조

```
.
├── README.md
├── css
│   └── style.css
├── db.json // json-server 에 이용하는 json 파일
├── index.html
├── client.js // client run file
├── js
│   ├── api.js
│   ├── app.js
│   ├── controller.js
│   ├── model.js
│   ├── templates.js
│   └── view.js
├── package.json
└── server.js // server run file
```
