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

  //첫번째 날짜, 두번째 날짜, 세번째 날짜를 저장할 state생성
  let [threeDates, setThreeDates] = useState();

  //오늘로부터 3일의 날짜구하기
  const getThisDays = () => {
    let firstDate = new Date();
    let secondDate = new Date(firstDate);
    let thirdDate = new Date(firstDate);
    secondDate.setDate(firstDate.getDate() + 1);
    thirdDate.setDate(firstDate.getDate() + 2);

    const firstDateObj = {
      year: firstDate.getFullYear(),
      month: firstDate.getMonth() + 1,
      date: firstDate.getDate(),
      day: firstDate.getDay(),
    };
    const secondDateObj = {
      year: secondDate.getFullYear(),
      month: secondDate.getMonth() + 1,
      date: secondDate.getDate(),
      day: secondDate.getDay(),
    };
    const thirdDateObj = {
      year: thirdDate.getFullYear(),
      month: thirdDate.getMonth() + 1,
      date: thirdDate.getDate(),
      day: thirdDate.getDay(),
    };
    setThreeDates([firstDateObj, secondDateObj, thirdDateObj]);
  };
  useEffect(() => {
    getThisDays();
    console.log(threeDates);
  }, []);

  return (
    <div>
      <div className="teamTitle">
        <h2>1팀</h2>
      </div>
      <div className="teamMain">
        <div className="teamTable1">
          <table>
            <thead className="teamTable-thead">
              <tr>
                <th colSpan={10}>
                  {threeDates
                    ? `${threeDates[0].year}` +
                      `년` +
                      `${threeDates[0].month}` +
                      `월` +
                      `${threeDates[0].date}` +
                      `일` +
                      `${threeDates[0].day}`
                    : null}
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
                  {threeDates
                    ? `${threeDates[1].year}` +
                      `년` +
                      `${threeDates[1].month}` +
                      `월` +
                      `${threeDates[1].date}` +
                      `일` +
                      `${threeDates[1].day}`
                    : null}
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
                  {threeDates
                    ? `${threeDates[2].year}` +
                      `년` +
                      `${threeDates[2].month}` +
                      `월` +
                      `${threeDates[2].date}` +
                      `일` +
                      `${threeDates[2].day}`
                    : null}
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
