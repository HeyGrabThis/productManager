import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import product from '../product';

const FirstTeam = (props) => {
  let nowDate = new Date();
  let nowYear = nowDate.getFullYear();
  let nowMonth = nowDate.getMonth() + 1;
  let todayDate = nowDate.getDate();
  let todayDay;
  switch (nowDate.getDay()) {
    case 0:
      todayDay = '일요일';
      break;
    case 1:
      todayDay = '월요일';
      break;
    case 2:
      todayDay = '화요일';
      break;
    case 3:
      todayDay = '수요일';
      break;
    case 4:
      todayDay = '목요일';
      break;
    case 5:
      todayDay = '금요일';
      break;
    case 6:
      todayDay = '토요일';
      break;
  }

  // 날짜 객체로 저장
  let [thisMonthYear, setThisMonthYear] = useState({
    month: nowMonth,
    year: nowYear,
    date: todayDate,
    day: todayDay,
  });

  //order를 담아서 렌더링할 state생성
  let [order3, setOrder3] = useState([]);

  // 서버에서 order로 옮겨줌. 무슨 년도,달에 위치해있는지 확인하고 그에 맞는 데이터 가져오기
  const getServerOrderList = async () => {
    let thisMonthYearCopy =
      `${thisMonthYear.year}`.slice(-2) +
      String(thisMonthYear.month).padStart(2, '0') +
      String(thisMonthYear.date).padStart(2, '0');

    try {
      let res = await axios.get(
        'http://localhost:3001/api/team1/' + thisMonthYearCopy
      );
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
          color: elm.color,
          team: elm.product_team,
          specialNote: elm.special_note,
          specialNote_yn: Number(elm.special_note_yn),
          product_complmplete_yn: Number(elm.product_complmplete_yn),
          shipment_complete_yn: Number(elm.shipment_complete_yn),
          //품목명과 회사 parsing
          productName: sameProduct.productName,
          company: sameProduct.company,
          //고유 id가져오기. 받아오는 것만 하고 보내는 건 하지않음
          orderId: elm.order_id,
        };
      });
      setOrder3(copy);
      console.log(copy);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getServerOrderList();
  }, [thisMonthYear]);

  return (
    <div>
      <div className="teamTitle">
        <h1>1팀</h1>
      </div>
      <div className="teamMain">
        <div className="teamTable1">
          <table>
            <thead className="teamTable-thead">
              <tr>
                <th colSpan={10} className="teamTable-date">
                  {thisMonthYear.year}년 {thisMonthYear.month}월{' '}
                  {thisMonthYear.date}일
                </th>
              </tr>
              <tr>
                <th>NO.</th>
                <th>발주번호</th>
                <th>고객사</th>
                <th>품목코드</th>
                <th>품목명</th>
                <th>수량</th>
                <th>COLOR</th>
                <th>생산완료</th>
                <th>출하완료</th>
                <th>특이사항</th>
              </tr>
            </thead>
            <tbody>
              {order3.map((elm, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{elm.orderCode}</td>
                    <td>{elm.company}</td>
                    <td>{elm.productCode}</td>
                    <td>{elm.productName}</td>
                    <td>{elm.quantity}</td>
                    <td>{elm.color}</td>
                    <td>{elm.product_complmplete_yn}</td>
                    <td>{elm.shipment_complete_yn}</td>
                    <td>{elm.specialNote_yn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FirstTeam;
