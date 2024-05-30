const express = require('express'); // npm i express | yarn add express
const cors = require('cors'); // npm i cors | yarn add cors
const db = require('./config/db'); // npm i mysql | yarn add mysql
const path = require('path');
const app = express();
const PORT = 3001;

const bodyParser = require('body-parser');

//jwt
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 사용자 등록
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO user (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    (err, results) => {
      if (err) {
        return res.status(500).send({ message: 'Error registering user' });
      }
      res.send({ message: 'User registered successfully' });
    }
  );
});

// 사용자 로그인
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM user WHERE username = ?',
    [username],
    async (err, results) => {
      try {
        if (err) {
          return res.status(500).send({ message: 'Error logging in' });
        }

        if (results.length === 0) {
          return res.status(401).send({ message: 'no User' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).send({ message: 'Invalid credentials' });
        }

        // 지속시간 3시간인 토큰 생성
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
          expiresIn: '3h',
        });
        // 토큰 db에 저장
        db.query(
          'UPDATE user SET token = ? WHERE id = ?',
          [token, user.id],
          (err, data) => {
            if (err) {
              res.send(err);
            }
          }
        );
        res.cookie('product_auth', token).send({
          id: user.id,
          username: username,
          message: 'Logged in successfully',
          token,
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  );
});

// 인증된 사용자 정보 조회
const auth = async (req, res, next) => {
  try {
    //클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.product_auth;

    if (!token) {
      return res
        .status(401)
        .send({ message: 'Not authenticated', loginStatus: false });
    }
    //토큰 디코딩
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    db.query(
      'SELECT * FROM user WHERE id = ?',
      [decoded.id],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .send({ message: 'Error fetching user', loginStatus: false });
        }
        if (results.length === 0) {
          return res
            .status(404)
            .send({ message: 'User not found', loginStatus: false });
        }
        //id로 찾은 것의 토큰과 지금 나의 토큰이 같다면 next로
        if (results[0].token !== token) {
          return res
            .status(401)
            .send({ message: 'Invalid token', loginStatus: false });
        }
        next();
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err, loginStatus: false });
  }
};

app.put('/logout', auth, (req, res) => {
  let id = req.body.id;
  const q = 'UPDATE user SET token="" WHERE id = ?';

  //db의 토큰 없애기
  db.query(q, [id], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ message: 'Error logout', logoutStatus: false });
    }
    //로그아웃 성공, 쿠키의 토큰없애기
    res
      .clearCookie('product_auth')
      .send({ message: 'Logout success', logoutStatus: true });
  });
});

app.get('/user', auth, async (req, res) => {
  res.status(200).send({ loginStatus: true });
});

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
    'INSERT INTO product_management(`color`, `emergency_yn`, `etc1`, `etc2`, `order_code`, `order_end_date`, `order_start_date`, `ordersheet_collect_yn`, `ordersheet_publish_yn`, `product_code`, `product_complete_yn`, `product_quantity`, `product_team`, `report_yn`, `shipment_complete_yn`, `special_note`, `special_note_yn`) VALUES(?)';
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
    req.body.product_complete_yn,
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
  const q = `SELECT * FROM product_management WHERE product_team = '1팀' AND order_end_date = ?`;

  const thisMonthYear = req.params.id;

  db.query(q, [thisMonthYear], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

// team 2 데이터 get
app.get('/api/team2/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const q = `SELECT * FROM product_management WHERE product_team = '2팀' AND order_end_date = ?`;

  const thisMonthYear = req.params.id;

  db.query(q, [thisMonthYear], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

// team 3 데이터 get
app.get('/api/team3/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const q = `SELECT * FROM product_management WHERE product_team = '3팀' AND order_end_date = ?`;

  const thisMonthYear = req.params.id;

  db.query(q, [thisMonthYear], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

// team page에서 생산완료 update
app.put('/api/product/update/product_complete_yn/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `product_complete_yn` = ? WHERE order_id = ?';
  const value = req.body.product_complete_yn;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// team page에서 출하완료 update
app.put('/api/product/update/shipment_complete_yn/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `shipment_complete_yn` = ? WHERE order_id = ?';
  const value = req.body.shipment_complete_yn;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

// team page에서 특이사항 update
app.put('/api/product/update/specialNote_yn/:id', (req, res) => {
  const orderId = req.params.id;
  const q =
    'UPDATE product_management SET `special_note_yn` = ? WHERE order_id = ?';
  const value = req.body.special_note_yn;
  db.query(q, [value, orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

//product_code 테이블 데이터 가져오기
app.get('/api/productcode', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const q = `SELECT * FROM product_code`;

  db.query(q, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

//product_code 테이블에 추가하기
app.post('/api/productcode/insert', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');

  const sqlQuery =
    'INSERT INTO product_code(`product_code`, `company`, `product_name`) VALUES(?)';
  const values = [
    req.body.product_code,
    req.body.company,
    req.body.product_name,
  ];
  db.query(sqlQuery, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      res.json('success');
    }
  });
});

//product_code 테이블에서 데이터 삭제
app.delete('/api/productcode/del/:id', (req, res) => {
  const orderId = req.params.id;
  const q = 'DELETE FROM product_code WHERE id = ?';

  db.query(q, [orderId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('success');
    }
  });
});

//product_code 페이지에서 삭제할 때 product_management 테이블에 사용중인지 데이터 받아오기
app.get('/api/product/code/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const q = `SELECT * FROM product_management WHERE product_code = ?`;

  const product_code = req.params.id;

  db.query(q, [product_code], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
