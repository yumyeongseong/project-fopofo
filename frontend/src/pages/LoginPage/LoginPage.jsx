import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { nodeApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';

function LoginPage() {
    const navigate = useNavigate();
    const { login, setUser } = useAuth();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const handleGoogleRedirect = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (token) {
                localStorage.setItem('token', token);
                try {
                    const response = await nodeApi.get('/api/users/me');
                    const userData = response.data;
                    setUser(userData);
                    alert('구글 로그인 성공!');
                    window.history.replaceState({}, document.title, window.location.pathname);
                    if (userData && userData.nickname) {
                        navigate('/home');
                    } else {
                        navigate('/home');
                    }
                } catch (error) {
                    console.error("사용자 정보 가져오기 실패:", error);
                    alert("로그인 처리 중 오류가 발생했습니다.");
                    navigate('/login');
                }
            }
        };
        handleGoogleRedirect();
    }, [navigate, setUser]);

    const handleLogin = async () => {
    try {
        const response = await nodeApi.post('/api/auth/login', { userId, password });
        
        // 👇 1. 응답 데이터에서 user와 token을 모두 추출합니다.
        const { user, token } = response.data;

        // 👇 2. 토큰이 있다면 localStorage에 저장합니다.
        if (token) {
            localStorage.setItem('token', token);
        }

        // 3. 나머지 로직을 실행합니다.
        login(response.data);
        alert('로그인 성공!');
        if (user && user.nickname) {
            navigate('/home');
        } else {
            navigate('/home');
        }
    } catch (err) {
        console.error('로그인 실패:', err.response?.data || err.message);
        alert(err.response?.data?.message || '아이디 또는 비밀번호를 확인해주세요.');
    }
};

    const handleLogoClick = () => {
        navigate('/mainpage');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <img
                src="/Fopofo-Logo-v2.png"
                alt="fopofo-logo"
                className="login-logo-img"
                onClick={handleLogoClick}
            />

            <div className="login-box">
                <input
                    type="text"
                    className="login-input id-input"
                    placeholder="ID: 아이디를 입력하세요"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    type="password"
                    className="login-input"
                    placeholder="PW: 비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLogin();
                        }
                    }}
                />

                <GoogleLoginButton />

                <p className="link-text" onClick={handleSignupClick} style={{ cursor: 'pointer' }}>
                    회원 가입
                </p>
            </div>

            <button className="login-button" onClick={handleLogin}>
                LOGIN
            </button>
        </div>
    );
}

export default LoginPage;