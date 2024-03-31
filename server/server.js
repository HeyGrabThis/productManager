const express = require('express'); // npm i express | yarn add express
const cors = require('cors'); // npm i cors | yarn add cors
const db = require('./config/db'); // npm i mysql | yarn add mysql
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//년도와 달 파라미터로 받아와서 get하기
app.get('/api/product/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const q = `SELECT * FROM product_management WHERE order_code LIKE '?%'`;

  const thisMonthYear = Number(req.params.id);

  db.query(q, [thisMonthYear], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

// insert
app.post('/api/product/insert', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');

  const sqlQuery =
    'INSERT INTO product_management(`color`, `emergency_yn`, `etc1`, `etc2`, `order_code`, `order_end_date`, `order_start_date`, `ordersheet_collect_yn`, `ordersheet_publish_yn`, `product_code`, `product_complmplete_yn`, `product_quantity`, `product_team`, `report_yn`, `shipment_complete_yn`, `special_note`, `special_note_yn`) VALUES(?)';
  const values = [
    req.body.color,
    req.body.emergency_yn,
    req.body.etc1,
    req.body.etc2,
    req.body.order_code,
    req.body.order_end_date,
    req.body.order_start_date,
    req.body.ordersheet_collect_yn,
    req.body.ordersheet_publish_yn,
    req.body.product_code,
    req.body.product_complmplete_yn,
    req.body.product_quantity,
    req.body.product_team,
    req.body.report_yn,
    req.body.shipment_complete_yn,
    req.body.special_note,
    req.body.special_note_yn,
  ];
  db.query(sqlQuery, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      res.json('success');
    }
  });
});

// order_id로 서버에 있는 리스트 삭제하기
app.delete('/api/product/del/:id', (req, res) => {
  const orderId = req.params.id;
  const q = 'DELETE FROM product_management WHERE order_id = ?';

  db.query(q, [orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 수정하기(발주관리에서)
app.put('/api/product/update/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `emergency_yn` = ?, `etc1` = ?, `order_code` = ?, `order_end_date` = ?, `order_start_date` = ?, `product_code` = ?, `product_quantity` = ? WHERE order_id = ?';
  const values = [
    req.body.emergency_yn,
    req.body.etc1,
    req.body.order_code,
    req.body.order_end_date,
    req.body.order_start_date,
    req.body.product_code,
    req.body.product_quantity,
  ];
  db.query(q, [...values, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 긴급발주 리스트 체크로 수정(발주관리에서)
app.put('/api/product/update/list/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `emergency_yn` = ? WHERE order_id = ?';
  const value = req.body.emergency_yn;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

//생산계획관리 page

// 생산계획관리에서 color수정
app.put('/api/product/update/color/:id', (req, res) => {
  const orderId = req.params.id;
  const q = 'UPDATE product_management SET `color` = ? WHERE order_id = ?';
  const value = req.body.color;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 생산계획관리에서 team수정
app.put('/api/product/update/team/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `product_team` = ? WHERE order_id = ?';
  const value = req.body.product_team;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 생산계획관리에서 orderSheet 발행수정
app.put('/api/product/update/orderSheetPublish/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `ordersheet_publish_yn` = ? WHERE order_id = ?';
  const value = req.body.ordersheet_publish_yn;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 생산계획관리에서 orderSheet 회수수정
app.put('/api/product/update/orderSheetCollect/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `ordersheet_collect_yn` = ? WHERE order_id = ?';
  const value = req.body.ordersheet_collect_yn;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 생산계획관리에서 성적서 발행수정
app.put('/api/product/update/report/:id', (req, res) => {
  const orderId = req.params.id;
  const q = 'UPDATE product_management SET `report_yn` = ? WHERE order_id = ?';
  const value = req.body.report_yn;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 생산계획관리에서 특이사항수정
app.put('/api/product/update/specialNote/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `special_note` = ? WHERE order_id = ?';
  const value = req.body.special_note;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// 생산계획관리에서 비고2수정
app.put('/api/product/update/etc2/:id', (req, res) => {
  const orderId = req.params.id;
  const q = 'UPDATE product_management SET `etc2` = ? WHERE order_id = ?';
  const value = req.body.etc2;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// team 1 데이터 get
app.get('/api/team1/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const q = `SELECT * FROM product_management WHERE order_code LIKE '?%'`;

  const thisMonthYear = Number(req.params.id);

  db.query(q, [thisMonthYear], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});
