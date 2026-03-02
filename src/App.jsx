// import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
// import { Modal } from 'bootstrap';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;
  // const apiPath = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    const initAuth = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken_week4\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );

      if (!token) return;

      axios.defaults.headers.common['Authorization'] = token;

      try {
        await axios.post(`${baseURL}/v2/api/user/check`);
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    initAuth();
  }, []);

  return <>{isAuth ? <ProductPage /> : <LoginPage setIsAuth={setIsAuth} />}</>;
}

export default App;
