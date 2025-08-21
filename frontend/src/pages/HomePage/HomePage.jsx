import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroFourStrips from "../../components/HeroFourStrips/HeroFourStrips"; // HeroFourStrips 컴포넌트 가져오기
import { useAuth } from "../../contexts/AuthContext"; // ✅ 1. AuthContext 가져오기
import "./HomePage.css";

// --- 상수 및 데이터 설정 ---
const PUB = process.env.PUBLIC_URL || "";
const PAGES = [
  { id: 1, bg: `${PUB}/Start.png`, title: "My Web Portfolio", desc: "한 장의 링크로 완성되는 나만의 웹 포트폴리오.", align: "left" },
  { id: 2, bg: `${PUB}/myStart.png`, title: "자기소개서도 웹으로", desc: "PDF 업로드만으로 자동 생성. 테마·폰트·이미지 자유 커스터마이징.", align: "center" },
  { id: 3, bg: `${PUB}/Portfolio.png`, title: "전시하듯 보여주는 갤러리", desc: "이미지·영상·문서 업로드와 카테고리 정리까지 한 번에.", align: "right" },
  { id: 4, bg: `${PUB}/Chatbot.png`, title: "GPT 기반 Q/A 챗봇", desc: "자기소개서·이력서·프롬프트를 기반으로 면접관에게 사용자를 진정성 있게 설명해줍니다.", align: "left" },
];

// --- Framer Motion 애니메이션 설정 ---
const sectionFade = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 0.6, ease: [0.22, 0.8, 0.2, 1] },
  viewport: { once: false, amount: 0.35 },
};
const cardSweep = {
  initial: { opacity: 0, y: 22, scaleX: 0.9, filter: "blur(6px)", transformOrigin: "50% 50%" },
  whileInView: { opacity: 1, y: 0, scaleX: 1, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: [0.22, 0.8, 0.2, 1] },
  viewport: { once: false, amount: 0.55 },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ 2. 로그인된 user 정보와 logout 함수 가져오기
  const [showNav, setShowNav] = useState(false);
  const containerRef = useRef(null);
  const lastRef = useRef(null);

  // ✅ 3. 'portfolio' 버튼의 조건부 이동 로직 구현
  const goToPortfolio = () => {
    const hasPortfolio = user && user.nickname;
    if (hasPortfolio) {
      navigate(`/portfolio/${user.userId}`);
    } else {
      navigate('/no-portfolio');
    }
  };

  // ✅ 4. 로그아웃 기능 구현 (토큰 삭제 및 페이지 이동)
  const handleLogout = () => {
    logout();
    navigate('/mainpage'); // 기존 코드와 동일하게 /mainpage로 이동
  };

  // 마지막 섹션이 보일 때만 네비게이션 바를 표시하는 로직
  useEffect(() => {
    const root = containerRef.current;
    const target = lastRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowNav(entry.isIntersecting),
      { root, threshold: 0.55 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // ✅ 5. 새로운 디자인의 JSX 구조에 위에서 만든 함수들을 완벽하게 연결
  return (
    <div className="hp-root-snap">
      <main className="snap-container" ref={containerRef}>
        <motion.section className="snap-section center bridge-bottom" {...sectionFade}>
          <HeroFourStrips />
        </motion.section>

        {PAGES.map((p) => (
          <motion.section
            key={p.id}
            className={`snap-section cover ${p.align} bridge-top bridge-bottom`}
            style={{ backgroundImage: `url(${p.bg})` }}
            aria-label={p.title}
            {...sectionFade}
          >
            <div className="cover-scrim" />
            <motion.div className={`copy-only w-bleed ${[1, 4].includes(p.id) ? "copy-dark" : ""}`} {...cardSweep}>
              <h2 className="copy-title">{p.title}</h2>
              <p className="copy-desc">{p.desc}</p>
            </motion.div>
          </motion.section>
        ))}

        <motion.section className="snap-section final bridge-top" {...sectionFade} ref={lastRef}>
          {/* --- 네비게이션 바 기능 연결 --- */}
          <header className={`hp-nav ${showNav ? "show" : ""}`}>
            <img
              src={`${PUB}/images/fopofo-logo.png`}
              alt="fopofo"
              className="hp-logo"
              onClick={() => navigate("/mainpage")} // 로고 클릭 시 /mainpage로 이동
            />
            <nav className="hp-links">
              <button onClick={() => navigate("/home")}>home</button>
              <button onClick={goToPortfolio}>portfolio</button>
              <button onClick={() => navigate("/mypage")}>my page</button>
              <button onClick={handleLogout}>logout</button>
            </nav>
          </header>

          <motion.div
            className="final-box"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.7 }}
          >
            <h3 className="final-title">지금 시작해 보세요</h3>
            <p className="final-desc">
              자기소개서를 업로드하면 시작화면이 자동 생성되고, 테마와 폰트, 이미지까지 즉시 커스터마이징할 수 있어요.
            </p>
            <button className="final-create" onClick={() => navigate("/create")}>
              Create
            </button>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}