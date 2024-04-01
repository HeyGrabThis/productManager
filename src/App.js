import { useEffect, useState } from 'react';
import './App.css';
import product from './product';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import ProductManagement from './생산관리';
import axios from 'axios';
import FirstTeam from './teamPage/first_team';
import SecondTeam from './teamPage/second_team';
import ThirdTeam from './teamPage/third_team';

function App() {
  let navigate = useNavigate();
  const changeProductPage = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
      navigate('/productmanager');
    }
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
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
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
    }
  };
  const nextMonth = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
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
    }
  };
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
    etc2: '',
    color: '',
    team: '',
    orderSheetPublish: 0,
    orderSheetCollect: 0,
    report: 0,
    specialNote: '',
    specialNote_yn: 0,
    product_complete_yn: 0,
    shipment_complete_yn: 0,
  });
  // 발주 신규 추가하기. 바로 서버에 추가
  const addOrder = async () => {
    //날짜를 지정하지 않으면 (orderCode가 없는 경우)또는 품목코드가 없는 경우 추가 못하도록
    if (!orderCopy.startDay || !orderCopy.productCode) {
      alert('발주일과 품목코드를 입력해주세요');
    } else {
      let copy = [...order];
      // 그 달에 해당하는 데이터인지 판단해서 프론트에 보이는 것 조절
      let thisMonthYearCopy =
        `${thisMonthYear.year}`.slice(-2) +
        String(thisMonthYear.month).padStart(2, '0');
      // orderCode가 날짜와 같을 때만 화면에 보이게
      if (thisMonthYearCopy === orderCopy.orderCode.slice(0, 4)) {
        copy.push(orderCopy);
        setOrder(copy);
      }
      try {
        await axios.post('http://localhost:3001/api/product/insert', {
          color: '',
          emergency_yn: orderCopy.emergency,
          etc1: orderCopy.etc,
          etc2: '',
          order_code: orderCopy.orderCode,
          order_end_date: orderCopy.endDay,
          order_start_date: orderCopy.startDay,
          ordersheet_collect_yn: 0,
          ordersheet_publish_yn: 0,
          product_code: orderCopy.productCode,
          product_complete_yn: 0,
          product_quantity: orderCopy.quantity,
          product_team: '',
          report_yn: 0,
          shipment_complete_yn: 0,
          special_note: '',
          special_note_yn: '',
        });
      } catch (err) {
        console.log(err);
      }
    }
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

  // 발주일 입력함수. 발주일 입력하면 발주번호 자동으로 입력.납기일자도. + 발주일에 맞춰서 년도랑 달 강제이동
  const changeStartDay = async (value) => {
    let copy = { ...orderCopy };
    copy.startDay = value;

    // 발주일에 맞춰서 프론트 페이지 강제 이동(발주번호 자동적으로 늘어나게하기에도, 날짜 수정에도 용이)
    let valueYear = Number(
      `${value[0]}` + `${value[1]}` + `${value[2]}` + `${value[3]}`
    );
    let valueMonth = Number(`${value[5]}` + `${value[6]}`);

    //입력한 년도나 달이 지금 보이는 년도나 달과 다를경우 value값으로 년도와 달 이동
    if (
      valueYear !== thisMonthYear.year ||
      valueMonth !== thisMonthYear.month
    ) {
      let copyMonthYear = { ...thisMonthYear };
      copyMonthYear.year = valueYear;
      copyMonthYear.month = valueMonth;
      setThisMonthYear(copyMonthYear);
      // 입력한 년도나 달이 지금 보이는 년도나 달과 다를경우인데 이미 똑같은 날짜에 발주가 있다면
      // 뒤 넘버링하기 위해 서버와 값 비교
      try {
        //서버에서 년도,달,날짜 같은 ordercode리스트 가져오기
        const sameDateList = await axios.get(
          'http://localhost:3001/api/product/' +
            `${value[2]}` +
            `${value[3]}` +
            `${value[5]}` +
            `${value[6]}` +
            `${value[8]}` +
            `${value[9]}`
        );
        //그것들 중 뒤에 넘버링한 수만 숫자배열로 담기
        const sameDateListNum = sameDateList.data.map((elm, idx) => {
          return Number(elm.order_code[7] + elm.order_code[8]);
        });
        // return Number(`${elm.order_code[8]}` + `${elm.order_code[9]}`);
        //넘버링 수 중에 가장 큰 수
        const mostBigNum = sameDateListNum.sort((a, b) => b - a);
        // 그 수가 있다면 하나 더 큰 수로 넘버링해서 orderCode입력
        if (mostBigNum[0]) {
          copy.orderCode =
            `${value[2]}` +
            `${value[3]}` +
            `${value[5]}` +
            `${value[6]}` +
            `${value[8]}` +
            `${value[9]}` +
            `-` +
            String(mostBigNum[0] + 1).padStart(2, '0');
        } else {
          copy.orderCode =
            `${value[2]}` +
            `${value[3]}` +
            `${value[5]}` +
            `${value[6]}` +
            `${value[8]}` +
            `${value[9]}` +
            `-` +
            `01`;
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      // 입력한 년도나 달이 지금 보이는 년도나 달과 같은경우
      // 입력값에서 앞의 6자리 따오기
      let orderCodeDate =
        `${value[2]}` +
        `${value[3]}` +
        `${value[5]}` +
        `${value[6]}` +
        `${value[8]}` +
        `${value[9]}`;
      // orderCode목록에서 앞의 6글자 겹치는 것 있는지 확인하고 있으면 뒤의 두글자 숫자배열로 반환
      let sameOrderCodeDateArray = order.map((elm) => {
        if (elm.orderCode.substring(0, 6) === orderCodeDate) {
          return Number(elm.orderCode.substring(7, 9));
        }
      });
      // 뒤의 두 숫자 배열 내림차순으로 정렬
      let sameOrderCodeTopId = sameOrderCodeDateArray.sort((a, b) => b - a);

      // 내림차순으로 정렬한 숫자중 가장 앞의 큰값 있는지 확인
      // 있다면 +1해서 적용, 없다면 그냥 01로
      if (sameOrderCodeTopId[0]) {
        copy.orderCode =
          `${value[2]}` +
          `${value[3]}` +
          `${value[5]}` +
          `${value[6]}` +
          `${value[8]}` +
          `${value[9]}` +
          `-` +
          `${String(sameOrderCodeTopId[0] + 1).padStart(2, '0')}`;
      } else {
        copy.orderCode =
          `${value[2]}` +
          `${value[3]}` +
          `${value[5]}` +
          `${value[6]}` +
          `${value[8]}` +
          `${value[9]}` +
          `-` +
          `01`;
      }
    }

    // 납기일 자동 설정
    const startDayCopy = new Date(value);
    let endDayCopy = new Date(startDayCopy);
    endDayCopy.setDate(startDayCopy.getDate() + 9);
    copy.endDay =
      endDayCopy.getFullYear() +
      '-' +
      String(endDayCopy.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(endDayCopy.getDate()).padStart(2, '0');
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

  // 품목코드 입력함수. 품목명과 회사명까지
  const changeProductCode = (value) => {
    let copy = { ...orderCopy };
    copy.productCode = value;
    //product 변수돌면서 같은 품목코드 있는지. 있다면 이름과 회사명을 값에 저장. 다르다면 이름과 회사명 빈값
    let sameProduct = product.find((elm) => value === elm.productCode);
    if (sameProduct) {
      copy.productName = sameProduct.productName;
      copy.company = sameProduct.company;
    } else {
      copy.productName = '';
      copy.company = '';
    }
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

  //삭제버튼 누르면 선택한 항목 삭제하기. 서버에 있는 항목도 id로 삭제하기
  const deleteOrder = () => {
    if (addState !== -1) {
      alert('수정을 완료해주세요');
    } else {
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
          //체크된 것들 아이디 반환
          let copy3 = copy.filter((elm) => {
            if (elm.checked === 1) {
              return elm;
            }
          });
          console.log(copy3);
          copy3.map(async (elm) => {
            try {
              await axios.delete(
                'http://localhost:3001/api/product/del/' + elm.orderId
              );
            } catch (err) {
              console.log(err);
            }
          });
        }
      }
    }
  };

  // 리스트에 있는 긴급발주 checkbox로 긴급발주 state수정 및 서버통해 db도 수정
  const changeListEmergency = async (idx) => {
    if (order[idx].emergency === 1) {
      let copy = [...order];
      copy[idx].emergency = 0;
      setOrder(copy);
    } else {
      let copy = [...order];
      copy[idx].emergency = 1;
      setOrder(copy);
    }
    try {
      await axios.put(
        'http://localhost:3001/api/product/update/list/' + order[idx].orderId,
        {
          emergency_yn: order[idx].emergency,
        }
      );
    } catch (err) {
      console.log(err);
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

  // 수정완료한 값들 다시 원래 배열에 넣기. 서버에도 적용
  const addModify = async (idx) => {
    //날짜를 지정하지 않으면 (orderCode가 없는 경우)또는 품목코드가 없는 경우 추가 못하도록
    if (!orderCopy.startDay || !orderCopy.productCode) {
      alert('발주일과 품목코드를 입력해주세요');
      setAddState(-1);
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
        etc2: '',
        color: '',
        team: '',
        orderSheetPublish: 0,
        orderSheetCollect: 0,
        report: 0,
        specialNote: '',
        specialNote_yn: 0,
        product_complete_yn: 0,
        shipment_complete_yn: 0,
      });
    } else {
      let copy = [...order];
      // 그 달에 해당하는 데이터인지 판단해서 프론트에 보이는 것 조절
      let thisMonthYearCopy =
        `${thisMonthYear.year}`.slice(-2) +
        String(thisMonthYear.month).padStart(2, '0');
      // orderCode가 날짜와 같으면 화면에 보이게
      if (thisMonthYearCopy === orderCopy.orderCode.slice(0, 4)) {
        copy[idx] = orderCopy;
        setOrder(copy);
      }
      // 버튼 '추가하기'로 바꿔야하고 ui state 수정
      setAddState(-1);

      // 서버 update
      try {
        await axios.put(
          'http://localhost:3001/api/product/update/' + orderCopy.orderId,
          {
            emergency_yn: orderCopy.emergency,
            etc1: orderCopy.etc,
            order_code: orderCopy.orderCode,
            order_end_date: orderCopy.endDay,
            order_start_date: orderCopy.startDay,
            product_code: orderCopy.productCode,
            product_quantity: orderCopy.quantity,
          }
        );
      } catch (err) {
        console.log(err);
      }
      //다시 불러옴으로써 프론트상 리스트가 꼬이는 문제해결
      getServerOrderList();
    }
  };

  // 발주번호 정렬
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

  // 서버에서 order로 옮겨줌. 무슨 년도,달에 위치해있는지 확인하고 그에 맞는 데이터 가져오기
  const getServerOrderList = async () => {
    let thisMonthYearCopy =
      `${thisMonthYear.year}`.slice(-2) +
      String(thisMonthYear.month).padStart(2, '0');
    try {
      let res = await axios.get(
        'http://localhost:3001/api/product/' + thisMonthYearCopy
      );
      let copy = res.data.map((elm, idx) => {
        //품목코드 조회해서 품목명과 회사 저장
        let product_codeValue = elm.product_code;
        let sameProduct = product.find(
          (elm) => product_codeValue === elm.productCode
        );
        return {
          checked: 0,
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
          product_complete_yn: Number(elm.product_complete_yn),
          shipment_complete_yn: Number(elm.shipment_complete_yn),
          //품목명과 회사 parsing
          productName: sameProduct.productName,
          company: sameProduct.company,
          //고유 id가져오기. 받아오는 것만 하고 보내는 건 하지않음
          orderId: elm.order_id,
        };
      });
      setOrder(copy);
    } catch (err) {
      console.log(err);
    }
  };
  // 페이지가 로드되거나 thisMonthYear의 값이 바뀌면 서버에서 데이터 받아오는 함수 실행
  useEffect(() => {
    getServerOrderList();
  }, [thisMonthYear]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <div className="scroll">
              <div className="header">
                <h1 id="title">
                  <button
                    onClick={() => {
                      preMonth();
                    }}
                  >
                    ◀︎
                  </button>
                  {thisMonthYear.year}년{' '}
                  {String(thisMonthYear.month).padStart(2, '0')}월 발주 관리
                  <button
                    onClick={() => {
                      nextMonth();
                    }}
                  >
                    ▶︎
                  </button>
                </h1>
                <div>
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
                    onClick={() => {
                      changeProductPage();
                    }}
                  >
                    생산관리로 이동
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
                          checked={
                            allChecked === 1 && anyChecked === 1 ? true : false
                          }
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
                      <th className="emergency-check">긴급</th>
                      <th className="modifyBtn-border"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {order
                      ? order.map((elm, idx) => {
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
                              <td>
                                <input
                                  type="checkbox"
                                  name="emergencyCheck"
                                  id="emergencyCheck"
                                  onChange={() => {
                                    changeListEmergency(idx);
                                  }}
                                  checked={
                                    order[idx].emergency === 1 ? true : false
                                  }
                                />
                              </td>
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
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="tail">
              <div className="inputPart">
                <table>
                  <thead>
                    <tr>
                      <th className="orderCodeInput">발주번호</th>
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
                      <td className="orderCodeInput">
                        <div>{orderCopy.orderCode}</div>
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
                        <div className="companyInput">{orderCopy.company}</div>
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
                        <div className="productNameInput">
                          {orderCopy.productName}
                        </div>
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
                  <>
                    <CancelBtn
                      setAddState={setAddState}
                      setOrderCopy={setOrderCopy}
                    />
                    <AddModifyBtn
                      addModify={addModify}
                      setOrderCopy={setOrderCopy}
                      addState={addState}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        }
      ></Route>
      <Route path="/productmanager" element={<ProductManagement />}></Route>
      <Route path="/team1" element={<FirstTeam />}></Route>
      <Route path="/team2" element={<SecondTeam />}></Route>
      <Route path="/team3" element={<ThirdTeam />}></Route>
    </Routes>
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
          etc2: '',
          color: '',
          team: '',
          orderSheetPublish: 0,
          orderSheetCollect: 0,
          report: 0,
          specialNote: '',
          specialNote_yn: 0,
          product_complete_yn: 0,
          shipment_complete_yn: 0,
        });
      }}
    >
      추가하기
    </button>
  );
};

const CancelBtn = (props) => {
  return (
    <button
      type="button"
      onClick={() => {
        props.setAddState(-1);
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
          etc2: '',
          color: '',
          team: '',
          orderSheetPublish: 0,
          orderSheetCollect: 0,
          report: 0,
          specialNote: '',
          specialNote_yn: 0,
          product_complete_yn: 0,
          shipment_complete_yn: 0,
        });
      }}
    >
      취소
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
          etc2: '',
          color: '',
          team: '',
          orderSheetPublish: 0,
          orderSheetCollect: 0,
          report: 0,
          specialNote: '',
          specialNote_yn: 0,
          product_complete_yn: 0,
          shipment_complete_yn: 0,
        });
      }}
    >
      수정완료
    </button>
  );
};

export default App;
