import { useState } from 'react';
import './App.css';

function App() {
  let nowDate = new Date();
  let thisYear = nowDate.getFullYear();
  let thisMonth = nowDate.getMonth() + 1;

  // 주문 목록 state
  let [order, setOrder] = useState([]);

  // input에 빈칸을 남길, order state에 추가할 state 생성
  let [orderCopy, setOrderCopy] = useState({
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
  // 발주 추가하기
  const addOrder = () => {
    let copy = [...order];
    copy.push(orderCopy);
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

  // 발주번호 입력함수
  const changeOrderCode = (value) => {
    let copy = { ...orderCopy };
    copy.orderCode = value;
    setOrderCopy(copy);
  };
  // 발주일 입력함수
  const changeStartDay = (value) => {
    let copy = { ...orderCopy };
    copy.startDay = value;
    setOrderCopy(copy);
  };
  // 긴급발주 입력시 state 변경함수
  const changeEmergency = () => {
    if (orderCopy.emergency === 0) {
      let copy = { ...orderCopy };
      copy.emergency += 1;
      setOrderCopy(copy);
    } else {
      let copy = { ...orderCopy };
      copy.emergency -= 1;
      setOrderCopy(copy);
    }
  };
  // 고객사 입력함수
  const changeCompany = (value) => {
    let copy = { ...orderCopy };
    copy.company = value;
    setOrderCopy(copy);
  };
  // 품목코드 입력함수
  const changeProductCode = (value) => {
    let copy = { ...orderCopy };
    copy.productCode = value;
    setOrderCopy(copy);
  };
  // 품목명 입력함수
  const changeProductName = (value) => {
    let copy = { ...orderCopy };
    copy.productName = value;
    setOrderCopy(copy);
  };
  // 개수 입력함수
  const changeQuantity = (value) => {
    let copy = { ...orderCopy };
    copy.quantity = value;
    setOrderCopy(copy);
  };
  // 마감날짜 입력함수
  const changeEndDay = (value) => {
    let copy = { ...orderCopy };
    copy.endDay = value;
    setOrderCopy(copy);
  };
  // 비고 입력함수
  const changeEtc = (value) => {
    let copy = { ...orderCopy };
    copy.etc = value;
    setOrderCopy(copy);
  };

  //삭제버튼 누르면 선택한 항목 삭제하기
  const deleteOrder = () => {
    if (checked.indexOf(1) === -1) {
      alert('선택한 항목이 없습니다');
    } else {
      if (window.confirm('선택한 항목을 삭제하시겠습니까?')) {
        let copy = [...order];
        // filter 말고 map쓰면 없어진 부분이 undefined로 나옴
        let copy2 = copy.filter((elm) => {
          if (elm.checked === 0) {
            return elm;
          }
        });
        setOrder(copy2);
      }
      // html화면에 input이기 때문에 값이 적용되지 않는 문제...
      // input value로 입력받은 값을 다시 value로 되돌려주거나 하는 생각...
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
              <th className="modifyBtn-border"> </th>
            </tr>
          </thead>
          <tbody>
            {order.map((elm, idx) => {
              return (
                <tr
                  key={idx}
                  style={
                    order[idx].emergency === 1
                      ? { background: '#ffb49c' }
                      : { background: 'white' }
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      name="check"
                      id="check"
                      onChange={() => {
                        changeCheck(idx);
                      }}
                      checked={order[idx].checked}
                    />
                  </td>
                  <td>{order[idx].orderCode}</td>
                  <td>{order[idx].startDay}</td>
                  <td>{order[idx].emergency === 1 ? '✔️' : ''}</td>
                  <td>{order[idx].company}</td>
                  <td>{order[idx].productCode}</td>
                  <td>{order[idx].productName}</td>
                  <td>{order[idx].quantity}</td>
                  <td>{order[idx].endDay}</td>
                  <td className="etc">{order[idx].etc}</td>
                  <td className="modifyBtn-border">
                    <button>수정</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="inputPart">
        <table>
          <thead>
            <tr>
              <th>발주번호</th>
              <th>발주일</th>
              <th>긴급</th>
              <th>고객사</th>
              <th>품목코드</th>
              <th>품목명</th>
              <th>발주수량</th>
              <th>납기일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className="text"
                  placeholder="발주번호를 입력해주세요"
                  onChange={(e) => {
                    changeOrderCode(e.target.value);
                  }}
                  value={orderCopy.orderCode}
                />
              </td>
              <td>
                <input
                  type="date"
                  onChange={(e) => {
                    changeStartDay(e.target.value);
                  }}
                  value={orderCopy.startDay}
                />
              </td>
              <td className="checkbox">
                <input
                  type="checkbox"
                  name="emergency"
                  id="emergency"
                  onChange={() => {
                    changeEmergency();
                  }}
                  checked={orderCopy.emergency}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="text"
                  placeholder="고객사를 입력해주세요"
                  onChange={(e) => {
                    changeCompany(e.target.value);
                  }}
                  value={orderCopy.company}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="text"
                  placeholder="품목코드를 입력해주세요"
                  onChange={(e) => {
                    changeProductCode(e.target.value);
                  }}
                  value={orderCopy.productCode}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="text"
                  placeholder="품목명을 입력해주세요"
                  onChange={(e) => {
                    changeProductName(e.target.value);
                  }}
                  value={orderCopy.productName}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  onChange={(e) => {
                    changeQuantity(e.target.value);
                  }}
                  value={orderCopy.quantity}
                />
              </td>
              <td>
                <input
                  type="date"
                  onChange={(e) => {
                    changeEndDay(e.target.value);
                  }}
                  value={orderCopy.endDay}
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
                    changeEtc(e.target.value);
                  }}
                  value={orderCopy.etc}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          id="addBtn"
          type="button"
          onClick={() => {
            addOrder();
            setOrderCopy({
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
          }}
        >
          추가하기
        </button>
      </div>
    </div>
  );
}

export default App;
