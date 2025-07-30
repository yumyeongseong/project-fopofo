// src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { nodeApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰을 확인하여 사용자 정보를 가져오는 로직
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      nodeApi.get('/users/me')
        .then(response => {
          setUser(response.data.user); // ✅ user 객체를 직접 저장하도록 수정
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // 로그인 시 호출할 함수
  const login = (userData) => {
    const { token, user } = userData;
    localStorage.setItem('token', token);
    setUser(user);
  };

  // 닉네임만 업데이트할 때 호출할 함수
  const updateUserNickname = (nickname) => {
    setUser(prevUser => ({
      ...prevUser,
      nickname: nickname
    }));
  };

  // 로그아웃 시 호출할 함수
  const logout = async () => {
    try {
      await nodeApi.post('/users/logout');
    } catch (error) {
      console.error("서버 로그아웃 실패:", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중 UI
  }

  return (
    // ✅ [기능] LoginPage에서 구글 로그인 후 user 상태를 직접 설정하기 위해 `setUser`를 추가
    <AuthContext.Provider value={{ user, setUser, login, updateUserNickname, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 인증 상태를 사용하기 위한 custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};