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

  // 목록중 하나라도 체크가 되지 않은 것이 있는지, 있다면 0, 모두 체크가 실제로 되어있다면 1
  // 이걸 allChecked와 비교해서 전체선택 checkbox상태를 지정할 수 있다
  let [anyChecked, setAnyChecked] = useState(0);
  const haveAnyChecked = () => {
    if (order.find((elm) => elm.checked === 0)) {
      setAnyChecked(0);
    } else {
      setAnyChecked(1);
    }
  };

  // checkAll 모두 체크하고 해제하는 함수
  let [allChecked, setAllChecked] = useState(0);
  const checkAll = () => {
    if (allChecked === 0) {
      let copy = [...order];
      copy.forEach((elm) => {
        elm.checked = 1;
      });
      setOrder(copy);
      setAllChecked(1);
    } else {
      let copy = [...order];
      copy.forEach((elm) => {
        elm.checked = 0;
      });
      setOrder(copy);
      setAllChecked(0);
    }
    //개별적으로 선택을 해제해서 anyChecked가 0이 되더라도 전체 선택을 눌렀을 때 상태를 한번 더 판단해서 전체선택 value에 표시될 수 있도록 최신화
    haveAnyChecked();
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
    }
  };

  // 각 항목 수정버튼 누르면 input 부분으로 옮겨오는 함수
  const modifyProduct = (idx) => {
    //이미 수정중이라면 먼저 수정을 완료할 것을 강요
    if (addState !== -1) {
      alert('현재 항목 수정중입니다. 수정을 완료해주세요.');
    } else {
      if (
        window.confirm(
          '현재 작성하고 있던 정보는 사라집니다. 수정하시겠습니까?'
        )
      ) {
        let copy = { ...order[idx] };
        setOrderCopy(copy);
        //버튼 수정완료로 바꿔주면서 수정하는 인덱스로 상태 바꿔주기
        setAddState(idx);
      }
    }
  };

  // 추가하기(-1), 수정완료(수정하는 idx) 버튼 ui 교체 state
  let [addState, setAddState] = useState(-1);

  // 수정완료한 값들 다시 원래 배열에 넣기
  const addModify = (idx) => {
    let copy = [...order];
    copy[idx] = orderCopy;
    setOrder(copy);
    // 버튼 '추가하기'로 바꿔야하고 ui state 수정
    setAddState(-1);
  };

  // 발주번호 정렬
  // const sortOrderCode = () => {
  //   let copy = [...order];
  //   // 발주번호에 '-'가 있는 경우 이걸 없애고 순서까지 담은 배열 생성.
  //   let copy2 = copy.map((elm, idx) => {
  //     let c = elm.orderCode.replace('-', '');
  //     let d = idx;
  //     return { c, d };
  //   });
  //   // copy2의 '-'를 없앤 발주번호에 따라 정렬하고 순서만 뽑은 배열 생성
  //   let copy3 = copy2
  //     .toSorted((a, b) => a.c - b.c)
  //     .map((elm) => {
  //       return elm.d;
  //     });
  //   // copy3의 값을 아까 복사해둔 copy의 순서에 넣어 새로운 배열 생성
  //   let copy4 = copy3.map((elm) => {
  //     return copy[elm];
  //   });
  //   setOrder(copy4);
  // };
  // 발주번호 정렬
  // 위 코드 간단하게 만듦
  const sortOrderCode = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted(
        (a, b) => a.orderCode.replace('-', '') - b.orderCode.replace('-', '')
      );
      setOrder(copy);
    }
  };
  const reverseSortOrderCode = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted(
        (a, b) => b.orderCode.replace('-', '') - a.orderCode.replace('-', '')
      );
      setOrder(copy);
    }
  };

  //발주일 정렬
  const sortStartDay = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted(
        (a, b) => new Date(a.startDay) - new Date(b.startDay)
      );
      setOrder(copy);
    }
  };
  const reverseSortStartDay = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted(
        (a, b) => new Date(b.startDay) - new Date(a.startDay)
      );
      setOrder(copy);
    }
  };

  // 긴급발주 정렬
  const sortEmergency = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) => b.emergency - a.emergency);
      setOrder(copy);
    }
  };
  const reverseSortEmergency = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) => a.emergency - b.emergency);
      setOrder(copy);
    }
  };

  // 고객사 정렬
  const sortCompany = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) => a.company.localeCompare(b.company));
      setOrder(copy);
    }
  };
  const reverseSortCompany = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) => b.company.localeCompare(a.company));
      setOrder(copy);
    }
  };

  // 품목코드 정렬
  const sortProductCode = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) =>
        a.productCode.localeCompare(b.productCode)
      );
      setOrder(copy);
    }
  };
  const reverseSortProductCode = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) =>
        b.productCode.localeCompare(a.productCode)
      );
      setOrder(copy);
    }
  };

  // 품목명 정렬
  const sortProductName = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) =>
        a.productName.localeCompare(b.productName)
      );
      setOrder(copy);
    }
  };
  const reverseSortProductName = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) =>
        b.productName.localeCompare(a.productName)
      );
      setOrder(copy);
    }
  };

  // 발주수량 정렬
  const sortQuantity = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) => a.quantity - b.quantity);
      setOrder(copy);
    }
  };
  const reverseSortQuantity = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted((a, b) => b.quantity - a.quantity);
      setOrder(copy);
    }
  };

  //납기일 정렬
  const sortEndDay = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted(
        (a, b) => new Date(a.endDay) - new Date(b.endDay)
      );
      setOrder(copy);
    }
  };
  const reverseSortEndDay = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      let copy = order.toSorted(
        (a, b) => new Date(b.endDay) - new Date(a.endDay)
      );
      setOrder(copy);
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
              <th>
                선택
                <input
                  type="checkbox"
                  name="allCheck"
                  id="allCheck"
                  onChange={() => {
                    checkAll();
                  }}
                  checked={allChecked === 1 && anyChecked === 1 ? true : false}
                />
              </th>
              <th>
                발주번호
                <button
                  onClick={() => {
                    sortOrderCode();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortOrderCode();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>
                발주일
                <button
                  onClick={() => {
                    sortStartDay();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortStartDay();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>
                긴급발주
                <button
                  onClick={() => {
                    sortEmergency();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortEmergency();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>
                고객사
                <button
                  onClick={() => {
                    sortCompany();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortCompany();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>
                품목코드
                <button
                  onClick={() => {
                    sortProductCode();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortProductCode();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>
                품목명
                <button
                  onClick={() => {
                    sortProductName();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortProductName();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>
                발주수량
                <button
                  onClick={() => {
                    sortQuantity();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortQuantity();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>
                납기일
                <button
                  onClick={() => {
                    sortEndDay();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortEndDay();
                  }}
                >
                  ▲
                </button>
              </th>
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
                        haveAnyChecked();
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
                    <button
                      onClick={() => {
                        modifyProduct(idx);
                      }}
                    >
                      수정
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="tail">
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
          {/* 상황에 따라 추가하기 버튼과 수정하기 버튼으로 바꾸기 */}
          {addState === -1 ? (
            <AddBtn addOrder={addOrder} setOrderCopy={setOrderCopy} />
          ) : (
            <AddModifyBtn
              addModify={addModify}
              setOrderCopy={setOrderCopy}
              addState={addState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const AddBtn = (props) => {
  return (
    <button
      id="addBtn"
      type="button"
      onClick={() => {
        props.addOrder();
        props.setOrderCopy({
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
  );
};

const AddModifyBtn = (props) => {
  return (
    <button
      type="button"
      onClick={() => {
        props.addModify(props.addState);
        props.setOrderCopy({
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
      수정완료
    </button>
  );
};

export default App;
