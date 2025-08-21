// src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { nodeApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            nodeApi.get('/api/users/me')
                .then(response => {

                    setUser(response.data);
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

    const login = (userData) => {
        const { token, user } = userData;
        localStorage.setItem('token', token);
        setUser(user);
    };

    const updateUserNickname = (nickname) => {
        setUser(prevUser => ({
            ...prevUser, // ✅ 이전 user 객체의 모든 속성(userId, _id 등)을 그대로 복사하고
            nickname: nickname // ✅ nickname 속성만 새로 추가하거나 덮어씁니다.
        }));
    };

    const logout = async () => {
        try {
            await nodeApi.post('/api/users/logout');
        } catch (error) {
            console.error("서버 로그아웃 실패:", error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        // ✅ --- 수정 사항 2 (가장 중요) --- ✅
        // value 객체에 `setUser` 함수를 추가하여 다른 컴포넌트(LoginPage)에서 직접 사용할 수 있도록 합니다.
        <AuthContext.Provider value={{ user, setUser, login, updateUserNickname, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};