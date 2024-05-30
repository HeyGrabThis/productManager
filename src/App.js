import { useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Main from './main';
import ProductManagement from './생산관리';
import FirstTeam from './teamPage/first_team';
import SecondTeam from './teamPage/second_team';
import ThirdTeam from './teamPage/third_team';
import ProductCodePage from './product_code_page';
import Login from './login';
import axios from 'axios';

function App() {
  let navigate = useNavigate();
  //유저정보
  let [user, setUser] = useState(null);
  //로그인 되어있는지 확인하는 함수 => 안돼있으면 로그인 페이지로 이동
  const auth = async () => {
    try {
      const result = await axios.get('/user');
      if (result.data.loginStatus !== true) {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      navigate('/login', { replace: true });
    }
  };
  return (
    <Routes>
      <Route
        path="/"
        element={<Main user={user} setUser={setUser} auth={auth} />}
      />
      <Route
        path="/productmanager"
        element={<ProductManagement auth={auth} />}
      />
      <Route path="/team1" element={<FirstTeam auth={auth} />} />
      <Route path="/team2" element={<SecondTeam auth={auth} />} />
      <Route path="/team3" element={<ThirdTeam auth={auth} />} />
      <Route path="/productcode" element={<ProductCodePage auth={auth} />} />
      <Route path="/login" element={<Login user={user} setUser={setUser} />} />
    </Routes>
  );
}

export default App;
