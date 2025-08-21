import React from "react";
import "./HeroFourStrips.css";

export default function HeroFourStrips() {
    const STRIPS = [
        "/HOME/home1.png",
        "/HOME/home2.png",
        "/HOME/home3.png",
        "/HOME/home4.png",
    ];

    return (
        <section className="hf hf-full">
            <div className="hero-card">
                {/* 4개 스트립 */}
                <div className="hero-strips">
                    {STRIPS.map((src, i) => (
                        <div key={i} className="strip" style={{ backgroundImage: `url(${src})` }} />
                    ))}
                </div>

                {/* 어둡게 스크림 */}
                <div className="hero-scrim strong" />

                {/* 중앙 텍스트 */}
                <div className="hero-center">
                    <h1 className="hero-headline">
                        <span>Create Your</span>
                        <span>Own</span>
                        <span>Web Portfolio</span>
                    </h1>
                    <p className="hero-tagline">
                        나만의 웹 포트폴리오를 손쉽게 만들고 공유하세요.
                    </p>
                </div>
            </div>
        </section>
    );
}
