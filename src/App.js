import { useState } from 'react';
import './App.css';

function App() {
  let nowDate = new Date();
  let thisYear = nowDate.getFullYear();
  let thisMonth = nowDate.getMonth() + 1;

  // 발주 추가버튼 누르면 행 추가하기
  let [order, setOrder] = useState([
    {
      checked: 0,
      orderCode: '',
      startDay: '',
      emergency: 0,
      company: '',
      productCode: '',
      productName: '',
      quantity: 0,
      endDay: '',
      etc: '',
    },
  ]);
  const addOrder = () => {
    let copy = [...order];
    copy.push({
      checked: 0,
      orderCode: '',
      startDay: '',
      emergency: 0,
      company: '',
      productCode: '',
      productName: '',
      quantity: 0,
      endDay: '',
      etc: '',
    });
    setOrder(copy);
  };
  //checked만 따로 모아둔 배열 생성
  let checked = order.map((elm) => {
    return elm.checked;
  });

  //선택하면 order상태 1로, 다시 해제하면 0으로. 상태 알 수 있음
  const changeCheck = (idx) => {
    if (order[idx].checked === 0) {
      let copy = [...order];
      copy[idx].checked += 1;
      setOrder(copy);
    } else {
      let copy = [...order];
      copy[idx].checked -= 1;
      setOrder(copy);
    }
  };

  // 발주번호 입력시 state 변경함수
  const changeOrderCode = (idx, value) => {
    let copy = [...order];
    copy[idx].orderCode = value;
    setOrder(copy);
  };
  // 발주일 입력시 state 변경함수
  const changeStartDay = (idx, value) => {
    let copy = [...order];
    copy[idx].startDay = value;
    setOrder(copy);
  };
  // 긴급발주 입력시 state 변경함수
  const changeEmergency = (idx) => {
    if (order[idx].emergency === 0) {
      let copy = [...order];
      copy[idx].emergency += 1;
      setOrder(copy);
    } else {
      let copy = [...order];
      copy[idx].emergency -= 1;
      setOrder(copy);
    }
  };
  // 고객사 변경함수
  const changeCompany = (idx, value) => {
    let copy = [...order];
    copy[idx].company = value;
    setOrder(copy);
  };
  // 품목코드 변경함수
  const changeProductCode = (idx, value) => {
    let copy = [...order];
    copy[idx].productCode = value;
    setOrder(copy);
  };
  // 품목명 변경함수
  const changeProductName = (idx, value) => {
    let copy = [...order];
    copy[idx].productName = value;
    setOrder(copy);
  };
  // 개수 변경함수
  const changeQuantity = (idx, value) => {
    let copy = [...order];
    copy[idx].quantity = value;
    setOrder(copy);
  };
  // 마감날짜 변경함수
  const changeEndDay = (idx, value) => {
    let copy = [...order];
    copy[idx].endDay = value;
    setOrder(copy);
  };
  // 비고 변경함수
  const changeEtc = (idx, value) => {
    let copy = [...order];
    copy[idx].etc = value;
    setOrder(copy);
  };

  //삭제버튼 누르면 선택한 항목 삭제하기
  const deleteOrder = () => {
    if (checked.indexOf(1) === -1) {
      alert('선택한 항목이 없습니다');
    } else {
      // 현재 order배열의 1은 모두 삭제되지만 그게 html에 내가 선택한 요소가 삭제되지는 않는 문제가 있음.
      // let copy = [...order];
      // let checkedOrder = order.filter((elm) => {
      //   return elm === 1;
      // });
      // for (let i = checkedOrder.length; i > 0; i--) {
      //   let one = copy.findIndex((elm) => {
      //     return elm === 1;
      //   });
      //   copy.splice(one, 1);
      //   console.log(copy);
      //   setOrder(copy);
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
                      onChange={(e) => {
                        changeOrderCode(idx, e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      onChange={(e) => {
                        changeStartDay(idx, e.target.value);
                      }}
                    />
                  </td>
                  <td className="checkbox">
                    <input
                      type="checkbox"
                      name="emergency"
                      id="emergency"
                      onChange={() => {
                        changeEmergency(idx);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="고객사를 입력해주세요"
                      onChange={(e) => {
                        changeCompany(idx, e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="품목코드를 입력해주세요"
                      onChange={(e) => {
                        changeProductCode(idx, e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="text"
                      placeholder="품목명을 입력해주세요"
                      onChange={(e) => {
                        changeProductName(idx, e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={0}
                      onChange={(e) => {
                        changeQuantity(idx, e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      onChange={(e) => {
                        changeEndDay(idx, e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <textarea
                      name="etc"
                      id="etc"
                      cols="20"
                      rows="2"
                      className="text"
                      onChange={(e) => {
                        changeEtc(idx, e.target.value);
                      }}
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
