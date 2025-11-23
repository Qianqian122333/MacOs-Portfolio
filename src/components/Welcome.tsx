import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const Welcome = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // 将文字分割成单个字符
    const splitText = (element: HTMLElement | null) => {
      if (!element) return [];
      const text = element.textContent || "";
      element.innerHTML = "";
      return text.split("").map((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char; // 保留空格
        span.style.display = "inline-block";
        element.appendChild(span);
        return span;
      });
    };

    const subTitleChars = splitText(subTitleRef.current);
    const titleChars = splitText(titleRef.current);
    const titleElement = titleRef.current;

    const timeline = gsap.timeline();

    // 副标题波浪动画：每个字符依次从下方弹起
    timeline.fromTo(
      subTitleChars,
      {
        opacity: 0,
        y: 50,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.03, // 每个字符间隔 0.03 秒
        ease: "back.out(1.7)",
      }
    );

    // 主标题波浪动画：从两侧向中间汇聚
    timeline.fromTo(
      titleChars,
      {
        opacity: 0,
        y: 100,
        scale: 0,
        rotation: 360,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: {
          each: 0.05,
          from: "center", // 从中心开始
        },
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.4"
    );

    // 添加持续的波浪起伏效果
    const waveAnimation = gsap.to(titleChars, {
      y: -10,
      duration: 1.5,
      stagger: {
        each: 0.2,
        repeat: -1,
        yoyo: true,
      },
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // 添加发光效果
    gsap.to(titleRef.current, {
      textShadow:
        "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // 为副标题的每个字符添加悬停发光效果
    subTitleChars.forEach((char) => {
      const handleCharMouseEnter = () => {
        gsap.to(char, {
          textShadow:
            "0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 215, 0, 0.8)",
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleCharMouseLeave = () => {
        gsap.to(char, {
          textShadow: "none",
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      char.addEventListener("mouseenter", handleCharMouseEnter);
      char.addEventListener("mouseleave", handleCharMouseLeave);
    });

    // 主标题点击切换波浪动画
    let isPlaying = true;

    const handleTitleClick = () => {
      if (isPlaying) {
        // 暂停波浪动画
        waveAnimation.pause();
        gsap.to(titleChars, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // 恢复波浪动画
        waveAnimation.play();
      }
      isPlaying = !isPlaying;
    };

    titleElement?.addEventListener("click", handleTitleClick);

    // 清理事件监听器
    return () => {
      titleElement?.removeEventListener("click", handleTitleClick);
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subTitleRef} className="text-4xl italic font-georama">
        Hi! Welcome to Qianqian's
      </p>
      <h1
        ref={titleRef}
        className="text-7xl font-bold italic font-georama cursor-pointer"
      >
        Portfolio
      </h1>

      <div className="small-screen">
        <p>This Portfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
