import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { CSVLink } from 'react-csv';

const SecondTeam = (props) => {
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

  //오늘 날짜로 돌아오는 함수
  const comebackToday = () => {
    setThisMonthYear({
      month: nowMonth,
      year: nowYear,
      date: todayDate,
      day: todayDay,
    });
    // 날짜 몇번 넘길지 저장하는 state도 초기화
    setDayCount(0);
  };

  // 날짜 몇번 플러스, 마이너스로 넘길지 저장하는 state
  let [dayCount, setDayCount] = useState(0);

  //날짜 다음날 변경 함수
  const changeDay = () => {
    let nextDay = new Date(nowDate);
    nextDay.setDate(nowDate.getDate() + dayCount);
    let nextYear = nextDay.getFullYear();
    let nextMonth = nextDay.getMonth() + 1;
    let nextDate = nextDay.getDate();
    let nextDayStr;
    switch (nextDay.getDay()) {
      case 0:
        nextDayStr = '일요일';
        break;
      case 1:
        nextDayStr = '월요일';
        break;
      case 2:
        nextDayStr = '화요일';
        break;
      case 3:
        nextDayStr = '수요일';
        break;
      case 4:
        nextDayStr = '목요일';
        break;
      case 5:
        nextDayStr = '금요일';
        break;
      case 6:
        nextDayStr = '토요일';
        break;
    }
    setThisMonthYear({
      month: nextMonth,
      year: nextYear,
      date: nextDate,
      day: nextDayStr,
    });
  };

  // dayCount를 버튼에 걸어두고 dayCount state가 변경될 때만 날짜변경 함수실행
  useEffect(() => {
    changeDay();
  }, [dayCount]);

  // product_code와 name,company 데이터를 담을 state
  let [product, setProduct] = useState([]);

  // getProductCode를 실행하고나서 서버에서 order데이터를 받아오기 위해 useEffect에 쓸 state 생성
  let [productDataState, setProductDataState] = useState(0);

  // productCode목록 서버에서 가져오기
  const getProductCode = async () => {
    try {
      let res = await axios.get(process.env.ADRESS + '/api/productcode');
      let copy = res.data.map((elm) => {
        return {
          productCode: elm.product_code,
          productName: elm.product_name,
          company: elm.company,
          id: elm.id,
        };
      });
      setProduct(copy);
      setProductDataState(productDataState + 1);
    } catch (err) {
      console.log(err);
    }
  };

  //order를 담아서 렌더링할 state생성
  let [order3, setOrder3] = useState([]);

  // 서버에서 order로 옮겨줌. 무슨 년도,달에 위치해있는지 확인하고 그에 맞는 데이터 가져오기
  const getServerOrderList = async () => {
    let thisMonthYearCopy =
      `${thisMonthYear.year}` +
      '-' +
      String(thisMonthYear.month).padStart(2, '0') +
      '-' +
      String(thisMonthYear.date).padStart(2, '0');

    try {
      let res = await axios.get(
        process.env.ADRESS + '/api/team2/' + thisMonthYearCopy
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
          product_complete_yn: Number(elm.product_complete_yn),
          shipment_complete_yn: Number(elm.shipment_complete_yn),
          //품목명과 회사 parsing
          productName: sameProduct.productName,
          company: sameProduct.company,
          //고유 id가져오기. 받아오는 것만 하고 보내는 건 하지않음
          orderId: elm.order_id,
        };
      });
      setOrder3(copy);
      setSortState(sortState + 1);
    } catch (err) {
      console.log(err);
    }
  };
  //마운트될 때와 날짜 바뀔 때 품목코드 데이터(product) 가져오기
  useEffect(() => {
    getProductCode();
  }, [thisMonthYear]);

  //productDataState 바뀔 때 리스트 데이터 불러오기
  useEffect(() => {
    getServerOrderList();
  }, [productDataState]);

  //생산완료 변경함수. 서버연결까지
  const changeProductComplete_yn = async (idx) => {
    if (order3[idx].product_complete_yn === 1) {
      let copy = [...order3];
      copy[idx].product_complete_yn = 0;
      setOrder3(copy);
    } else {
      let copy = [...order3];
      copy[idx].product_complete_yn = 1;
      setOrder3(copy);
    }
    try {
      await axios.put(
        process.env.ADRESS +
          '/api/product/update/product_complete_yn/' +
          order3[idx].orderId,
        {
          product_complete_yn: order3[idx].product_complete_yn,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //출하완료 변경함수. 서버연결까지
  const changeShipmentComplete_yn = async (idx) => {
    if (order3[idx].shipment_complete_yn === 1) {
      let copy = [...order3];
      copy[idx].shipment_complete_yn = 0;
      setOrder3(copy);
    } else {
      let copy = [...order3];
      copy[idx].shipment_complete_yn = 1;
      setOrder3(copy);
    }
    try {
      await axios.put(
        process.env.ADRESS +
          '/api/product/update/shipment_complete_yn/' +
          order3[idx].orderId,
        {
          shipment_complete_yn: order3[idx].shipment_complete_yn,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //특이사항 변경함수. 서버연결까지
  const changeSpecialNote_yn = async (idx) => {
    if (order3[idx].specialNote_yn === 1) {
      let copy = [...order3];
      copy[idx].specialNote_yn = 0;
      setOrder3(copy);
    } else {
      let copy = [...order3];
      copy[idx].specialNote_yn = 1;
      setOrder3(copy);
    }
    try {
      await axios.put(
        process.env.ADRESS +
          '/api/product/update/specialNote_yn/' +
          order3[idx].orderId,
        {
          special_note_yn: order3[idx].specialNote_yn,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //발주번호 정렬
  const sortOrderCode = () => {
    let copy = order3.toSorted(
      (a, b) => a.orderCode.replace('-', '') - b.orderCode.replace('-', '')
    );
    setOrder3(copy);
  };
  const reverseSortOrderCode = () => {
    let copy = order3.toSorted(
      (a, b) => b.orderCode.replace('-', '') - a.orderCode.replace('-', '')
    );
    setOrder3(copy);
  };

  // 품목코드 정렬
  const sortProductCode = () => {
    let copy = order3.toSorted((a, b) =>
      a.productCode.localeCompare(b.productCode)
    );
    setOrder3(copy);
  };
  const reverseSortProductCode = () => {
    let copy = order3.toSorted((a, b) =>
      b.productCode.localeCompare(a.productCode)
    );
    setOrder3(copy);
  };

  // 발주수량 정렬
  const sortQuantity = () => {
    let copy = order3.toSorted((a, b) => a.quantity - b.quantity);
    setOrder3(copy);
  };
  const reverseSortQuantity = () => {
    let copy = order3.toSorted((a, b) => b.quantity - a.quantity);
    setOrder3(copy);
  };

  //컬러 정렬
  const sortColor = () => {
    let copy = order3.toSorted((a, b) => a.color.localeCompare(b.color));
    setOrder3(copy);
  };
  const reverseSortColor = () => {
    let copy = order3.toSorted((a, b) => b.color.localeCompare(a.color));
    setOrder3(copy);
  };

  // 데이터를 받아오면 발주번호로 자동 정렬하도록 state생성
  let [sortState, setSortState] = useState(0);
  useEffect(() => {
    sortOrderCode();
  }, [sortState]);

  // excel로 export
  let excelHeaders = [
    { label: '발주번호', key: 'orderCode' },

    { label: '고객사', key: 'company' },
    { label: '품목코드', key: 'productCode' },
    { label: '품목명', key: 'productName' },
    { label: '발주수량', key: 'quantity' },
    { label: 'COLOR', key: 'color' },
    { label: '생산완료', key: 'product_complete_yn' },
    { label: '출하완료', key: 'shipment_complete_yn' },
    { label: '특이사항', key: 'specialNote_yn' },
  ];
  let [excelData, setExcelData] = useState([
    {
      orderCode: '',

      company: '',
      productCode: '',
      productName: '',
      quantity: '',
      color: '',
      product_complete_yn: '',
      shipment_complete_yn: '',
      specialNote_yn: '',
    },
  ]);
  // 목록을 돌며 excelData와 parsing
  const exportExcel = () => {
    let copy = order3.map((elm) => {
      return {
        orderCode: elm.orderCode,

        company: elm.company,
        productCode: elm.productCode,
        productName: elm.productName,
        quantity: elm.quantity,
        color: elm.color,
        product_complete_yn: elm.product_complete_yn === 1 ? '완료' : null,
        shipment_complete_yn: elm.shipment_complete_yn === 1 ? '완료' : null,
        specialNote_yn: elm.specialNote_yn === 1 ? '유' : '무',
      };
    });
    setExcelData(copy);
  };

  return (
    <div>
      <div className="teamTitle">
        <h1>2팀</h1>
        <div className="teamBtn">
          <button
            onClick={() => {
              getServerOrderList();
            }}
          >
            새로고침
          </button>
          <button
            onClick={() => {
              comebackToday();
            }}
          >
            오늘로 이동
          </button>
          <ExcelDownload
            excelData={excelData}
            excelHeaders={excelHeaders}
            exportExcel={exportExcel}
            thisMonthYear={thisMonthYear}
            className="excelBtn"
          ></ExcelDownload>
        </div>
      </div>
      <div className="teamMain">
        <div className="teamTable1">
          <table>
            <thead className="teamTable-thead">
              <tr>
                <th colSpan={10} className="teamTable-date">
                  <button
                    onClick={() => {
                      setDayCount(dayCount - 1);
                    }}
                  >
                    ◀︎
                  </button>
                  {thisMonthYear.year}년{' '}
                  {String(thisMonthYear.month).padStart(2, '0')}월{' '}
                  {String(thisMonthYear.date).padStart(2, '0')}일
                  <button
                    onClick={() => {
                      setDayCount(dayCount + 1);
                    }}
                  >
                    ▶︎
                  </button>
                </th>
              </tr>
              <tr>
                <th>NO.</th>
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
                <th>고객사</th>
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
                <th>품목명</th>
                <th>
                  수량
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
                  COLOR
                  <button
                    onClick={() => {
                      sortColor();
                    }}
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => {
                      reverseSortColor();
                    }}
                  >
                    ▲
                  </button>
                </th>
                <th>생산완료</th>
                <th>출하완료</th>
                <th>특이사항</th>
              </tr>
            </thead>
            <tbody className="teamTable-tbody">
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
                    <td>
                      완료
                      <input
                        type="checkbox"
                        name="product_complete_yn"
                        id="product_complete_yn"
                        onChange={() => {
                          changeProductComplete_yn(idx);
                        }}
                        checked={elm.product_complete_yn === 1 ? true : false}
                      />
                    </td>
                    <td>
                      완료
                      <input
                        type="checkbox"
                        name="shipment_complete_yn"
                        id="shipment_complete_yn"
                        onChange={() => {
                          changeShipmentComplete_yn(idx);
                        }}
                        checked={elm.shipment_complete_yn === 1 ? true : false}
                      />
                    </td>
                    <td>
                      유무
                      <input
                        type="checkbox"
                        name="specialNote_yn"
                        id="specialNote_yn"
                        onChange={() => {
                          changeSpecialNote_yn(idx);
                        }}
                        checked={elm.specialNote_yn === 1 ? true : false}
                      />
                    </td>
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

//엑셀 export위한 컴포넌트
const ExcelDownload = ({
  excelData,
  excelHeaders,
  exportExcel,
  thisMonthYear,
}) => {
  return (
    <button
      onClick={() => {
        exportExcel();
      }}
    >
      <CSVLink
        headers={excelHeaders}
        data={excelData}
        filename={
          thisMonthYear.year +
          '년' +
          thisMonthYear.month +
          '월' +
          thisMonthYear.date +
          '일 2팀 납기.csv'
        }
        target="_blank"
        className="excelBtn"
      >
        엑셀파일로 다운로드
      </CSVLink>
    </button>
  );
};

export default SecondTeam;
