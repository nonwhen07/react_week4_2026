import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function LoginPage({ setIsAuth }) {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [account, setAccount] = useState({
    username: 'example@test.com',
    password: 'example',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // 登入表單 - 登入submit事件（使用 async/await）
  const handleLogin = async (e) => {
    e.preventDefault(); // 一定要最前面，避免後續程式碼執行後頁面刷新

    setErrorMessage('');

    if (!account.username || !account.password) {
      alert('請填寫完整登入資訊');
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/v2/admin/signin`, account);

      const { token, expired } = res.data;

      document.cookie = `hexToken_week4=${token}; path=/; expires=${new Date(
        expired,
      ).toUTCString()}`;

      axios.defaults.headers.common['Authorization'] = token;

      setIsAuth(true);
    } catch (error) {
      // alert(error.response?.data?.message || '登入失敗');
      setErrorMessage(error.response?.data?.message || '登入失敗');
    }
  };

  // 登入表單 - Input變動
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      {errorMessage && <div className="alert alert-danger w-100">{errorMessage}</div>}
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input
            id="username"
            name="username"
            type="email"
            value={account.username}
            onChange={handleInputChange}
            className="form-control"
            placeholder="example@test.com"
            required
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            id="password"
            name="password"
            type="password"
            value={account.password || ''}
            onChange={handleInputChange}
            className="form-control"
            placeholder="example"
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn btn-primary">
          登入
        </button>
      </form>
    </div>
  );
}

// === 新增 `propTypes` 驗證 ===
LoginPage.propTypes = {
  setIsAuth: PropTypes.func.isRequired, // 確保 `setIsAuth` 是函式
};

export default LoginPage;
