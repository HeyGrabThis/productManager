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

  //선택하면 order상태 1로, 다시 해제하면 0으로. 상태 알 수 있음
  const changeCheck = (idx) => {
    if (order[idx] === 0) {
      let copy = [...order];
      copy[idx] += 1;
      setOrder(copy);
    } else {
      let copy = [...order];
      copy[idx] -= 1;
      setOrder(copy);
    }
  };

  //삭제버튼 누르면 선택한 항목 삭제하기
  const deleteOrder = () => {
    if (order.indexOf(1) === -1) {
      alert('선택한 항목이 없습니다');
    } else {
    }
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
          <button
            id="deleteBtn"
            type="button"
            onClick={() => {
              deleteOrder();
            }}
          >
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
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      name="check"
                      id="check"
                      onChange={() => {
                        changeCheck(idx);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="발주번호를 입력해주세요"
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input type="date" onChange={() => {}} />
                  </td>
                  <td className="checkbox">
                    <input
                      type="checkbox"
                      name="emergency"
                      id="emergency"
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="고객사를 입력해주세요"
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="품목코드를 입력해주세요"
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="품목명을 입력해주세요"
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={0}
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input type="date" onChange={() => {}} />
                  </td>
                  <td>
                    <textarea
                      name="etc"
                      id="etc"
                      cols="20"
                      rows="2"
                      className="text"
                      onChange={() => {}}
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
