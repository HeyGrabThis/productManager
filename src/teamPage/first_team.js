import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

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

  return (
    <div>
      <div className="teamTitle">
        <h3>1팀</h3>
      </div>
      <div className="teamMain">
        <div className="teamTable1">
          <table>
            <thead className="teamTable-thead">
              <tr>
                <th colSpan={10}>
                  {thisMonthYear.year}년 {thisMonthYear.month}월{' '}
                  {thisMonthYear.date}일 {thisMonthYear.day}
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
            <tbody></tbody>
          </table>
        </div>
        <div className="teamTable2">
          <table>
            <thead className="teamTable-thead">
              <tr>
                <th colSpan={10}>
                  {thisMonthYear.year}년 {thisMonthYear.month}월{' '}
                  {thisMonthYear.date}일 {thisMonthYear.day}
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
            <tbody></tbody>
          </table>
        </div>
        <div className="teamTable3">
          <table>
            <thead className="teamTable-thead">
              <tr>
                <th colSpan={10}>
                  {thisMonthYear.year}년 {thisMonthYear.month}월{' '}
                  {thisMonthYear.date}일 {thisMonthYear.day}
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
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FirstTeam;
