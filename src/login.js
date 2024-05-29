import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  let navigate = useNavigate();

  // 로그인 인증 => 인증되면 로그인 페이지 접근 못하게
  const loginAuth = async () => {
    const result = await axios.get('/user');
    if (result.data.loginStatus === true) {
      navigate('/', { replace: true });
    }
  };
  useEffect(() => {
    loginAuth();
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const usernameChange = (e) => {
    setUsername(e.target.value);
  };

  const pwChange = (e) => {
    setPassword(e.target.value);
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_ADDRESS + '/login',
        { username: username, password: password }
      );
      props.setUser(response.data);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const loginProcess = async (e) => {
    //페이지 리로드 방지
    e.preventDefault();
    login(username, password);
  };
  return (
    <div className="login-container">
      <h1>Log in</h1>
      <form onSubmit={loginProcess} className="login-form">
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => usernameChange(e)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => pwChange(e)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default Login;
