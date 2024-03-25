const express = require('express'); // npm i express | yarn add express
const cors = require('cors'); // npm i cors | yarn add cors
const db = require('./config/db'); // npm i mysql | yarn add mysql
const app = express();
const PORT = 3001;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});

app.use(
  cors({
    origin: '*', // 출처 허용 옵션
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  })
);

app.get('/api/product', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');

  db.query('select * from product_management', (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});
