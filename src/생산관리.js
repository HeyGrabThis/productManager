import { useState } from 'react';
const ProductManagement = (props) => {
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

  // 나중에 order 서버에서 받아와서 order2 생성
  let [order2, setOrder2] = useState([]);

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
          {thisMonthYear.year}년 {thisMonthYear.month}월 발주 관리
          <button
            onClick={() => {
              nextMonth();
            }}
          >
            ▶︎
          </button>
        </h4>
      </div>
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
        <tbody>
          {order2.map((elm, idx) => {
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
