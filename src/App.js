import { useState } from 'react';
import './App.css';

function App() {
  let nowDate = new Date();
  let thisYear = nowDate.getFullYear();
  let thisMonth = nowDate.getMonth() + 1;

  // 발주 추가버튼 누르면 행 추가하기
  let [order, setOrder] = useState([0]);
  const addOrder = () => {
    let copy = [...order];
    copy.push(0);
    setOrder(copy);
  };

  return (
    <div className="App">
      <div className="header">
        <h1 id="title">
          {thisYear}년 {thisMonth}월 발주 관리
        </h1>
        <div>
          <button id="saveBtn" type="button">
            저장하기
          </button>
          <button id="deleteBtn" type="button">
            선택삭제
          </button>
          <button
            id="addBtn"
            type="button"
            onClick={() => {
              addOrder();
            }}
          >
            발주추가
          </button>
        </div>
      </div>
      <div className="main">
        <table>
          <thead>
            <tr>
              <th>선택</th>
              <th>발주번호</th>
              <th>발주일</th>
              <th>긴급발주</th>
              <th>고객사</th>
              <th>품목코드</th>
              <th>품목명</th>
              <th>발주수량</th>
              <th>납기일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {order.map((elm, idx) => {
              return (
                <tr>
                  <td>
                    <input type="checkbox" name="check" id="check" />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="발주번호를 입력해주세요"
                    />
                  </td>
                  <td>
                    <input type="date" />
                  </td>
                  <td className="checkbox">
                    <input type="checkbox" name="emergency" id="emergency" />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="고객사를 입력해주세요"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="품목코드를 입력해주세요"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="품목명을 입력해주세요"
                    />
                  </td>
                  <td>
                    <input type="number" min={0} value={0} />
                  </td>
                  <td>
                    <input type="date" />
                  </td>
                  <td>
                    <textarea
                      name="etc"
                      id="etc"
                      cols="20"
                      rows="2"
                      className="text"
                    ></textarea>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
