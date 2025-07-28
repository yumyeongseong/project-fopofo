import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/Users/lifeiscabaret/project-fopofo/frontend/src/pages/CreateUser/CreateUser.css';

function CreateUserPage() {
  const navigate = useNavigate();
  const [portfolioName, setPortfolioName] = useState('');

  const handleSubmit = () => {
    if (!portfolioName.trim()) return alert('포트폴리오 이름을 입력해주세요!');

    navigate('/intro-upload');
  };

  return (
    <div className="homepage-container">
      <div className="create-wrapper animate-fade-in">
        <img
          src="/images/fopofo-logo.png"
          alt="logo"
          className="nav-logo"
          onClick={() => navigate('/')}
        />

        <div className="noportfolio-top-buttons">
          <button className="outline-btn" onClick={() => navigate('/')}>logout</button>
          <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
        </div>

        <div className="create-center">
          <h1 className="create-title animate-fade-in delay-1">
            Let’s name your<br />portfolio!
          </h1>

          <div className="input-row animate-fade-in delay-2">
            <input
              type="text"
              className="portfolio-input"
              placeholder="포트폴리오 이름을 입력하세요."
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />

            <button className="set-name-btn" onClick={handleSubmit}>
              Set name
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUserPage;
