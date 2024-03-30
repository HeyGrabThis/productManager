import { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './App.css';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import product from './product';
import axios from 'axios';

const ProductManagement = (props) => {
  let navigate = useNavigate();
  const changeMainPage = () => {
    navigate('/');
  };

  let nowDate = new Date();
  let nowYear = nowDate.getFullYear();
  let nowMonth = nowDate.getMonth() + 1;

  // 달 이동 함수
  let [thisMonthYear, setThisMonthYear] = useState({
    month: nowMonth,
    year: nowYear,
  });
  const preMonth = () => {
    if (thisMonthYear.month === 1) {
      let copy = { ...thisMonthYear };
      copy.month = 12;
      copy.year -= 1;
      setThisMonthYear(copy);
    } else {
      let copy = { ...thisMonthYear };
      copy.month -= 1;
      setThisMonthYear(copy);
    }
  };
  const nextMonth = () => {
    if (thisMonthYear.month === 12) {
      let copy = { ...thisMonthYear };
      copy.month = 1;
      copy.year += 1;
      setThisMonthYear(copy);
    } else {
      let copy = { ...thisMonthYear };
      copy.month += 1;
      setThisMonthYear(copy);
    }
  };

  //드롭다운.컬러. 서버연결까지
  const colorOptions = ['빨강', '파랑', '노랑'];
  const changeColor = async (value, idx) => {
    let copy = [...order2];
    copy[idx].color = value;
    setOrder2(copy);
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/color/' + copy[idx].orderId,
        {
          color: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //드롭다운.생산팀. 서버연결까지
  const teamOptions = ['1팀', '2팀', '3팀'];
  const changeTeam = async (value, idx) => {
    let copy = [...order2];
    copy[idx].team = value;
    setOrder2(copy);
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/team/' + copy[idx].orderId,
        {
          product_team: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //orderSheet발행완료 입력함수. 서버연결까지
  const changeSheetPublish = async (idx) => {
    let copy = [...order2];
    if (order2[idx].orderSheetPublish === 0) {
      copy[idx].orderSheetPublish += 1;
    } else {
      copy[idx].orderSheetPublish -= 1;
    }
    setOrder2(copy);
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/orderSheetPublish/' +
          copy[idx].orderId,
        {
          ordersheet_publish_yn: copy[idx].orderSheetPublish,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //orderSheet회수완료 입력함수. 서버연결까지
  const changeSheetCollect = async (idx) => {
    let copy = [...order2];
    if (order2[idx].orderSheetCollect === 0) {
      copy[idx].orderSheetCollect += 1;
    } else {
      copy[idx].orderSheetCollect -= 1;
    }
    setOrder2(copy);
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/orderSheetCollect/' +
          copy[idx].orderId,
        {
          ordersheet_collect_yn: copy[idx].orderSheetCollect,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //성적서 발행 입력함수. 서버연결까지
  const changeReport = async (idx) => {
    let copy = [...order2];
    if (order2[idx].report === 0) {
      copy[idx].report += 1;
    } else {
      copy[idx].report -= 1;
    }
    setOrder2(copy);
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/report/' + copy[idx].orderId,
        {
          report_yn: copy[idx].report,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //특이사항 입력함수. 서버연결까지
  const changeSpecialNote = async (value, idx) => {
    let copy = [...order2];
    copy[idx].specialNote = value;
    setOrder2(copy);
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/specialNote/' +
          copy[idx].orderId,
        {
          special_note: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //비고 입력함수. 서버연결까지
  const changeEtc2 = async (value, idx) => {
    let copy = [...order2];
    copy[idx].etc2 = value;
    setOrder2(copy);
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/etc2/' + copy[idx].orderId,
        {
          etc2: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 나중에 order 서버에서 받아와서 order2 생성
  let [order2, setOrder2] = useState([]);

  // 리스트 수정상태 나타내기위한 state생성
  let [modifyState, setModifyState] = useState(0);

  //서버에서 데이터 받아오기
  const getServerOrderList2 = async () => {
    let thisMonthYearCopy =
      `${thisMonthYear.year}`.slice(-2) +
      String(thisMonthYear.month).padStart(2, '0');
    try {
      let res = await axios.get(
        'http://localhost:3001/api/product/' + thisMonthYearCopy
      );
      //parsing작업
      let copy = res.data.map((elm, idx) => {
        //품목코드 조회해서 품목명과 회사 저장
        let product_codeValue = elm.product_code;
        let sameProduct = product.find(
          (elm) => product_codeValue === elm.productCode
        );
        return {
          orderCode: elm.order_code,
          startDay: elm.order_start_date,
          emergency: Number(elm.emergency_yn),
          productCode: elm.product_code,
          quantity: elm.product_quantity,
          endDay: elm.order_end_date,
          etc: elm.etc1,
          etc2: elm.etc2,
          color: elm.color,
          team: elm.product_team,
          orderSheetPublish: Number(elm.ordersheet_publish_yn),
          orderSheetCollect: Number(elm.ordersheet_collect_yn),
          report: Number(elm.report_yn),
          specialNote: elm.special_note,
          specialNote_yn: Number(elm.special_note_yn),
          product_complmplete_yn: Number(elm.product_complmplete_yn),
          shipment_complete_yn: Number(elm.shipment_complete_yn),
          //품목명과 회사 parsing
          productName: sameProduct.productName,
          company: sameProduct.company,
          //id 받아오기
          orderId: elm.order_id,
        };
      });
      setOrder2(copy);
      console.log(copy);
    } catch (err) {
      console.log(err);
    }
  };
  //thisMonthYear바뀔때마다, mount될 때 서버에서 데이터 받아오기
  useEffect(() => {
    getServerOrderList2();
  }, [thisMonthYear]);

  return (
    <div>
      <div className="title">
        <h4>
          <button
            onClick={() => {
              preMonth();
            }}
          >
            ◀︎
          </button>
          {thisMonthYear.year}년 {thisMonthYear.month}월 생산계획 관리
          <button
            onClick={() => {
              nextMonth();
            }}
          >
            ▶︎
          </button>
        </h4>
        <div className="product-btn">
          <button
            className="product-loadBtn"
            onClick={() => {
              getServerOrderList2();
            }}
          >
            불러오기
          </button>
          <button
            onClick={() => {
              changeMainPage();
            }}
          >
            발주관리로 이동
          </button>
        </div>
      </div>
      <div className="product-main">
        <table>
          <thead>
            <tr>
              <th>NO.</th>
              <th>발주번호</th>
              <th>긴급</th>
              <th>고객사</th>
              <th>품목코드</th>
              <th>품목명</th>
              <th>수량</th>
              <th>COLOR</th>
              <th>발주일자</th>
              <th>납기일자</th>
              <th>생산팀</th>
              <th>Order Sheet 발행</th>
              <th>Order Sheet 회수</th>
              <th>성적서 발행</th>
              <th>특이사항</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody className="product-list">
            {order2
              ? order2.map((elm, idx) => {
                  return (
                    <tr
                      key={idx}
                      style={
                        order2[idx].emergency === 1
                          ? { background: '#ffb49c' }
                          : { background: 'white' }
                      }
                    >
                      <td>{idx + 1}</td>
                      <td>{elm.orderCode}</td>
                      <td>{elm.emergency === 1 ? '✔️' : ''}</td>
                      <td>{elm.company}</td>
                      <td>{elm.productCode}</td>
                      <td>{elm.productName}</td>
                      <td>{elm.quantity}</td>
                      <td>
                        <Dropdown
                          options={colorOptions}
                          onChange={(e) => {
                            changeColor(e.value, idx);
                          }}
                          value={elm.color ? elm.color : '선택'}
                        />
                      </td>
                      <td>{elm.startDay}</td>
                      <td>{elm.endDay}</td>
                      <td>
                        <Dropdown
                          options={teamOptions}
                          onChange={(e) => {
                            changeTeam(e.value, idx);
                          }}
                          value={elm.team ? elm.team : '선택'}
                        />
                      </td>
                      <td>
                        발행완료
                        <input
                          type="checkbox"
                          name="orderSheetPublish"
                          id="orderSheetPublish"
                          onChange={() => {
                            changeSheetPublish(idx);
                          }}
                          checked={elm.orderSheetPublish === 1 ? true : false}
                        />
                      </td>
                      <td>
                        회수완료
                        <input
                          type="checkbox"
                          name="orderSheetCollect"
                          id="orderSheetCollect"
                          onChange={() => {
                            changeSheetCollect(idx);
                          }}
                          checked={elm.orderSheetCollect === 1 ? true : false}
                        />
                      </td>
                      <td>
                        발행완료
                        <input
                          type="checkbox"
                          name="report"
                          id="report"
                          onChange={() => {
                            changeReport(idx);
                          }}
                          checked={elm.report === 1 ? true : false}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          onChange={(e) => {
                            changeSpecialNote(e.target.value, idx);
                          }}
                          value={elm.specialNote}
                        />
                      </td>
                      <td>
                        <textarea
                          name="etc2"
                          id="etc2"
                          cols="20"
                          rows="2"
                          onChange={(e) => {
                            changeEtc2(e.target.value, idx);
                          }}
                          value={elm.etc2}
                        ></textarea>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
