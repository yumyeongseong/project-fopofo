// src/contexts/AuthContext.jsx

// 👇 1. 여기에 useEffect를 추가해야 합니다.
import React, { createContext, useState, useContext, useEffect } from 'react';
import { nodeApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 👇 2. 페이지 로드 시 토큰으로 사용자 정보를 가져오는 로직입니다.
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // 백엔드의 "내 정보 조회" API를 호출합니다.
            nodeApi.get('/users/me')
                .then(response => {
                    // 성공 시, 전역 상태에 사용자 정보를 저장합니다.
                    setUser(response.data);
                })
                .catch(() => {
                    // 토큰이 유효하지 않으면 로그아웃 처리
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []); // 빈 배열을 전달하여 앱이 처음 시작될 때 한 번만 실행되도록 합니다.

    // 로그인 시 호출할 함수
    const login = (userData) => {
        const { token, user } = userData;
        localStorage.setItem('token', token);
        setUser(user);
    };
    
    // 닉네임만 업데이트할 때 호출할 함수
    const updateUserNickname = (nickname) => {
        setUser(prevUser => ({ ...prevUser, nickname }));
    };

    // 로그아웃 시 호출할 함수
    const logout = async () => {
        try {
            // 백엔드에 로그아웃 요청을 보냅니다.
            await nodeApi.post('/users/logout');
        } catch (error) {
            // 백엔드 요청 실패 시에도 클라이언트에서는 로그아웃 처리를 계속 진행합니다.
            console.error("서버 로그아웃 실패:", error);
        } finally {
            // 로컬 스토리지에서 토큰을 제거합니다.
            localStorage.removeItem('token');
            // 전역 user 상태를 null로 만들어 로그아웃 상태로 변경합니다.
            setUser(null);
        }
    };

    // 사용자 정보를 불러오는 동안에는 잠시 로딩 상태를 표시 (선택 사항)
    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return (
        <AuthContext.Provider value={{ user, login, updateUserNickname, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// 다른 컴포넌트에서 쉽게 user 정보를 꺼내 쓸 수 있게 해주는 custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};