import { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './App.css';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';

import axios from 'axios';
import { CSVLink } from 'react-csv';

const ProductManagement = (props) => {
  let navigate = useNavigate();
  const changeMainPage = () => {
    navigate('/');
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

  //드롭다운.컬러. 서버연결까지
  const colorOptions = ['빨강', '파랑', '노랑'];
  const changeColor = async (value, idx) => {
    let copy = [...order2];
    copy[idx].color = value;
    setOrder2(copy);
    try {
      await axios.put(
        process.env.ADRESS + '/api/product/update/color/' + copy[idx].orderId,
        {
          color: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //드롭다운.생산팀. 서버연결까지
  const teamOptions = ['1팀', '2팀', '3팀'];
  const changeTeam = async (value, idx) => {
    let copy = [...order2];
    copy[idx].team = value;
    setOrder2(copy);
    try {
      await axios.put(
        process.env.ADRESS + '/api/product/update/team/' + copy[idx].orderId,
        {
          product_team: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //orderSheet발행완료 입력함수. 서버연결까지
  const changeSheetPublish = async (idx) => {
    let copy = [...order2];
    if (order2[idx].orderSheetPublish === 0) {
      copy[idx].orderSheetPublish += 1;
    } else {
      copy[idx].orderSheetPublish -= 1;
    }
    setOrder2(copy);
    try {
      await axios.put(
        process.env.ADRESS +
          '/api/product/update/orderSheetPublish/' +
          copy[idx].orderId,
        {
          ordersheet_publish_yn: copy[idx].orderSheetPublish,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //orderSheet회수완료 입력함수. 서버연결까지
  const changeSheetCollect = async (idx) => {
    let copy = [...order2];
    if (order2[idx].orderSheetCollect === 0) {
      copy[idx].orderSheetCollect += 1;
    } else {
      copy[idx].orderSheetCollect -= 1;
    }
    setOrder2(copy);
    try {
      await axios.put(
        process.env.ADRESS +
          '/api/product/update/orderSheetCollect/' +
          copy[idx].orderId,
        {
          ordersheet_collect_yn: copy[idx].orderSheetCollect,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //성적서 발행 입력함수. 서버연결까지
  const changeReport = async (idx) => {
    let copy = [...order2];
    if (order2[idx].report === 0) {
      copy[idx].report += 1;
    } else {
      copy[idx].report -= 1;
    }
    setOrder2(copy);
    try {
      await axios.put(
        process.env.ADRESS + '/api/product/update/report/' + copy[idx].orderId,
        {
          report_yn: copy[idx].report,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //특이사항 입력함수. 서버연결까지
  const changeSpecialNote = async (value, idx) => {
    let copy = [...order2];
    copy[idx].specialNote = value;
    setOrder2(copy);
    try {
      await axios.put(
        process.env.ADRESS +
          '/api/product/update/specialNote/' +
          copy[idx].orderId,
        {
          special_note: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //비고 입력함수. 서버연결까지
  const changeEtc2 = async (value, idx) => {
    let copy = [...order2];
    copy[idx].etc2 = value;
    setOrder2(copy);
    try {
      await axios.put(
        process.env.ADRESS + '/api/product/update/etc2/' + copy[idx].orderId,
        {
          etc2: value,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 나중에 order 서버에서 받아와서 order2 생성
  let [order2, setOrder2] = useState([]);

  //서버에서 데이터 받아오기
  const getServerOrderList2 = async () => {
    //품목코드 데이터가 있을 때만 실행
    if (product[0]) {
      let thisMonthYearCopy =
        `${thisMonthYear.year}`.slice(-2) +
        String(thisMonthYear.month).padStart(2, '0');
      try {
        let res = await axios.get(
          process.env.ADRESS + '/api/product/' + thisMonthYearCopy
        );
        //parsing작업
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
            //id 받아오기
            orderId: elm.order_id,
          };
        });
        setOrder2(copy);
        setSortState(sortState + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  //thisMonthYear바뀔때마다,mount될 때 서버에서 품목코드 데이터 받아오기
  useEffect(() => {
    getProductCode();
  }, [thisMonthYear]);
  //productDataState가 변경될 때(서버에서 품목코드 데이터를 받아온 후) 서버에서 리스트 데이터 받아오기
  useEffect(() => {
    getServerOrderList2();
  }, [productDataState]);

  //정렬
  // 발주번호 정렬
  const sortOrderCode = () => {
    let copy = order2.toSorted(
      (a, b) => a.orderCode.replace('-', '') - b.orderCode.replace('-', '')
    );
    setOrder2(copy);
  };
  const reverseSortOrderCode = () => {
    let copy = order2.toSorted(
      (a, b) => b.orderCode.replace('-', '') - a.orderCode.replace('-', '')
    );
    setOrder2(copy);
  };

  // 긴급발주 정렬
  const sortEmergency = () => {
    let copy = order2.toSorted((a, b) => b.emergency - a.emergency);
    setOrder2(copy);
  };
  const reverseSortEmergency = () => {
    let copy = order2.toSorted((a, b) => a.emergency - b.emergency);
    setOrder2(copy);
  };

  // 품목코드 정렬
  const sortProductCode = () => {
    let copy = order2.toSorted((a, b) =>
      a.productCode.localeCompare(b.productCode)
    );
    setOrder2(copy);
  };
  const reverseSortProductCode = () => {
    let copy = order2.toSorted((a, b) =>
      b.productCode.localeCompare(a.productCode)
    );
    setOrder2(copy);
  };

  // 발주수량 정렬
  const sortQuantity = () => {
    let copy = order2.toSorted((a, b) => a.quantity - b.quantity);
    setOrder2(copy);
  };
  const reverseSortQuantity = () => {
    let copy = order2.toSorted((a, b) => b.quantity - a.quantity);
    setOrder2(copy);
  };

  //납기일 정렬
  const sortEndDay = () => {
    let copy = order2.toSorted(
      (a, b) => new Date(a.endDay) - new Date(b.endDay)
    );
    setOrder2(copy);
  };
  const reverseSortEndDay = () => {
    let copy = order2.toSorted(
      (a, b) => new Date(b.endDay) - new Date(a.endDay)
    );
    setOrder2(copy);
  };

  //컬러 정렬
  const sortColor = () => {
    let copy = order2.toSorted((a, b) => a.color.localeCompare(b.color));
    setOrder2(copy);
  };
  const reverseSortColor = () => {
    let copy = order2.toSorted((a, b) => b.color.localeCompare(a.color));
    setOrder2(copy);
  };

  //팀 정렬
  const sortTeam = () => {
    let copy = order2.toSorted((a, b) => a.team.localeCompare(b.team));
    setOrder2(copy);
  };
  const reverseSortTeam = () => {
    let copy = order2.toSorted((a, b) => b.team.localeCompare(a.team));
    setOrder2(copy);
  };

  // 데이터를 받아오면 발주번호로 자동 정렬하도록 state생성
  let [sortState, setSortState] = useState(0);
  useEffect(() => {
    sortOrderCode();
  }, [sortState]);

  // excel로 export
  let excelHeaders = [
    { label: '발주번호', key: 'orderCode' },
    { label: '긴급발주', key: 'emergency' },
    { label: '고객사', key: 'company' },
    { label: '품목코드', key: 'productCode' },
    { label: '품목명', key: 'productName' },
    { label: '발주수량', key: 'quantity' },
    { label: 'COLOR', key: 'color' },
    { label: '발주일', key: 'startDay' },
    { label: '납기일', key: 'endDay' },
    { label: '생산팀', key: 'team' },
    { label: 'Order Sheet 발행', key: 'orderSheetPublish' },
    { label: 'Order Sheet 회수', key: 'orderSheetCollect' },
    { label: '성적서 발행', key: 'report' },
    { label: '특이사항', key: 'specialNote' },
    { label: '비고', key: 'etc2' },
  ];
  let [excelData, setExcelData] = useState([
    {
      orderCode: '',
      emergency: '',
      company: '',
      productCode: '',
      productName: '',
      quantity: '',
      color: '',
      startDay: '',
      endDay: '',
      team: '',
      orderSheetPublish: '',
      orderSheetCollect: '',
      report: '',
      specialNote: '',
      etc2: '',
    },
  ]);
  // 목록을 돌며 excelData와 parsing
  const exportExcel = () => {
    let copy = order2.map((elm) => {
      return {
        orderCode: elm.orderCode,
        emergency: elm.emergency === 1 ? '긴급' : null,
        company: elm.company,
        productCode: elm.productCode,
        productName: elm.productName,
        quantity: elm.quantity,
        color: elm.color,
        startDay: elm.startDay,
        endDay: elm.endDay,
        team: elm.team,
        orderSheetPublish: elm.orderSheetPublish === 1 ? '발행완료' : null,
        orderSheetCollect: elm.orderSheetCollect === 1 ? '회수완료' : null,
        report: elm.report === 1 ? '발행완료' : null,
        specialNote: elm.specialNote,
        etc2: elm.etc2,
      };
    });
    setExcelData(copy);
  };

  return (
    <div>
      <div className="title">
        <h3>
          <button
            onClick={() => {
              preMonth();
            }}
          >
            ◀︎
          </button>
          {thisMonthYear.year}년 {String(thisMonthYear.month).padStart(2, '0')}
          월 생산계획 관리
          <button
            onClick={() => {
              nextMonth();
            }}
          >
            ▶︎
          </button>
        </h3>
        <div className="product-btn">
          <button
            className="product-loadBtn"
            onClick={() => {
              getServerOrderList2();
            }}
          >
            불러오기
          </button>
          <button
            onClick={() => {
              changeMainPage();
            }}
          >
            발주관리로 이동
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
      <div className="product-main">
        <table>
          <thead className="product-thead">
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
              <th>
                긴급
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
              <th>발주일자</th>
              <th>
                납기일자
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
              <th>
                생산팀
                <button
                  onClick={() => {
                    sortTeam();
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    reverseSortTeam();
                  }}
                >
                  ▲
                </button>
              </th>
              <th>Order Sheet 발행</th>
              <th>Order Sheet 회수</th>
              <th>성적서 발행</th>
              <th>특이사항</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody className="product-list">
            {order2
              ? order2.map((elm, idx) => {
                  return (
                    <tr
                      key={idx}
                      style={
                        order2[idx].emergency === 1
                          ? { background: '#ffb49c' }
                          : { background: 'white' }
                      }
                    >
                      <td>{idx + 1}</td>
                      <td>{elm.orderCode}</td>
                      <td>{elm.emergency === 1 ? '✔️' : ''}</td>
                      <td>{elm.company}</td>
                      <td>{elm.productCode}</td>
                      <td>{elm.productName}</td>
                      <td>{elm.quantity}</td>
                      <td>
                        <Dropdown
                          options={colorOptions}
                          onChange={(e) => {
                            changeColor(e.value, idx);
                          }}
                          value={elm.color ? elm.color : '선택'}
                        />
                      </td>
                      <td>{elm.startDay}</td>
                      <td>{elm.endDay}</td>
                      <td>
                        <Dropdown
                          options={teamOptions}
                          onChange={(e) => {
                            changeTeam(e.value, idx);
                          }}
                          value={elm.team ? elm.team : '선택'}
                        />
                      </td>
                      <td>
                        발행완료
                        <input
                          type="checkbox"
                          name="orderSheetPublish"
                          id="orderSheetPublish"
                          onChange={() => {
                            changeSheetPublish(idx);
                          }}
                          checked={elm.orderSheetPublish === 1 ? true : false}
                        />
                      </td>
                      <td>
                        회수완료
                        <input
                          type="checkbox"
                          name="orderSheetCollect"
                          id="orderSheetCollect"
                          onChange={() => {
                            changeSheetCollect(idx);
                          }}
                          checked={elm.orderSheetCollect === 1 ? true : false}
                        />
                      </td>
                      <td>
                        발행완료
                        <input
                          type="checkbox"
                          name="report"
                          id="report"
                          onChange={() => {
                            changeReport(idx);
                          }}
                          checked={elm.report === 1 ? true : false}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          onChange={(e) => {
                            changeSpecialNote(e.target.value, idx);
                          }}
                          value={elm.specialNote}
                        />
                      </td>
                      <td>
                        <textarea
                          name="etc2"
                          id="etc2"
                          cols="20"
                          rows="2"
                          onChange={(e) => {
                            changeEtc2(e.target.value, idx);
                          }}
                          value={elm.etc2}
                        ></textarea>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
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
          thisMonthYear.year + '년' + thisMonthYear.month + '월 생산계획.csv'
        }
        target="_blank"
        className="excelBtn"
      >
        엑셀파일로 다운로드
      </CSVLink>
    </button>
  );
};

export default ProductManagement;
