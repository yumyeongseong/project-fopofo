import React, { useEffect, useMemo, useRef, useState } from "react";
import "./StartPage.css";
import { useNavigate } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";

// --- 이미지 경로 설정 ---
// public 폴더를 기준으로 이미지 경로를 설정합니다.
// public/images/fopofo-logo.png
// public/EXHIBITION_IMGS/Images/1.png, 2.png ... 등이 있어야 합니다.
const PUB = process.env.PUBLIC_URL || "";
const BASE = `${PUB}/EXHIBITION_IMGS/Images`;

// --- 콜라주에 표시할 이미지 파일 목록 ---
const EXHIBITION_FILES = [
  "1.png", "2.png", "3.png", "4.png", "5.png",
  "6.png", "7.png", "8.png", "9.png", "10.png",
  "11.png", "12.png", "13.png", "14.png",
];
const EXHIBITION_IMGS = EXHIBITION_FILES.map(f => `${BASE}/${f}`);


/**
 * 배경에 느리게 나타나는 이미지 콜라주 컴포넌트
 */
function CollageBG({ active }) {
  // 렌더링 시 고정된 "랜덤" 딜레이 값을 생성하여 이미지가 순차적으로 나타나게 함
  const delays = useMemo(
    () => EXHIBITION_IMGS.map((_, i) => {
      const r = Math.sin(i * 147.33) * 43758.5453;
      const frac = r - Math.floor(r);
      return frac * 0.35; // 0 ~ 0.35초 사이의 딜레이
    }),
    []
  );

  return (
    <div className="collage-wrap">
      <div className="collage-grid">
        {EXHIBITION_IMGS.map((src, i) => (
          <motion.div
            key={src + i}
            className="collage-cell"
            initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
            animate={active ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
            transition={{
              delay: active ? delays[i] : 0,
              duration: 1.2, // 부드러운 등장을 위해 길게 설정
              ease: [0.22, 0.8, 0.2, 1],
            }}
          >
            <motion.img
              className="collage-img"
              src={src}
              alt="exhibit"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.currentTarget.src = `${PUB}/Portfolio.png`; }}
              // 이미지가 미세하게 위아래로 움직이는 효과
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        ))}
      </div>
      <div className="collage-overlay" />
    </div>
  );
}

/**
 * 텍스트가 중앙에서부터 나타나는 효과의 컴포넌트
 */
function CenterRevealText({ text, baseDelay = 0.4, step = 0.07, duration = 1.15 }) {
  const chars = Array.from(text);
  const mid = (chars.length - 1) / 2;
  return (
    <h1 className="hero-text depth3d" data-text={text}>
      {chars.map((ch, i) => {
        const dist = Math.abs(i - mid);
        const delay = baseDelay + dist * step;
        return (
          <motion.span
            key={`${ch}-${i}`}
            className="hero-letter"
            initial={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ delay, duration, ease: [0.22, 0.8, 0.2, 1] }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        );
      })}
    </h1>
  );
}

// --- 최종 StartPage 컴포넌트 ---
export default function StartPage() {
  const navigate = useNavigate();
  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");

  const ctaControls = useAnimationControls();
  const [gridActive, setGridActive] = useState(false);
  const kickedRef = useRef(false); // 중복 실행 방지

  // 각 텍스트 라인의 애니메이션 타이밍 설정
  const LINE1 = { baseDelay: 0.38, step: 0.075, duration: 1.22 };
  const LINE2 = { baseDelay: 0.62, step: 0.08, duration: 1.25 };
  const GRID_KICK_OFFSET = 0.55; // 두 번째 텍스트 애니메이션 시작 후 콜라주가 나타날 시간(초)

  useEffect(() => {
    // 중앙 텍스트 컨테이너 등장 애니메이션
    ctaControls.start({
      opacity: [0, 1],
      y: [12, 0],
      transition: { duration: 0.7, ease: "easeOut" },
    });

    // 콜라주 배경 등장 타이밍 제어
    if (!kickedRef.current) {
      kickedRef.current = true;
      const kickMs = (LINE2.baseDelay + GRID_KICK_OFFSET) * 1000;
      setTimeout(() => setGridActive(true), Math.max(0, kickMs));
    }
  }, [ctaControls]);

  return (
    <div className="start-page">
      {/* 좌상단 로고 (클릭 시 홈으로) */}
      <img
        src={`${PUB}/images/fopofo-logo.png`}
        alt="fopofo-logo"
        className="logo"
        onClick={goHome}
      />

      {/* 배경 이미지 콜라주 */}
      <CollageBG active={gridActive} />

      {/* 중앙 텍스트 및 클릭 영역 (클릭 시 로그인으로) */}
      <motion.div
        className="title-wrapper"
        initial={{ opacity: 0, y: 12 }}
        animate={ctaControls}
        onClick={goLogin}
      >
        <CenterRevealText
          text="For Portfolio"
          baseDelay={LINE1.baseDelay}
          step={LINE1.step}
          duration={LINE1.duration}
        />

        <motion.div
          className="divider-line"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 520, opacity: 0.55 }}
          transition={{ delay: LINE1.baseDelay + 0.48, duration: 0.9, ease: "easeOut" }}
        />

        <CenterRevealText
          text="For People"
          baseDelay={LINE2.baseDelay}
          step={LINE2.step}
          duration={LINE2.duration}
        />
      </motion.div>

      {/* 페이지 진입 시 흰색 화면이 사라지는 효과 */}
      <motion.div
        className="intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}