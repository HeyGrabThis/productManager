import axios from 'axios';
import { useEffect, useState } from 'react';

const ProductCodePage = () => {
  //product_code table에서 목록 가져올 state생성
  let [productCodeList, setProductCodeList] = useState([]);
  // product_code table에서 데이터 가져오기
  const getProductCodeData = async () => {
    try {
      let res = await axios.get(process.env.ADRESS + '/api/productcode');
      const copy = res.data.map((elm) => {
        return {
          checked: 0,
          productCode: elm.product_code,
          productName: elm.product_name,
          company: elm.company,
          id: elm.id,
        };
      });
      setProductCodeList(copy);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProductCodeData();
  }, []);

  //input 값을 잠시 담아둘 state생성
  let [productCodeInput, setProductCodeInput] = useState({
    checked: 0,
    productCode: '',
    productName: '',
    company: '',
  });

  // 품목코드 입력하면 input state에 담아두기
  const writeProductCode = (value) => {
    let copy = { ...productCodeInput };
    copy.productCode = value;
    setProductCodeInput(copy);
  };

  // 회사명 입력하면 input state에 담아두기
  const writeCompany = (value) => {
    let copy = { ...productCodeInput };
    copy.company = value;
    setProductCodeInput(copy);
  };

  // 품목명 입력하면 input state에 담아두기
  const writeProductName = (value) => {
    let copy = { ...productCodeInput };
    copy.productName = value;
    setProductCodeInput(copy);
  };

  //add버튼으로 목록으로 추가 및 db에도 추가
  const addProductCode = async () => {
    if (
      productCodeInput.productCode === '' ||
      productCodeInput.company === '' ||
      productCodeInput.productName === ''
    ) {
      alert('내용을 모두 입력해주세요');
    } else {
      let copy = [...productCodeList];
      copy.push(productCodeInput);
      setProductCodeList(copy);

      try {
        await axios.post(process.env.ADRESS + '/api/productcode/insert', {
          product_code: productCodeInput.productCode,
          company: productCodeInput.company,
          product_name: productCodeInput.productName,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  //사용중인 품목코드 저장할 변수
  let sameProductCode;
  //리스트에서 삭제하기. db에서도
  const deleteList = async (idx) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      //똑같은 품목코드 사용중인지 서버에서 데이터 가져와서 확인
      try {
        sameProductCode = await axios.get(
          process.env.ADRESS +
            '/api/product/code/' +
            productCodeList[idx].productCode
        );
      } catch (err) {
        console.log(err);
      }
      // 이미 사용중인 발주목록이 하나라도 있다면
      if (sameProductCode.data[0]) {
        alert('이미 사용중인 발주목록이 존재합니다');
      } else {
        let copy = [...productCodeList];
        copy.splice(idx, 1);
        try {
          await axios.delete(
            process.env.ADRESS +
              '/api/productcode/del/' +
              productCodeList[idx].id
          );
        } catch (err) {
          console.log(err);
        }
        setProductCodeList(copy);
      }
    }
  };

  //정렬하기
  // 품목코드 정렬
  const sortProductCode = () => {
    let copy = productCodeList.toSorted((a, b) =>
      a.productCode.localeCompare(b.productCode)
    );
    setProductCodeList(copy);
  };
  const reverseSortProductCode = () => {
    let copy = productCodeList.toSorted((a, b) =>
      b.productCode.localeCompare(a.productCode)
    );
    setProductCodeList(copy);
  };

  //회사명 정렬
  const sortCompany = () => {
    let copy = productCodeList.toSorted((a, b) =>
      a.company.localeCompare(b.company)
    );
    setProductCodeList(copy);
  };
  const reverseSortCompany = () => {
    let copy = productCodeList.toSorted((a, b) =>
      b.company.localeCompare(a.company)
    );
    setProductCodeList(copy);
  };

  //품목명 정렬
  const sortProductName = () => {
    let copy = productCodeList.toSorted((a, b) =>
      a.productName.localeCompare(b.productName)
    );
    setProductCodeList(copy);
  };
  const reverseSortProductName = () => {
    let copy = productCodeList.toSorted((a, b) =>
      b.productName.localeCompare(a.productName)
    );
    setProductCodeList(copy);
  };
  return (
    <div>
      <div className="code-topPage">
        <div className="code-head">
          <h2>품목코드정보</h2>
        </div>
        <div className="code-main">
          <table>
            <thead>
              <tr>
                <th>NO.</th>
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
                  회사명
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
                <th className="code-delTh"></th>
              </tr>
            </thead>
            <tbody>
              {productCodeList.map((elm, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{elm.productCode}</td>
                    <td>{elm.company}</td>
                    <td>{elm.productName}</td>
                    <td className="code-delTd">
                      <button
                        onClick={() => {
                          deleteList(idx);
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="code-tail">
        <div className="code-inputzone">
          <table>
            <thead>
              <tr>
                <th>품목코드</th>
                <th>회사명</th>
                <th>품목명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    className="code-productCodeInput"
                    placeholder="품목코드를 입력해주세요"
                    onChange={(e) => {
                      writeProductCode(e.target.value);
                    }}
                    value={productCodeInput.productCode}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="code-companyInput"
                    placeholder="회사명을 입력해주세요"
                    onChange={(e) => {
                      writeCompany(e.target.value);
                    }}
                    value={productCodeInput.company}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="code-productNameInput"
                    placeholder="품목명을 입력해주세요"
                    onChange={(e) => {
                      writeProductName(e.target.value);
                    }}
                    value={productCodeInput.productName}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          className="code-addBtn"
          onClick={() => {
            addProductCode();
            setProductCodeInput({
              checked: 0,
              productCode: '',
              productName: '',
              company: '',
            });
          }}
        >
          추가하기
        </button>
      </div>
    </div>
  );
};
export default ProductCodePage;
