"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import {
  Heart,
  User,
  Mic,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Moon,
  Phone,
  MoreHorizontal,
  Flame,
  MessageSquare,
  Layers,
  MapPin,
  Check,
  X,
  Image as ImageIcon,
  Crown,
  Activity,
  Eye,
  Share2,
  Video,
  SwitchCamera,
  Upload,
  Zap,
  Settings,
  LogOut,
  Bell,
  Lock,
  HelpCircle,
  Shield,
  Info,
  CreditCard,
  Gift,
  Users,
} from "lucide-react";
import { matchOrder, previewUsers, type PreviewUser } from "@/lib/mock-data/users/preview-users";

type TabId = "match" | "explore" | "virtual" | "messages" | "profile";
type ChatTarget = { name: string; isAI?: boolean };
type ChatMessage = { id: number; type: "user" | "model"; text: string; time: string };
type DetailProfile = PreviewUser;

const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;900&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    body {
      background-color: #050505;
      font-family: 'Noto Sans SC', sans-serif;
      color: #fdf8fa;
    }
    .font-serif { font-family: 'Noto Serif SC', serif; }
    .font-pixel { font-family: 'Press Start 2P', cursive; }
    ::-webkit-scrollbar { width: 0px; background: transparent; }

    .glass-panel {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    .glass-input {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .avatar-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      background: linear-gradient(45deg, currentColor, transparent);
      opacity: 0.4;
      filter: blur(6px);
      animation: heartbeat 3s infinite ease-in-out;
    }
    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: float-breathe 12s infinite ease-in-out alternate;
      pointer-events: none;
      transition: background-color 1s ease;
    }
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.08); opacity: 0.6; }
    }
    @keyframes float-breathe {
      0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      50% { transform: translate(20px, -20px) scale(1.1); opacity: 0.6; }
      100% { transform: translate(-10px, 10px) scale(0.9); opacity: 0.3; }
    }
    @keyframes msgFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-msg { animation: msgFadeIn 0.4s ease forwards; }
    @keyframes splashFadeOut {
      from { opacity: 1; transform: scale(1); filter: blur(0); }
      to { opacity: 0; transform: scale(1.1); filter: blur(10px); pointer-events: none; }
    }
    .animate-splash-out { animation: splashFadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    .crt-scanlines {
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 4px, 3px 100%;
      pointer-events: none;
      z-index: 10;
    }
    .pixelated-img {
      image-rendering: pixelated;
      filter: contrast(1.4) saturate(1.5) sepia(0.3) hue-rotate(-10deg);
    }
    .pixel-grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px);
      background-size: 8px 8px;
      pointer-events: none;
      z-index: 5;
    }
    .vip-card-glow {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(ellipse 110% 75% at 18% 0%, rgba(255,209,118,0.18), transparent 60%),
        radial-gradient(ellipse 95% 80% at 85% 100%, rgba(255,143,107,0.22), transparent 65%),
        linear-gradient(135deg, #3a1a26 0%, #220e18 55%, #170710 100%);
      box-shadow:
        inset 0 1px 0 rgba(255,217,168,0.22),
        inset 0 -1px 0 rgba(0,0,0,0.55),
        inset 1px 0 0 rgba(255,209,118,0.10),
        inset -1px 0 0 rgba(0,0,0,0.40),
        inset 0 0 28px rgba(255,143,107,0.10),
        0 14px 36px -16px rgba(255,143,107,0.45),
        0 6px 18px -8px rgba(0,0,0,0.55);
    }
    .vip-card-glow::after {
      content: '';
      position: absolute;
      top: -50%; left: -50%; width: 200%; height: 200%;
      background: linear-gradient(to right, rgba(255,209,118,0) 0%, rgba(255,217,168,0.16) 50%, rgba(255,209,118,0) 100%);
      transform: rotate(28deg);
      animation: sweep 7s infinite linear;
      pointer-events: none;
      z-index: 2;
    }
    @keyframes sweep {
      0% { transform: translateX(-100%) rotate(28deg); }
      100% { transform: translateX(100%) rotate(28deg); }
    }
    @keyframes vip-wave-flow {
      0%   { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }
    .vip-wave-rose { animation: vip-wave-flow 16s linear infinite; }
    .vip-wave-gold { animation: vip-wave-flow 11s linear infinite; }
    .vip-renew-btn {
      background: linear-gradient(180deg, #ffe1b8 0%, #e3a891 48%, #b87c67 100%);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.60),
        inset 0 -1px 0 rgba(83,38,28,0.35),
        0 4px 10px -2px rgba(184,124,103,0.55),
        0 1px 2px rgba(0,0,0,0.30);
    }
    .vip-renew-btn:active {
      box-shadow:
        inset 0 1px 2px rgba(83,38,28,0.45),
        inset 0 -1px 0 rgba(255,255,255,0.20),
        0 1px 2px rgba(0,0,0,0.20);
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  `,
    }}
  />
);

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "rgba(255, 94, 160, 0.7)",
      "rgba(169, 112, 255, 0.6)",
      "rgba(255, 228, 225, 0.5)",
    ];
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      sinValue: Math.random() * Math.PI * 2,
      sinSpeed: Math.random() * 0.02 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.sinValue) * 0.2;
        p.y += p.vy;
        p.sinValue += p.sinSpeed;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />;
};

const SplashView = ({ onEnter, isLeaving }: { onEnter: () => void; isLeaving: boolean }) => (
  <div className={`absolute inset-0 z-50 bg-[#0d0508] flex flex-col items-center justify-center overflow-hidden ${isLeaving ? "animate-splash-out" : ""}`}>
    <ParticleBackground />
    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-[90px] pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rose-500/20 rounded-full blur-[90px] pointer-events-none" />
    <div className="relative z-10 flex flex-col items-center animate-msg mt-[-10%]">
      <div className="relative mb-10 hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-400 rounded-[2rem] blur-xl opacity-60 animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#ff6b9e]/30 to-[#a970ff]/30 flex items-center justify-center border-2 border-pink-300/40 shadow-[0_0_50px_rgba(255,94,160,0.5)] backdrop-blur-xl">
          <Heart className="w-14 h-14 text-pink-100 fill-pink-500 drop-shadow-[0_0_15px_rgba(255,94,160,0.9)] animate-pulse" style={{ animationDuration: "2s" }} />
        </div>
      </div>
      <h1 className="font-serif text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200 mb-1 tracking-[0.15em]" style={{ filter: "drop-shadow(0 0 20px rgba(255, 94, 160, 0.4))" }}>
        WarmU
      </h1>
      <div className="text-[9px] font-mono tracking-[0.6em] text-pink-300/70 mb-10 ml-2 uppercase font-bold">AI Virtual Companion</div>
      <div className="flex items-center gap-4 mb-24">
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-pink-400/60" />
        <p className="font-serif text-white/90 tracking-[0.5em] text-[13px] font-light drop-shadow-lg ml-1">开启一段心动的旅程</p>
        <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-400/60" />
      </div>
      <button onClick={onEnter} className="px-10 py-4 glass-panel rounded-full text-white font-medium tracking-widest text-sm flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95" style={{ boxShadow: "0 0 20px rgba(255,94,160,0.4)" }}>
        <Sparkles className="w-4 h-4 text-pink-400" /> 进入心遇
      </button>
    </div>
  </div>
);

export function WarmUApp({
  initialTab = "match",
  showSplashOnStart = true,
}: {
  initialTab?: TabId;
  showSplashOnStart?: boolean;
}) {
  const [showSplash, setShowSplash] = useState(showSplashOnStart);
  const [isLeavingSplash, setIsLeavingSplash] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [detailProfile, setDetailProfile] = useState<DetailProfile | null>(null);

  const handleEnterApp = () => {
    setIsLeavingSplash(true);
    setTimeout(() => setShowSplash(false), 800);
  };

  const getBgClass = (tab: TabId) => {
    switch (tab) {
      case "match":
        return "from-[#26111a] to-[#12060c]";
      case "explore":
        return "from-[#5a1f3d] to-[#23091a]";
      case "virtual":
        return "from-[#0a171c] to-[#04080a]";
      case "messages":
        return "from-[#1f1118] to-[#0d0508]";
      case "profile":
        return "from-[#582038] to-[#170510]";
    }
  };

  const getOrbColors = (tab: TabId) => {
    switch (tab) {
      case "match":
        return ["bg-pink-500/20", "bg-rose-500/20"];
      case "explore":
        return ["bg-pink-400/30", "bg-amber-300/20"];
      case "virtual":
        return ["bg-cyan-500/15", "bg-emerald-500/15"];
      case "messages":
        return ["bg-rose-500/20", "bg-pink-500/20"];
      case "profile":
        return ["bg-[#c44569]/28", "bg-[#a86a52]/18"];
    }
  };

  const currentBg = getBgClass(activeTab);
  const orbs = getOrbColors(activeTab);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <GlobalStyles />
      <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-br ${currentBg} text-white md:max-w-[390px] md:h-[844px] md:rounded-[40px] md:border-[8px] md:border-[#202020] md:shadow-2xl md:my-8 mx-auto md:max-h-screen transition-colors duration-1000`}>
        {showSplash && <SplashView onEnter={handleEnterApp} isLeaving={isLeavingSplash} />}

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className={`glow-orb w-[300px] h-[300px] ${orbs[0]} -top-[10%] -left-[20%]`} />
          <div className={`glow-orb w-[250px] h-[250px] ${orbs[1]} bottom-[10%] -right-[10%]`} style={{ animationDelay: "-3s" }} />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col pb-20 overflow-y-auto">
          {activeTab === "match" && <MatchView onOpenProfile={setDetailProfile} />}
          {activeTab === "explore" && <ExploreView />}
          {activeTab === "virtual" && <VirtualView onStartCall={() => setVideoCallActive(true)} />}
          {activeTab === "messages" && <MessagesView onOpenChat={(target) => setChatTarget(target)} onOpenProfile={setDetailProfile} />}
          {activeTab === "profile" && <ProfileView />}
        </div>

        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {detailProfile && <ProfileDetailModal profile={detailProfile} onClose={() => setDetailProfile(null)} onChat={() => {
          setDetailProfile(null);
          setChatTarget({ name: detailProfile.displayName });
        }} />}
        {chatTarget && <ChatModal target={chatTarget} onClose={() => setChatTarget(null)} />}
        {videoCallActive && <PixelVideoCallModal onClose={() => setVideoCallActive(false)} />}
      </div>
    </div>
  );
}

export default function App() {
  return <WarmUApp />;
}

const MatchView = ({ onOpenProfile }: { onOpenProfile: (profile: DetailProfile) => void }) => {
  const [profileIndex, setProfileIndex] = useState(0);
  const [leavingCard, setLeavingCard] = useState<{ profile: DetailProfile; direction: "left" | "right"; velocity: number } | null>(null);
  const [lastAction, setLastAction] = useState<"like" | "pass" | "super" | null>(null);
  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [-140, 0, 140], [1, 0, 1]);
  const featured = matchOrder[profileIndex % matchOrder.length];
  const nextProfiles = Array.from({ length: Math.min(2, matchOrder.length - 1) }, (_, i) => matchOrder[(profileIndex + i + 1) % matchOrder.length]);

  const moveNext = (action: "like" | "pass" | "super", velocity = 0) => {
    if (leavingCard) return;
    setLastAction(action);
    setLeavingCard({ profile: featured, direction: action === "pass" ? "left" : "right", velocity });
    setProfileIndex((idx) => (idx + 1) % matchOrder.length);
    dragX.set(0);
    window.setTimeout(() => {
      setLeavingCard(null);
    }, 320);
  };

  useEffect(() => {
    matchOrder.forEach((profile) => {
      if (!profile.photo) return;
      const image = new Image();
      image.src = profile.photo;
    });
  }, []);

  return (
    <div className="px-5 pt-12 pb-6 flex flex-col h-full animate-msg">
      <header className="flex justify-between items-center mb-4 px-2">
        <div>
          <h1 className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-300">心动邂逅</h1>
          <p className="text-[10px] text-white/50 mt-1 font-medium">发现与你灵魂同频的人</p>
        </div>
        <div className="px-3 py-1.5 glass-panel rounded-full text-xs text-pink-300 font-bold flex items-center gap-1 border-pink-500/30">
          <Activity className="w-3 h-3" /> 附近 {previewUsers.length + 7} 人
        </div>
      </header>

      <div className="flex-1 min-h-0 relative w-full mt-1">
        {nextProfiles.slice(0, 2).reverse().map((profile, stackIndex) => (
          <StackProfileCard
            key={profile.id}
            profile={profile}
            stackIndex={stackIndex}
            dragProgress={dragProgress}
          />
        ))}

        <SwipeProfileCard
          key={featured.id}
          profile={featured}
          x={dragX}
          onOpenProfile={onOpenProfile}
          onSwipe={moveNext}
        />
        {leavingCard && (
          <FlyingProfileCard
            key={`${leavingCard.profile.id}-${leavingCard.direction}`}
            profile={leavingCard.profile}
            direction={leavingCard.direction}
            velocity={leavingCard.velocity}
          />
        )}

        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 px-3 py-1.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-xl text-[10px] text-white/55 font-bold pointer-events-none">
          ← 不喜欢　右滑喜欢 →
        </div>
      </div>

      {lastAction && (
        <div className="mt-4 text-center text-[11px] text-white/55 font-bold h-4">
          {lastAction === "like" ? "已喜欢，等待对方回应" : lastAction === "pass" ? "已跳过，继续为你推荐" : "已发送超级喜欢"}
        </div>
      )}

      <div className="flex justify-center items-center gap-6 mt-5 pb-4">
        <button onClick={() => moveNext("pass", -700)} className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white/50 hover:bg-white/10 transition-all hover:scale-105">
          <X className="w-6 h-6" />
        </button>
        <button onClick={() => moveNext("like", 700)} className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-[0_8px_20px_rgba(255,94,160,0.4)] hover:scale-105 transition-all border border-pink-400">
          <Heart className="w-7 h-7 fill-white" />
        </button>
        <button onClick={() => moveNext("super", 900)} className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-yellow-400 hover:bg-white/10 transition-all hover:scale-105">
          <Sparkles className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const StackProfileCard = ({
  profile,
  stackIndex,
  dragProgress,
}: {
  profile: DetailProfile;
  stackIndex: number;
  dragProgress: MotionValue<number>;
}) => {
  const baseScale = stackIndex === 0 ? 0.93 : 0.965;
  const liftScale = stackIndex === 0 ? 0.025 : 0.026;
  const baseY = stackIndex === 0 ? 24 : 12;
  const liftY = stackIndex === 0 ? 8 : 4;
  const baseOpacity = stackIndex === 0 ? 0.36 : 0.62;
  const opacityLift = stackIndex === 0 ? 0.1 : 0.2;

  const scale = useTransform(dragProgress, [0, 1], [baseScale, baseScale + liftScale]);
  const y = useTransform(dragProgress, [0, 1], [baseY, liftY]);
  const opacity = useTransform(dragProgress, [0, 1], [baseOpacity, baseOpacity + opacityLift]);

  return (
    <motion.div
      className="absolute inset-0 rounded-[36px] overflow-hidden border border-white/18 bg-white/8 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_28px_70px_rgba(0,0,0,0.42)]"
      style={{ scale, y, opacity }}
      transition={{ type: "spring", stiffness: 420, damping: 36 }}
    >
      <img src={profile.photo} alt={profile.displayName} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/24 to-white/8" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
    </motion.div>
  );
};

const SwipeProfileCard = ({
  profile,
  x,
  onOpenProfile,
  onSwipe,
}: {
  profile: DetailProfile;
  x: MotionValue<number>;
  onOpenProfile: (profile: DetailProfile) => void;
  onSwipe: (action: "like" | "pass", velocity?: number) => void;
}) => {
  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);
  const y = useTransform(x, [-220, 0, 220], [8, 0, 8]);
  const likeOpacity = useTransform(x, [18, 96], [0, 1]);
  const nopeOpacity = useTransform(x, [-96, -18], [1, 0]);
  const cardShadow = useTransform(x, [-180, 0, 180], [
    "0 24px 60px rgba(0,0,0,0.40)",
    "0 24px 60px rgba(255,94,160,0.18)",
    "0 24px 60px rgba(255,94,160,0.40)",
  ]);

  return (
    <motion.div
      className="absolute inset-0 rounded-[36px] overflow-hidden border border-white/18 bg-white/8 backdrop-blur-2xl text-left cursor-grab active:cursor-grabbing touch-none"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.22}
      dragMomentum={false}
      style={{ x, y, rotate, boxShadow: cardShadow }}
      whileDrag={{ scale: 1.018 }}
      initial={{ opacity: 1, scale: 1, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.62 }}
      onDragEnd={(_, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        if (offset > 78 || velocity > 420) onSwipe("like", velocity);
        else if (offset < -78 || velocity < -420) onSwipe("pass", velocity);
      }}
      onDoubleClick={() => onOpenProfile(profile)}
    >
      <div className="absolute -inset-6 bg-white/8 blur-3xl pointer-events-none" />
      <img src={profile.photo} alt={profile.displayName} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/22 to-white/10 pointer-events-none" />
      <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent pointer-events-none" />
      <div className="absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-white/24 to-transparent pointer-events-none" />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-9 left-6 rotate-[-12deg] px-4 py-2 rounded-2xl border-2 border-pink-300 bg-pink-500/18 backdrop-blur-xl text-pink-100 font-black tracking-[0.2em] text-xl shadow-[0_0_28px_rgba(255,94,160,0.45)]"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-9 right-6 rotate-[12deg] px-4 py-2 rounded-2xl border-2 border-white/50 bg-black/30 backdrop-blur-xl text-white/85 font-black tracking-[0.2em] text-xl"
      >
        NOPE
      </motion.div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenProfile(profile);
        }}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/35 border border-white/20 backdrop-blur-xl text-[10px] text-white/80 font-bold flex items-center gap-1"
      >
        <Eye className="w-3 h-3 text-pink-300" /> 查看详情
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-serif font-bold tracking-wide">
                {profile.displayName}, {profile.age}
              </span>
              {profile.online && <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]" />}
            </div>
            <p className="text-sm text-white/80 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {profile.location} · {profile.distance} · {profile.profession}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center border border-pink-400/40 bg-pink-500/20 backdrop-blur-md shadow-lg">
            <span className="text-[10px] text-pink-200">契合</span>
            <span className="text-sm font-bold text-pink-300">{profile.compatibility}%</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-medium">{profile.mbti}</span>
          {profile.tags.slice(0, 3).map((tag) => (
            <span key={tag.label} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-medium">
              {tag.emoji} {tag.label}
            </span>
          ))}
        </div>
        <p className="text-sm text-white/80 line-clamp-2 leading-relaxed font-medium">{profile.bio}</p>
      </div>
    </motion.div>
  );
};

const FlyingProfileCard = ({
  profile,
  direction,
  velocity,
}: {
  profile: DetailProfile;
  direction: "left" | "right";
  velocity: number;
}) => (
  <motion.div
    className="absolute inset-0 rounded-[36px] overflow-hidden border border-white/18 bg-white/8 backdrop-blur-2xl shadow-[0_28px_70px_rgba(0,0,0,0.42)] pointer-events-none"
    initial={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
    animate={{
      x: direction === "left" ? -580 - Math.min(Math.abs(velocity) * 0.08, 90) : 580 + Math.min(Math.abs(velocity) * 0.08, 90),
      rotate: direction === "left" ? -24 - Math.min(Math.abs(velocity) * 0.006, 8) : 24 + Math.min(Math.abs(velocity) * 0.006, 8),
      opacity: 0,
      scale: 0.965,
    }}
    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
  >
    <img src={profile.photo} alt={profile.displayName} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-white/10" />
    <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    <div className={`absolute top-9 ${direction === "left" ? "right-6 rotate-[12deg] border-white/50 text-white/85" : "left-6 rotate-[-12deg] border-pink-300 text-pink-100"} px-4 py-2 rounded-2xl border-2 bg-black/28 backdrop-blur-xl font-black tracking-[0.2em] text-xl`}>
      {direction === "left" ? "NOPE" : "LIKE"}
    </div>
  </motion.div>
);

type CommunityPost = {
  id: number;
  name: string;
  avatar: string;
  time: string;
  mood: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  aiReply?: { name: string; text: string };
};

const communityPosts: CommunityPost[] = [
  {
    id: 1,
    name: "想吃小蛋糕",
    avatar: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=100&q=80",
    time: "10分钟前",
    mood: "渴望拥抱",
    content: "今天下雨了，没有带伞，被淋成了落汤鸡。好想喝一杯热乎乎的奶茶啊... 😭",
    images: [
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=80",
    ],
    likes: 32,
    comments: 5,
    aiReply: { name: "苏菲", text: "赶紧洗个热水澡换身干衣服呀！给你一个大大的虚拟拥抱，别感冒啦！" },
  },
  {
    id: 2,
    name: "星河漫步",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    time: "23分钟前",
    mood: "深夜emo",
    content: "凌晨三点，又是一个人看星星的夜晚。突然想到很多事，有点想哭 🌌",
    images: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=300&q=80",
    ],
    likes: 128,
    comments: 24,
    aiReply: { name: "星河", text: "星星也在陪你呀！深夜的情绪总是特别深，要不要和我聊聊？" },
  },
  {
    id: 3,
    name: "柠檬不加糖",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    time: "1小时前",
    mood: "想吐槽",
    content: "今天又被老板骂了...明明不是我的锅，凭什么让我背？在线求一个能听我吐槽两小时的朋友 💢",
    images: [],
    likes: 67,
    comments: 18,
  },
  {
    id: 4,
    name: "午夜诗人",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    time: "2小时前",
    mood: "失眠中",
    content: "睡不着，煮了杯咖啡，翻开那本一直没读完的书。此刻只想和自己独处一会 ☕📖",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=300&q=80",
    ],
    likes: 89,
    comments: 11,
    aiReply: { name: "月光", text: "独处也是一种浪漫～愿你在字里行间找到一点点温柔的慰藉。" },
  },
  {
    id: 5,
    name: "小太阳",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    time: "3小时前",
    mood: "想分享快乐",
    content: "周末和朋友去吃了超好吃的甜品！草莓芝士蛋糕太幸福了～分享给大家看看 🍓🍰",
    images: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&q=80",
    ],
    likes: 201,
    comments: 37,
  },
  {
    id: 6,
    name: "蓝色海岸线",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    time: "5小时前",
    mood: "逃离日常",
    content: "好想请个假去海边走走... 每天挤地铁的我只能靠云旅游续命了 🌊",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    ],
    likes: 154,
    comments: 22,
    aiReply: { name: "小海", text: "要不我们现在就开启虚拟海边漫步？我陪你听海浪声，好不好？" },
  },
];

const ExploreView = () => {
  const [subTab, setSubTab] = useState<"community" | "tools">("community");

  return (
    <div className="px-4 pt-14 pb-8 animate-msg">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex gap-5 items-baseline">
          <h2 onClick={() => setSubTab("community")} className={`font-serif text-2xl font-bold cursor-pointer relative transition-colors ${subTab === "community" ? "text-white" : "text-white/40 text-xl"}`}>
            树洞广场
            {subTab === "community" && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]" />}
          </h2>
          <h2 onClick={() => setSubTab("tools")} className={`font-serif text-2xl font-bold cursor-pointer relative transition-colors ${subTab === "tools" ? "text-white" : "text-white/40 text-xl"}`}>
            心动盲盒
            {subTab === "tools" && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]" />}
          </h2>
        </div>
        <div className="px-3 py-1.5 glass-panel rounded-full border-purple-500/30 text-[10px] text-purple-300 font-bold flex items-center gap-1 shadow-sm">
          <Moon className="w-3 h-3" /> {subTab === "community" ? "夜间模式" : "魔法模式"}
        </div>
      </div>

      {subTab === "community" ? (
        <div className="space-y-4 animate-msg">
          {communityPosts.map((post) => (
            <div key={post.id} className="glass-panel rounded-3xl p-4 shadow-lg shadow-black/20 border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-400/40 border border-white/10 overflow-hidden">
                    <img src={post.avatar} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white/90">{post.name}</div>
                    <div className="text-[9px] text-white/40 font-medium">{post.time} · {post.mood}</div>
                  </div>
                </div>
                <button className="text-white/30">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[14px] text-white/80 leading-relaxed mb-3 font-medium px-1">{post.content}</p>
              {post.images.length > 0 && (
                <div className={`grid gap-1.5 mb-4 ${post.images.length === 1 ? "grid-cols-3" : "grid-cols-3"}`}>
                  {post.images.map((src, idx) => (
                    <div key={idx} className={`aspect-square rounded-xl overflow-hidden border border-white/10 shadow-inner relative group ${post.images.length === 1 ? "col-span-1" : ""}`}>
                      <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`post-${idx}`} />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between px-2 mb-3 text-white/40">
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 hover:text-purple-400">
                    <Heart className="w-4 h-4" /> <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-purple-400">
                    <MessageSquare className="w-4 h-4 fill-purple-500/20" /> <span className="text-xs">{post.comments}</span>
                  </button>
                </div>
                <button>
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              {post.aiReply && (
                <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl p-3 border-l-2 border-purple-400 flex gap-3 shadow-inner backdrop-blur-sm">
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 border border-purple-400/50">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-[11px] text-purple-300 mb-1 font-bold flex items-center gap-2">
                      AI 暖友 · {post.aiReply.name} <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-[8px] text-purple-200">秒回</span>
                    </div>
                    <p className="text-[12px] text-white/80 font-medium">{post.aiReply.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-msg">
          <div
            className="relative rounded-3xl p-4 overflow-hidden border-2 backdrop-blur-md bg-gradient-to-br from-[#ff8f6b]/26 via-[#ffc4d3]/14 to-[#ff7a8c]/6 border-[#ff8f6b]/45 active:scale-[0.99] active:translate-y-[1px] transition-all"
            style={{
              boxShadow:
                "inset 0 1.5px 0 rgba(255,255,255,0.20), inset 0 -1.5px 0 rgba(0,0,0,0.25), 0 4px 0 rgba(0,0,0,0.32), 0 6px 16px -6px rgba(0,0,0,0.45)",
            }}
          >
            {/* 双层 bokeh 暖光：珊瑚粉 + 金 */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-2xl pointer-events-none bg-[#ff8f6b]/40" />
            <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-[#ffd176]/22" />

            {/* 卡通吉祥物：右上角倾斜浮起的雪花（破冰） */}
            <span
              className="absolute top-2 right-3 text-[58px] leading-none select-none pointer-events-none z-10"
              style={{
                transform: 'rotate(-15deg)',
                filter:
                  'drop-shadow(0 3px 5px rgba(0,0,0,0.45)) drop-shadow(0 0 12px rgba(255,255,255,0.18))',
              }}
            >
              ❄️
            </span>

            {/* 标题区 */}
            <div className="relative z-20 flex items-center gap-3 mb-3 pr-14">
              <div
                className="w-11 h-11 rounded-2xl bg-[#ff8f6b]/24 flex items-center justify-center border-2 border-[#ff8f6b]/55 shrink-0"
                style={{
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.20), 0 2px 0 rgba(0,0,0,0.22)",
                }}
              >
                <span className="text-[24px] leading-none drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">💬</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-white text-[18px] leading-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">
                  AI 聊天破冰辅助
                </h3>
                <p className="text-[12px] text-white/75 leading-snug mt-0.5">截图分析 TA 的潜台词，告诉你怎么回</p>
              </div>
            </div>

            {/* 上传区域 — 卡通虚线糖果框 */}
            <div
              className="relative z-20 w-full h-24 rounded-2xl border-2 border-dashed border-[#ff8f6b]/55 bg-[#ff8f6b]/8 flex flex-col items-center justify-center cursor-pointer active:scale-[0.985] transition-all"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)' }}
            >
              <span className="text-[28px] leading-none mb-1 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">📸</span>
              <span className="text-[12px] font-black text-white/90">点击上传聊天截图</span>
              <span className="text-[10px] text-white/55 mt-0.5">支持微信 / QQ / 探探</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <ToolTile icon="💖" mascot="🌹" title="恋爱人格"   desc="AI 测出你的隐藏恋爱属性"      color="love" />
            <ToolTile icon="🔥" mascot="🎬" title="心动剧本"   desc="生成平行时空的专属故事"      color="passion" />
            <ToolTile icon="⭐" mascot="🪐" title="星座配对"   desc="查看今日 12 星座心动指数"     color="starlight" />
            <ToolTile icon="🔮" mascot="🎴" title="塔罗占卜"   desc="抽一张牌看你的桃花走向"      color="mystic" />
            <ToolTile icon="🧠" mascot="💭" title="MBTI 契合"  desc="测你和 TA 的人格契合度"       color="intellect" />
            <ToolTile icon="🌡️" mascot="🌶️" title="暧昧温度"  desc="上传聊天截图测心动指数"      color="fever" />
            <ToolTile icon="💑" mascot="🎀" title="虚拟恋人"   desc="定制专属 AI 陪伴恋人"        color="violet" />
            <ToolTile icon="🌙" mascot="☁️" title="梦境解码"   desc="解析梦中出现的情感线索"      color="dream" />
            <ToolTile icon="🎂" mascot="🎁" title="缘分生日"   desc="用生辰八字算注定的人"        color="celebrate" />
            <ToolTile icon="💌" mascot="🖋️" title="AI 情书"    desc="一键生成动人心动情书"        color="letter" />
            <ToolTile icon="🌸" mascot="🍀" title="桃花运"     desc="查看今日桃花方位与时辰"      color="blossom" />
            <ToolTile icon="💘" mascot="🎤" title="告白脚本"   desc="AI 设计最稳的告白话术"       color="confess" />
          </div>
        </div>
      )}
    </div>
  );
};

type ToolColor =
  | "love"       // 恋爱人格 · 玫瑰→珊瑚
  | "passion"    // 心动剧本 · 珊瑚→金（落日）
  | "starlight"  // 星座配对 · 金→暮紫（昼夜星空）
  | "mystic"     // 塔罗占卜 · 莓果→深紫（神秘）
  | "intellect"  // MBTI · 玫瑰→蓝紫（理智×情感）
  | "fever"      // 暧昧温度 · 蜜桃→玫瑰（升温）
  | "violet"     // 虚拟恋人 · 暮紫→樱粉
  | "dream"      // 梦境解码 · 月夜紫→银粉
  | "celebrate"  // 缘分生日 · 琥珀→玫瑰
  | "letter"     // AI 情书 · 樱粉→玫瑰
  | "blossom"    // 桃花运 · 珊瑚→樱粉
  | "confess";   // 告白脚本 · 玫瑰→莓果

type ToolStyle = { icon: string; tile: string; bokeh: string };

// 12 道双色渐变 · 三大色族（暖恋爱 / 玄学夜调 / 樱粉柔软），每张卡 from→via→to 三段式
const toolStyles: Record<ToolColor, ToolStyle> = {
  // 暖恋爱族
  love:       { icon: "bg-[#ff7a8c]/26 text-[#ffe0e7] border-[#ff7a8c]/60",
                tile: "bg-gradient-to-br from-[#ff7a8c]/28 via-[#ff8f6b]/14 to-[#ff8f6b]/4 border-[#ff7a8c]/40",
                bokeh: "bg-[#ff7a8c]/40" },
  passion:    { icon: "bg-[#ff8f6b]/26 text-[#ffe1cc] border-[#ff8f6b]/60",
                tile: "bg-gradient-to-br from-[#ff8f6b]/28 via-[#ffd176]/14 to-[#ffd176]/4 border-[#ff8f6b]/40",
                bokeh: "bg-[#ffd176]/38" },
  fever:      { icon: "bg-[#ffb88a]/26 text-[#ffe5cc] border-[#ffb88a]/60",
                tile: "bg-gradient-to-br from-[#ffb88a]/28 via-[#ff7a8c]/14 to-[#ff7a8c]/4 border-[#ffb88a]/40",
                bokeh: "bg-[#ff7a8c]/38" },
  celebrate:  { icon: "bg-[#e8b86f]/26 text-[#ffe6b8] border-[#e8b86f]/60",
                tile: "bg-gradient-to-br from-[#e8b86f]/28 via-[#ff8f6b]/14 to-[#ff7a8c]/5 border-[#e8b86f]/40",
                bokeh: "bg-[#ff7a8c]/32" },
  blossom:    { icon: "bg-[#ff8f6b]/26 text-[#ffe1cc] border-[#ff8f6b]/60",
                tile: "bg-gradient-to-br from-[#ff8f6b]/26 via-[#ffc4d3]/16 to-[#ffc4d3]/4 border-[#ff8f6b]/40",
                bokeh: "bg-[#ffc4d3]/40" },
  confess:    { icon: "bg-[#ff7a8c]/28 text-[#ffd0db] border-[#ff7a8c]/60",
                tile: "bg-gradient-to-br from-[#ff7a8c]/28 via-[#b5476b]/16 to-[#b5476b]/4 border-[#ff7a8c]/45",
                bokeh: "bg-[#b5476b]/40" },
  // 玄学夜调族
  starlight:  { icon: "bg-[#ffd176]/24 text-[#fff1bf] border-[#ffd176]/60",
                tile: "bg-gradient-to-br from-[#ffd176]/26 via-[#b08fc7]/18 to-[#6a4d7a]/8 border-[#ffd176]/40",
                bokeh: "bg-[#b08fc7]/40" },
  mystic:     { icon: "bg-[#b5476b]/32 text-[#ffc8d6] border-[#b5476b]/60",
                tile: "bg-gradient-to-br from-[#b5476b]/28 via-[#5a3a6e]/18 to-[#5a3a6e]/5 border-[#b5476b]/45",
                bokeh: "bg-[#5a3a6e]/50" },
  intellect:  { icon: "bg-[#e0879b]/26 text-[#ffd6e0] border-[#e0879b]/60",
                tile: "bg-gradient-to-br from-[#e0879b]/26 via-[#9b8fc7]/18 to-[#7a6aa8]/6 border-[#e0879b]/40",
                bokeh: "bg-[#9b8fc7]/42" },
  dream:      { icon: "bg-[#6a5a8a]/32 text-[#dbcde6] border-[#6a5a8a]/60",
                tile: "bg-gradient-to-br from-[#6a5a8a]/30 via-[#9b8fc7]/16 to-[#d8b6ba]/6 border-[#6a5a8a]/45",
                bokeh: "bg-[#9b8fc7]/40" },
  // 樱粉柔软族
  violet:     { icon: "bg-[#8a5560]/34 text-[#e6c8cc] border-[#8a5560]/60",
                tile: "bg-gradient-to-br from-[#8a5560]/28 via-[#b87a80]/16 to-[#ffc4d3]/8 border-[#8a5560]/50",
                bokeh: "bg-[#ffc4d3]/35" },
  letter:     { icon: "bg-[#ffc4d3]/28 text-[#ffeaf0] border-[#ffc4d3]/65",
                tile: "bg-gradient-to-br from-[#ffc4d3]/26 via-[#ff7a8c]/14 to-[#ff7a8c]/4 border-[#ffc4d3]/45",
                bokeh: "bg-[#ff7a8c]/32" },
};

const ToolTile = ({ icon, title, desc, color, mascot }: { icon: string; title: string; desc: string; color: ToolColor; mascot?: string }) => {
  const s = toolStyles[color];
  return (
    <div
      className={`relative rounded-3xl p-4 aspect-square overflow-hidden border-2 backdrop-blur-md flex flex-col justify-between active:scale-[0.96] active:translate-y-[2px] transition-all ${s.tile}`}
      style={{
        // 卡通贴纸效果：顶部内嵌高光 + 底部内阴 + 实心偏移投影 + 软外阴
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.20), inset 0 -1.5px 0 rgba(0,0,0,0.25), 0 4px 0 rgba(0,0,0,0.32), 0 6px 16px -6px rgba(0,0,0,0.45)",
      }}
    >
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none ${s.bokeh}`} />

      {/* 卡通吉祥物：右上角倾斜浮起的大 emoji */}
      {mascot && (
        <span
          className="absolute top-2 right-2 text-[52px] leading-none select-none pointer-events-none z-10"
          style={{
            transform: 'rotate(-12deg)',
            filter:
              'drop-shadow(0 3px 5px rgba(0,0,0,0.45)) drop-shadow(0 0 12px rgba(255,255,255,0.12))',
          }}
        >
          {mascot}
        </span>
      )}

      <div
        className={`relative z-20 w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${s.icon}`}
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.20), 0 2px 0 rgba(0,0,0,0.22)",
        }}
      >
        <span className="text-[22px] leading-none drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">{icon}</span>
      </div>
      <div className="relative z-20">
        <h3 className="font-black text-white text-[16px] leading-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">{title}</h3>
        <p className="text-[11.5px] text-white/75 leading-snug mt-1 line-clamp-2">{desc}</p>
      </div>
    </div>
  );
};

const VirtualView = ({ onStartCall }: { onStartCall: () => void }) => {
  const [step, setStep] = useState<"upload" | "generating" | "ready">("upload");
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setStep("generating");
    let p = 0;
    const interval = window.setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => setStep("ready"), 300);
      }
    }, 100);
  };

  return (
    <div className="px-5 pt-14 pb-8 animate-msg h-full flex flex-col items-center relative">
      <div className="absolute top-10 w-full flex justify-center opacity-10 pointer-events-none">
        <div className="w-64 h-64 border border-cyan-500 rounded-full absolute mix-blend-screen animate-spin-slow" />
      </div>
      <h2 className="font-pixel text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mt-2 mb-1 text-center tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">PIXEL DIMENSION</h2>
      <p className="text-xs text-cyan-500/60 font-medium mb-10 tracking-widest uppercase">虚拟连线 · 跨越次元</p>

      <div className="flex-1 w-full flex flex-col items-center justify-center -mt-10">
        {step === "upload" && (
          <div className="flex flex-col items-center animate-msg">
            <div onClick={handleUpload} className="w-48 h-48 rounded-3xl glass-panel border-cyan-500/30 border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <Upload className="w-12 h-12 text-cyan-400 mb-4 group-hover:-translate-y-2 transition-transform" />
              <span className="text-sm font-bold text-white/80 tracking-wide">上传正脸照片</span>
              <span className="text-[10px] text-cyan-500/50 mt-2">生成专属 8-Bit 像素分身</span>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center w-full max-w-[240px] animate-msg">
            <div className="w-32 h-32 rounded-xl border border-cyan-500/50 overflow-hidden relative mb-8">
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover opacity-30" alt="scan" />
              <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" style={{ top: `${progress}%` }} />
              <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />
            </div>
            <div className="font-pixel text-[10px] text-cyan-300 mb-3 animate-pulse">GENERATING...</div>
            <div className="w-full h-2 bg-black/50 rounded-full border border-cyan-500/30 overflow-hidden p-0.5">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {step === "ready" && (
          <div className="flex flex-col items-center animate-msg">
            <div className="relative mb-8 group">
              <div className="absolute -inset-3 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
              <div className="w-40 h-40 rounded-full border-4 border-cyan-400/80 overflow-hidden relative shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                <img src="https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover pixelated-img" alt="pixel avatar" />
                <div className="pixel-grid-overlay opacity-50" />
              </div>
              <div className="absolute bottom-0 right-2 bg-[#050505] p-1.5 rounded-full border border-cyan-500/50">
                <Check className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="font-pixel text-[11px] text-cyan-300 mb-8 text-center leading-relaxed">
              AVATAR READY!<br />
              <span className="text-[8px] text-white/40">已成功生成像素宇宙分身</span>
            </div>
            <button onClick={onStartCall} className="w-full py-4 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Video className="w-5 h-5" /> 开始随机像素匹配
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MessagesView = ({
  onOpenChat,
  onOpenProfile,
}: {
  onOpenChat: (target: ChatTarget) => void;
  onOpenProfile: (profile: DetailProfile) => void;
}) => (
  <div className="px-5 pt-14 pb-8 animate-msg h-full flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-serif text-2xl font-bold">私密信箱</h2>
      <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center">
        <User className="w-4 h-4 text-pink-300" />
      </div>
    </div>
    <div className="mb-8">
      <div className="text-xs text-white/50 mb-3 ml-1 font-bold">专属伴侣 & 新匹配</div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <AvatarStory onClick={() => onOpenChat({ name: "苏菲(AI)", isAI: true })} img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" label="苏菲 (AI)" active />
        {previewUsers.map((profile) => (
          <AvatarStory
            key={profile.id}
            onClick={() => onOpenProfile(profile)}
            img={profile.photo || "/icon-192.png"}
            label={profile.displayName}
            badge={profile.unread}
          />
        ))}
      </div>
    </div>
    <div className="flex-1 space-y-2 overflow-y-auto pr-1">
      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-rose-500/30 shadow-sm cursor-pointer active:scale-[0.98] transition-transform" onClick={() => onOpenChat({ name: "苏菲 (专属 AI)", isAI: true })}>
        <div className="relative w-12 h-12 flex-shrink-0">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover rounded-full border border-rose-400/50" alt="AI" />
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-400 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">1</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="font-serif text-rose-200 font-bold text-[15px]">苏菲 (专属伴侣)</span>
            <span className="text-xs text-rose-300/60 font-medium">刚刚</span>
          </div>
          <p className="text-sm text-white/70 truncate font-medium">“晚上准备做什么呀，要不要视频连线？”</p>
        </div>
      </div>
      {previewUsers.map((profile) => (
        <button
          key={profile.id}
          onClick={() => onOpenProfile(profile)}
          className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-sm cursor-pointer active:scale-[0.98] transition-transform text-left"
        >
          <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full border border-white/20">
            <img src={profile.photo} className="w-full h-full object-cover" alt={profile.displayName} />
            {profile.online && <span className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#12060c]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif text-white font-bold text-[15px]">{profile.displayName}</span>
              <span className="text-xs text-white/40 font-medium">{profile.chatTime}</span>
            </div>
            <p className="text-sm text-white/62 truncate font-medium">{profile.chatPreview}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-1.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-400/20 text-[10px] text-pink-200 font-bold">{profile.compatibility}%</span>
            {!!profile.unread && <span className="w-4 h-4 rounded-full bg-pink-500 text-[10px] flex items-center justify-center text-white font-bold">{profile.unread}</span>}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const AvatarStory = ({ img, label, active, badge, onClick }: { img: string; label: string; active?: boolean; badge?: number; onClick?: () => void }) => (
  <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer" onClick={onClick}>
    <div className="relative w-16 h-16">
      {active && <div className="avatar-ring text-rose-400" />}
      <img src={img} className="w-full h-full object-cover rounded-full border-[2px] border-rose-400/50 relative z-10 shadow-md" alt={label} />
      {!!badge && <div className="absolute -top-1 -right-1 z-20 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">{badge}</div>}
      {active && (
        <div className="absolute -bottom-1 -right-1 z-20 w-5 h-5 bg-[#0d0508] rounded-full flex items-center justify-center border border-rose-500/30">
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-pulse" />
        </div>
      )}
    </div>
    <span className={`text-xs font-bold mt-1 ${active ? "text-rose-300" : "text-white/60"}`}>{label}</span>
  </div>
);

type ProfileSubView =
  | "main"
  | "login"
  | "membership"
  | "likes"
  | "matches"
  | "visitors"
  | "account"
  | "notifications"
  | "privacy"
  | "help"
  | "about";

const SubPageHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="flex items-center gap-3 pt-12 pb-4 px-4 border-b border-white/5">
    <button onClick={onBack} className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-white/80 active:scale-95">
      <ChevronLeft className="w-5 h-5" />
    </button>
    <h2 className="font-serif text-lg font-bold text-white flex-1">{title}</h2>
  </div>
);

const LoginView = ({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) => {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  const phoneValid = /^1\d{10}$/.test(phone);

  const sendCode = () => {
    if (!phoneValid) return;
    setStep("code");
    setCountdown(60);
  };

  const verify = () => {
    if (code.length === 6) onSuccess();
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#0b0508] animate-msg overflow-y-auto pb-24">
      <SubPageHeader title={step === "phone" ? "登录 / 注册" : "输入验证码"} onBack={step === "code" ? () => setStep("phone") : onBack} />
      <div className="px-6 pt-10">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/40 to-pink-500/40 border border-white/10 mx-auto flex items-center justify-center mb-5 shadow-xl shadow-purple-900/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white text-center mb-2">欢迎来到 Matchu</h3>
          <p className="text-xs text-white/50 text-center">AI 暖友一直在这里等你 💜</p>
        </div>

        {step === "phone" ? (
          <>
            <div className="glass-panel rounded-2xl p-4 mb-4 border-white/5 flex items-center gap-3">
              <span className="text-sm text-white/60 font-medium">+86</span>
              <div className="w-px h-5 bg-white/10" />
              <input
                type="tel"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="请输入手机号"
                className="flex-1 bg-transparent outline-none text-white text-[15px] font-medium placeholder:text-white/30"
              />
            </div>
            <button
              onClick={sendCode}
              disabled={!phoneValid}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all ${phoneValid ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-900/40 active:scale-[0.98]" : "bg-white/5 text-white/30"}`}
            >
              获取验证码
            </button>
            <p className="text-[10px] text-white/30 text-center mt-5 leading-relaxed px-4">
              登录即代表同意《用户协议》与《隐私政策》<br />
              未注册手机号将自动创建账号
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-white/50 mb-5 text-center">
              验证码已发送至 <span className="text-white font-bold">+86 {phone.slice(0, 3)}****{phone.slice(-4)}</span>
            </p>
            <div className="flex gap-2 justify-between mb-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-11 h-14 rounded-xl glass-panel border-white/10 flex items-center justify-center text-white text-xl font-bold ${code.length === i ? "border-purple-400/60 shadow-[0_0_14px_rgba(168,85,247,0.3)]" : ""}`}>
                  {code[i] ?? ""}
                </div>
              ))}
            </div>
            <input
              autoFocus
              type="tel"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setCode(v);
                if (v.length === 6) window.setTimeout(onSuccess, 200);
              }}
              className="absolute opacity-0 pointer-events-none"
            />
            <button
              onClick={verify}
              disabled={code.length !== 6}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm mb-3 transition-all ${code.length === 6 ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-900/40 active:scale-[0.98]" : "bg-white/5 text-white/30"}`}
            >
              确认登录
            </button>
            <button
              onClick={() => countdown === 0 && setCountdown(60)}
              disabled={countdown > 0}
              className={`w-full text-xs font-medium ${countdown > 0 ? "text-white/30" : "text-purple-300"}`}
            >
              {countdown > 0 ? `${countdown}s 后可重发` : "重新发送验证码"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

type MembershipPlan = {
  id: "month" | "quarter" | "year";
  name: string;
  price: number;
  original: number;
  unit: string;
  tag?: string;
  highlight?: boolean;
};

const membershipPlans: MembershipPlan[] = [
  { id: "month", name: "月度会员", price: 28, original: 38, unit: "元/月" },
  { id: "quarter", name: "季度会员", price: 68, original: 114, unit: "元/3月", tag: "省 40%", highlight: true },
  { id: "year", name: "年度会员", price: 198, original: 456, unit: "元/年", tag: "最划算" },
];

const membershipBenefits: Array<{ icon: React.ReactNode; title: string; desc: string }> = [
  { icon: <Sparkles className="w-5 h-5" />, title: "无限 AI 对话", desc: "不限次数与暖友聊天" },
  { icon: <Mic className="w-5 h-5" />, title: "AI 语音通话", desc: "解锁真人感语音陪伴" },
  { icon: <Heart className="w-5 h-5" />, title: "专属记忆", desc: "AI 会记住你的所有喜好" },
  { icon: <Eye className="w-5 h-5" />, title: "查看访客", desc: "谁看过你一目了然" },
  { icon: <Flame className="w-5 h-5" />, title: "每日超级喜欢", desc: "每天 5 次优先推荐" },
  { icon: <Gift className="w-5 h-5" />, title: "会员标识", desc: "尊贵皇冠身份标志" },
];

const MembershipView = ({ onBack }: { onBack: () => void }) => {
  const [selected, setSelected] = useState<"month" | "quarter" | "year">("quarter");
  const [payMethod, setPayMethod] = useState<"wechat" | "alipay">("wechat");
  const current = membershipPlans.find((p) => p.id === selected)!;

  return (
    <div className="absolute inset-0 z-40 bg-[#0b0508] animate-msg overflow-y-auto pb-24">
      <SubPageHeader title="SVIP 会员中心" onBack={onBack} />
      <div className="px-5 pt-5">
        <div className="w-full rounded-3xl vip-card-glow p-5 mb-6 shadow-xl shadow-red-900/10 border border-red-300/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-[#e3a891]/40 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="me" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-white">老大</span>
                <Crown className="w-4 h-4 text-[#e3a891]" />
              </div>
              <div className="text-[11px] text-[#e3a891]/80 font-medium mt-0.5">会员有效期至 2026.08.23</div>
            </div>
          </div>
          <div className="text-[11px] text-white/60 font-medium">已累计解锁 128 次 AI 语音 · 42 条专属记忆</div>
        </div>

        <h3 className="text-sm font-bold text-white/80 mb-3 px-1">选择套餐</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {membershipPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative rounded-2xl p-3 text-left transition-all ${selected === plan.id ? "bg-gradient-to-br from-[#e3a891]/25 to-[#b87c67]/15 border-2 border-[#e3a891]/70 shadow-lg shadow-[#e3a891]/20" : "glass-panel border-white/10 border-2"}`}
            >
              {plan.tag && (
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${plan.highlight ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : "bg-[#e3a891] text-[#2d1622]"}`}>
                  {plan.tag}
                </span>
              )}
              <div className="text-[11px] font-bold text-white/80 mb-2">{plan.name}</div>
              <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-[9px] text-[#e3a891]">¥</span>
                <span className="text-xl font-black text-[#e3a891] leading-none">{plan.price}</span>
              </div>
              <div className="text-[9px] text-white/40 line-through">原价 ¥{plan.original}</div>
              <div className="text-[9px] text-white/50 mt-0.5">{plan.unit}</div>
            </button>
          ))}
        </div>

        <h3 className="text-sm font-bold text-white/80 mb-3 px-1">会员专属权益</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {membershipBenefits.map((b, i) => (
            <div key={i} className="glass-panel rounded-2xl p-3 border-white/5 flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e3a891]/25 to-[#b87c67]/15 border border-[#e3a891]/30 flex items-center justify-center text-[#e3a891] flex-shrink-0">
                {b.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-white/90 mb-0.5">{b.title}</div>
                <div className="text-[10px] text-white/50 leading-snug">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-white/80 mb-3 px-1 text-center">支付方式</h3>
        <div className="grid grid-cols-2 gap-3 mb-5 max-w-[300px] mx-auto">
          {[
            { id: "wechat" as const, label: "微信支付", color: "from-green-500/25 to-green-600/10", icon: "💬" },
            { id: "alipay" as const, label: "支付宝", color: "from-blue-500/25 to-blue-600/10", icon: "🅰️" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setPayMethod(m.id)}
              className={`relative rounded-2xl py-3 px-2 flex flex-col items-center gap-1.5 transition-all border ${payMethod === m.id ? "border-[#e3a891]/70 bg-white/5 shadow-md shadow-[#e3a891]/15" : "border-white/10 glass-panel"}`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} border border-white/10 flex items-center justify-center text-base`}>
                {m.icon}
              </div>
              <span className="text-[11px] font-bold text-white/90">{m.label}</span>
            </button>
          ))}
        </div>

        <button className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-[#e3a891] to-[#b87c67] text-[#2d1622] shadow-xl shadow-[#e3a891]/30 active:scale-[0.98] flex items-center justify-center gap-2 mb-4">
          <CreditCard className="w-4 h-4" />
          立即支付 ¥{current.price}
        </button>

        <p className="text-[10px] text-white/30 text-center leading-relaxed px-3 pb-4">
          开通即同意《会员服务协议》，支持随时取消订阅。<br />
          自动续费可在"账号与安全"中关闭。
        </p>
      </div>
    </div>
  );
};

const UserListView = ({ title, users, emptyHint, onBack }: { title: string; users: PreviewUser[]; emptyHint: string; onBack: () => void }) => (
  <div className="absolute inset-0 z-40 bg-[#0b0508] animate-msg overflow-y-auto pb-24">
    <SubPageHeader title={title} onBack={onBack} />
    <div className="px-4 pt-4 pb-8">
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 text-white/40">
          <Heart className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-sm font-medium">{emptyHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {users.map((u) => (
            <div key={u.id} className="glass-panel rounded-2xl overflow-hidden border-white/5 relative group">
              <div className="aspect-[3/4] relative">
                {u.photo ? (
                  <img src={u.photo} alt={u.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${u.avatarGradientFrom}, ${u.avatarGradientTo})` }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {u.online && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/80 text-[9px] font-bold text-white backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> 在线
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm font-bold text-white truncate">{u.displayName}</span>
                    <span className="text-[10px] text-white/70 font-medium">{u.age}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/60">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="truncate">{u.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const SimpleSubView = ({ title, children, onBack }: { title: string; children: React.ReactNode; onBack: () => void }) => (
  <div className="absolute inset-0 z-40 bg-[#0b0508] animate-msg overflow-y-auto pb-24">
    <SubPageHeader title={title} onBack={onBack} />
    <div className="px-5 pt-5 pb-8">{children}</div>
  </div>
);

type SettingsTone = "pink" | "purple" | "sky" | "indigo" | "amber" | "emerald" | "cyan" | "rose" | "fuchsia" | "teal";

type ToneStyle = { icon: string; glow: string; particle: string };

// 收敛到烛光暖调（参见 globals.css 主色 token）：珊瑚粉 / 暖玫瑰 / 琥珀金 / 金 / 暖紫灰 / 深紫玫瑰
// 仍以 tone 名区分行，但全部锁在恋爱暖色谱内，确保和首页 / 匹配页一致
const settingsToneStyles: Record<SettingsTone, ToneStyle> = {
  pink:     { icon: "text-[#ff8f6b]", glow: "rgba(255,143,107,0.55)", particle: "#ffb398" }, // 珊瑚粉 · 主色
  rose:     { icon: "text-[#ff7a8c]", glow: "rgba(255,122,140,0.55)", particle: "#ffa3b1" }, // 暖玫瑰
  fuchsia:  { icon: "text-[#e0879b]", glow: "rgba(224,135,155,0.55)", particle: "#f0aebd" }, // 玫瑰粉
  purple:   { icon: "text-[#c89aa0]", glow: "rgba(184,122,128,0.55)", particle: "#d8b6ba" }, // 暖紫灰
  indigo:   { icon: "text-[#b08086]", glow: "rgba(138,85,96,0.55)",   particle: "#c79aa1" }, // 深紫玫瑰
  amber:    { icon: "text-[#ffd176]", glow: "rgba(255,209,118,0.60)", particle: "#ffe1a3" }, // 金
  cyan:     { icon: "text-[#e8b86f]", glow: "rgba(232,184,111,0.55)", particle: "#f0cd92" }, // 琥珀金
  sky:      { icon: "text-[#d4a870]", glow: "rgba(212,168,112,0.55)", particle: "#e2c094" }, // 淡金
  teal:     { icon: "text-[#dba87a]", glow: "rgba(219,168,122,0.55)", particle: "#e8c2a0" }, // 暖驼
  emerald:  { icon: "text-[#c89b6a]", glow: "rgba(200,155,106,0.55)", particle: "#dab891" }, // 暖驼金
};

const dangerToneStyle: ToneStyle = {
  icon: "text-[#ff7a8c]",
  glow: "rgba(255,122,140,0.55)",
  particle: "#ffa3b1",
};

const SettingsRow = ({ icon, title, desc, onClick, danger, chevron = true, right, tone }: { icon?: React.ReactNode; title: string; desc?: string; onClick?: () => void; danger?: boolean; chevron?: boolean; right?: React.ReactNode; tone?: SettingsTone }) => {
  const [burst, setBurst] = useState(0);
  const style: ToneStyle | null = danger ? dangerToneStyle : tone ? settingsToneStyles[tone] : null;

  const sizedIcon = (() => {
    if (!React.isValidElement(icon)) return icon;
    const el = icon as React.ReactElement<{ className?: string }>;
    const original = el.props.className ?? "";
    const resized =
      original
        .replace(/\bw-\d+(\.\d+)?\b/g, "w-7")
        .replace(/\bh-\d+(\.\d+)?\b/g, "h-7") || "w-7 h-7";
    return React.cloneElement(el, { className: resized });
  })();

  const handleClick = () => {
    if (!onClick) return;
    setBurst((b) => b + 1);
    window.setTimeout(() => onClick(), 260);
  };

  return (
    <button
      onClick={onClick ? handleClick : undefined}
      className="w-full flex items-center gap-3 px-4 py-3.5 glass-panel border-white/5 active:bg-white/5 active:scale-[0.99] transition-all"
    >
      {icon && (
        <div className="relative flex-shrink-0 w-11 h-11 flex items-center justify-center">
          {style && (
            <div
              className="absolute inset-0 rounded-full blur-md opacity-20 pointer-events-none"
              style={{ background: style.glow }}
            />
          )}
          <motion.span
            className={`relative ${style?.icon ?? "text-white/70"}`}
            style={style ? { filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.4))` } : undefined}
            animate={burst > 0 ? { scale: [1, 0.82, 1.15, 1] } : undefined}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {sizedIcon}
          </motion.span>

          {burst > 0 && style && (
            <div key={burst} className="absolute left-1/2 top-1/2 pointer-events-none">
              <motion.span
                initial={{ scale: 0.3, opacity: 0.7, x: "-50%", y: "-50%" }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute w-11 h-11 rounded-full border-2"
                style={{ borderColor: style.particle, boxShadow: `0 0 14px ${style.particle}` }}
              />
              <motion.span
                initial={{ scale: 0.2, opacity: 0.55, x: "-50%", y: "-50%" }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute w-11 h-11 rounded-full"
                style={{ background: `radial-gradient(circle, ${style.particle} 0%, transparent 70%)` }}
              />
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i / 10) * Math.PI * 2 + (i % 2 === 0 ? 0.15 : -0.15);
                const dist = 26 + (i % 3) * 8;
                const size = i % 3 === 0 ? 7 : i % 3 === 1 ? 5 : 4;
                return (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
                    animate={{
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist,
                      opacity: 0,
                      scale: 1,
                    }}
                    transition={{ duration: 0.65 + (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.02 }}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      marginLeft: -size / 2,
                      marginTop: -size / 2,
                      background: style.particle,
                      boxShadow: `0 0 6px ${style.particle}`,
                    }}
                  />
                );
              })}
              <motion.span
                initial={{ y: 0, opacity: 0, scale: 0.5, x: "-50%" }}
                animate={{ y: -34, opacity: [0, 1, 1, 0], scale: 1.1 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                className="absolute text-[14px] leading-none"
              >
                ✨
              </motion.span>
            </div>
          )}
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <div className={`text-[13px] font-bold ${danger ? "text-rose-400" : "text-white/90"}`}>{title}</div>
        {desc && <div className="text-[10px] text-white/40 mt-0.5 truncate">{desc}</div>}
      </div>
      {right}
      {chevron && !right && <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />}
    </button>
  );
};

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`w-10 h-6 rounded-full transition-colors ${on ? "bg-purple-500" : "bg-white/15"} flex items-center px-0.5`}>
    <span className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${on ? "translate-x-4" : "translate-x-0"}`} />
  </button>
);

const ProfileView = () => {
  const [subView, setSubView] = useState<ProfileSubView>("main");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifAI, setNotifAI] = useState(true);
  const [notifNight, setNotifNight] = useState(false);
  const [privHideOnline, setPrivHideOnline] = useState(false);
  const [privIncognito, setPrivIncognito] = useState(false);
  const [privAutoRenew, setPrivAutoRenew] = useState(true);

  const likedUsers = previewUsers.slice(0, 6);
  const matchedUsers = previewUsers.slice(1, 5);
  const visitors = previewUsers.slice(2, 8);

  const goBack = () => setSubView("main");

  if (subView === "login")
    return <LoginView onBack={goBack} onSuccess={() => { setIsLoggedIn(true); goBack(); }} />;
  if (subView === "membership") return <MembershipView onBack={goBack} />;
  if (subView === "likes")
    return <UserListView title={`我喜欢的人 · ${likedUsers.length}`} users={likedUsers} emptyHint="还没喜欢过任何人" onBack={goBack} />;
  if (subView === "matches")
    return <UserListView title={`我的匹配 · ${matchedUsers.length}`} users={matchedUsers} emptyHint="继续划动，遇见对的人" onBack={goBack} />;
  if (subView === "visitors")
    return <UserListView title={`谁看过我 · ${visitors.length}`} users={visitors} emptyHint="暂时还没有访客" onBack={goBack} />;

  if (subView === "account")
    return (
      <SimpleSubView title="账号与安全" onBack={goBack}>
        <div className="space-y-2">
          <SettingsRow tone="sky" icon={<Phone className="w-5 h-5" />} title="手机号" desc="138****2341" />
          <SettingsRow tone="purple" icon={<User className="w-5 h-5" />} title="昵称" desc="老大" />
          <SettingsRow tone="teal" icon={<MapPin className="w-5 h-5" />} title="所在城市" desc="上海" />
          <SettingsRow tone="indigo" icon={<Lock className="w-5 h-5" />} title="修改密码" />
          <SettingsRow tone="emerald" icon={<Shield className="w-5 h-5" />} title="实名认证" desc="已认证" right={<Check className="w-4 h-4 text-emerald-400" />} chevron={false} />
          <SettingsRow tone="amber" icon={<CreditCard className="w-5 h-5" />} title="自动续费" desc="SVIP 到期自动续费" right={<Toggle on={privAutoRenew} onToggle={() => setPrivAutoRenew(!privAutoRenew)} />} chevron={false} />
          <SettingsRow icon={<X className="w-5 h-5" />} title="注销账号" danger />
        </div>
      </SimpleSubView>
    );

  if (subView === "notifications")
    return (
      <SimpleSubView title="通知设置" onBack={goBack}>
        <div className="space-y-2">
          <SettingsRow tone="amber" icon={<Bell className="w-7 h-7 fill-current" />} title="推送通知" desc="消息、匹配、暖友提醒" right={<Toggle on={notifPush} onToggle={() => setNotifPush(!notifPush)} />} chevron={false} />
          <SettingsRow tone="fuchsia" icon={<Sparkles className="w-5 h-5" />} title="AI 暖友消息" desc="AI 主动关心你时提醒" right={<Toggle on={notifAI} onToggle={() => setNotifAI(!notifAI)} />} chevron={false} />
          <SettingsRow tone="indigo" icon={<Moon className="w-7 h-7 fill-current" />} title="夜间免打扰" desc="22:00 - 8:00 不提醒" right={<Toggle on={notifNight} onToggle={() => setNotifNight(!notifNight)} />} chevron={false} />
        </div>
      </SimpleSubView>
    );

  if (subView === "privacy")
    return (
      <SimpleSubView title="隐私设置" onBack={goBack}>
        <div className="space-y-2">
          <SettingsRow tone="sky" icon={<Eye className="w-5 h-5" />} title="隐身在线" desc="不显示在线状态" right={<Toggle on={privHideOnline} onToggle={() => setPrivHideOnline(!privHideOnline)} />} chevron={false} />
          <SettingsRow tone="emerald" icon={<Shield className="w-5 h-5" />} title="匿名浏览" desc="不留下访客记录（SVIP）" right={<Toggle on={privIncognito} onToggle={() => setPrivIncognito(!privIncognito)} />} chevron={false} />
          <SettingsRow tone="rose" icon={<Lock className="w-5 h-5" />} title="黑名单" desc="0 人" />
          <SettingsRow tone="purple" icon={<User className="w-5 h-5" />} title="屏蔽的用户" desc="0 人" />
        </div>
      </SimpleSubView>
    );

  if (subView === "help")
    return (
      <SimpleSubView title="帮助与反馈" onBack={goBack}>
        <div className="space-y-2">
          <SettingsRow tone="cyan" icon={<HelpCircle className="w-5 h-5" />} title="常见问题" />
          <SettingsRow tone="fuchsia" icon={<MessageSquare className="w-7 h-7 fill-current" />} title="意见反馈" desc="告诉我们你的想法" />
          <SettingsRow tone="emerald" icon={<Phone className="w-5 h-5" />} title="联系客服" desc="9:00 - 23:00 在线" />
        </div>
      </SimpleSubView>
    );

  if (subView === "about")
    return (
      <SimpleSubView title="关于 Matchu" onBack={goBack}>
        <div className="flex flex-col items-center py-8 mb-6">
          <div className="relative mb-4">
            <div className="absolute -inset-2 bg-purple-500/30 blur-xl rounded-full animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 border border-white/20 flex items-center justify-center shadow-2xl shadow-purple-900/40">
              <Sparkles className="w-10 h-10 text-white drop-shadow-md" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-white mb-1">Matchu</div>
          <div className="text-[11px] text-white/50 font-medium">v1.0.0 · AI 陪伴社交 💜</div>
        </div>
        <div className="space-y-2">
          <SettingsRow tone="indigo" icon={<Info className="w-5 h-5" />} title="用户协议" />
          <SettingsRow tone="emerald" icon={<Shield className="w-5 h-5" />} title="隐私政策" />
          <SettingsRow tone="pink" icon={<Heart className="w-7 h-7 fill-current" />} title="给我们好评" />
        </div>
      </SimpleSubView>
    );

  if (!isLoggedIn) {
    return (
      <div className="px-5 pt-14 pb-8 animate-msg flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 mb-6 flex items-center justify-center">
          <User className="w-10 h-10 text-white/40" />
        </div>
        <h2 className="font-serif text-xl font-bold text-white mb-2">你还没有登录</h2>
        <p className="text-xs text-white/50 text-center mb-8 px-6 leading-relaxed">
          登录后可以收藏喜欢的人、<br />查看谁看过你、解锁 AI 暖友陪伴
        </p>
        <button
          onClick={() => setSubView("login")}
          className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-900/40 active:scale-[0.98]"
        >
          立即登录 / 注册
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-8 animate-msg flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 shadow-md overflow-hidden">
          <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Me" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-serif text-2xl font-bold text-[#fdf8fa]">老大</h2>
            <Crown className="w-4 h-4 text-[#e3a891]" />
          </div>
          <p className="text-xs text-white/50 font-medium flex items-center gap-1">
            ID: 893204 · <MapPin className="w-3 h-3" /> 上海
          </p>
        </div>
        <button onClick={() => setSubView("account")} className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-white/60 active:scale-95">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={() => setSubView("membership")}
        className="relative w-full rounded-3xl vip-card-glow p-5 mb-6 text-left active:scale-[0.985] transition-transform"
      >
        {/* 拟态暖光波浪层（玫瑰 + 金双层流动） */}
        <svg
          className="absolute left-0 right-0 bottom-0 w-[200%] h-20 vip-wave-rose pointer-events-none opacity-40 mix-blend-screen"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="vipWaveRose" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ff8f6b" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ff7a8c" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path d="M0 50 Q 150 14 300 50 T 600 50 T 900 50 T 1200 50 V 80 H 0 Z" fill="url(#vipWaveRose)" />
        </svg>
        <svg
          className="absolute left-0 right-0 bottom-0 w-[200%] h-16 vip-wave-gold pointer-events-none opacity-30 mix-blend-screen"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="vipWaveGold" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ffd176" stopOpacity="0.9" />
              <stop offset="1" stopColor="#e8b86f" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d="M0 30 Q 200 70 400 30 T 800 30 T 1200 30 V 80 H 0 Z" fill="url(#vipWaveGold)" />
        </svg>
        {/* 角落金色 bokeh */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#ffd176] opacity-[0.12] blur-3xl pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-[#ffd9a8]">
            <Crown
              className="w-5 h-5"
              style={{ filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.5)) drop-shadow(0 0 8px rgba(255,209,118,0.55))' }}
            />
            <span
              className="font-serif font-black text-[15px] tracking-widest"
              style={{ textShadow: '0 1px 0 rgba(0,0,0,0.45)' }}
            >
              SVIP 尊享会员
            </span>
          </div>
          <span className="text-[10px] text-[#e3a891]/80 font-medium">到期 08.23</span>
        </div>
        <div className="relative z-10 flex justify-between items-end">
          <div
            className="text-[10px] text-[#ffd9a8]/85 font-bold"
            style={{ textShadow: '0 1px 0 rgba(0,0,0,0.4)' }}
          >
            解锁无限制 AI 语音与专属记忆
          </div>
          <span className="vip-renew-btn px-4 py-1.5 text-[#3a1a1f] text-xs font-black rounded-full">续费</span>
        </div>
      </button>

      <div className="space-y-2 mb-3">
        <SettingsRow
          tone="pink"
          icon={<Heart className="w-7 h-7 fill-current" />}
          title="我喜欢的人"
          desc={`${likedUsers.length} 人 · 等 TA 也喜欢你`}
          onClick={() => setSubView("likes")}
        />
        <SettingsRow
          tone="fuchsia"
          icon={<Users className="w-5 h-5" />}
          title="我的匹配"
          desc={`${matchedUsers.length} 对心动连线`}
          onClick={() => setSubView("matches")}
        />
        <SettingsRow
          tone="sky"
          icon={<Eye className="w-5 h-5" />}
          title="谁看过我"
          desc={`${visitors.length} 位访客（SVIP 可见）`}
          onClick={() => setSubView("visitors")}
        />
      </div>

      <div className="space-y-2 mb-3">
        <SettingsRow tone="indigo" icon={<User className="w-5 h-5" />} title="账号与安全" onClick={() => setSubView("account")} />
        <SettingsRow tone="amber" icon={<Bell className="w-7 h-7 fill-current" />} title="通知设置" onClick={() => setSubView("notifications")} />
        <SettingsRow tone="emerald" icon={<Shield className="w-5 h-5" />} title="隐私设置" onClick={() => setSubView("privacy")} />
        <SettingsRow tone="cyan" icon={<HelpCircle className="w-5 h-5" />} title="帮助与反馈" onClick={() => setSubView("help")} />
        <SettingsRow tone="purple" icon={<Sparkles className="w-5 h-5" />} title="关于 Matchu" onClick={() => setSubView("about")} />
      </div>

      <button
        onClick={() => setIsLoggedIn(false)}
        className="w-full py-3 rounded-2xl text-[13px] font-bold text-rose-400 glass-panel border-rose-500/20 active:bg-rose-500/10 flex items-center justify-center gap-2 mt-3"
      >
        <LogOut className="w-4 h-4" />
        退出登录
      </button>
    </div>
  );
};

const ProfileDetailModal = ({
  profile,
  onClose,
  onChat,
}: {
  profile: DetailProfile;
  onClose: () => void;
  onChat: () => void;
}) => {
  const detailLines = buildProfileDetails(profile);

  return (
    <div className="absolute inset-0 z-50 bg-[#0b0508] flex flex-col animate-msg overflow-hidden">
      <div className="absolute inset-0 opacity-40 blur-3xl">
        <img src={profile.photo} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="relative h-[430px] overflow-hidden">
          <img src={profile.photo} alt={profile.displayName} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0508] via-black/20 to-black/35" />

          <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
            <button onClick={onClose} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white active:scale-95">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/80 active:scale-95">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute left-5 right-5 bottom-6 text-white">
            <div className="flex items-end justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-serif text-4xl font-black drop-shadow-lg">{profile.displayName}</h2>
                  <span className="text-xl font-semibold text-white/85">{profile.age}</span>
                  {profile.verified && <Check className="w-5 h-5 text-pink-300 drop-shadow" />}
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {profile.location} · {profile.distance}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl glass-panel flex flex-col items-center justify-center border-pink-300/30">
                <span className="text-[10px] text-pink-200">契合</span>
                <span className="text-2xl font-black text-pink-200">{profile.compatibility}%</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/90 font-medium">{profile.bio}</p>
          </div>
        </div>

        <div className="relative z-10 px-5 pb-28 -mt-2 space-y-4">
          <div className="glass-panel rounded-3xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-pink-300/70 font-bold">PROFILE</div>
                <h3 className="font-serif text-xl font-black text-white mt-1">{profile.profession} · {profile.mbti}</h3>
              </div>
              {profile.online && <span className="px-2.5 py-1 rounded-full bg-green-400/12 border border-green-300/25 text-[10px] text-green-200 font-bold">在线</span>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {detailLines.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/6 border border-white/10 p-3">
                  <div className="text-[10px] text-white/42 mb-1">{item.label}</div>
                  <div className="text-xs text-white/90 font-bold leading-snug">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-pink-300" />
              <h3 className="text-sm font-bold text-white">AI 心动解读</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/78">
              你们的共同点在「{profile.tags[0]?.label}」和「{profile.tags[1]?.label}」上很明显。适合用轻松的问题开场，先接住她的兴趣，再把话题慢慢落到一次具体见面。
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/35 font-bold mb-3">TAGS</div>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span key={tag.label} className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-xs text-white/85 font-medium">
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white mb-1">适合这样开场</div>
                <p className="text-xs text-white/60 leading-relaxed">“看到你也喜欢{profile.tags[0]?.label}，突然有点想知道你最近被什么打动过。”</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-300/30 flex items-center justify-center text-pink-200">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-4 right-4 bottom-5 z-20 grid grid-cols-[1fr_1.4fr] gap-3">
        <button onClick={onClose} className="h-[52px] py-3 rounded-2xl glass-panel text-white/75 font-bold active:scale-95">继续看看</button>
        <button onClick={onChat} className="h-[52px] py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-[0_10px_28px_rgba(255,94,160,0.35)] active:scale-95 flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" /> 去聊天
        </button>
      </div>
    </div>
  );
};

function buildProfileDetails(profile: DetailProfile) {
  return [
    { label: "身份", value: profile.profession },
    { label: "人格", value: profile.mbti },
    { label: "距离", value: profile.distance },
    { label: "城市", value: profile.location },
    { label: "状态", value: profile.online ? "刚刚活跃" : "最近在线" },
    { label: "信号", value: profile.verified ? "已认证" : "待了解" },
  ];
}

const PixelVideoCallModal = ({ onClose }: { onClose: () => void }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setTimer((v) => v + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col overflow-hidden animate-msg font-pixel text-white">
      <div className="crt-scanlines" />
      <div className="pixel-grid-overlay" />
      <div className="absolute inset-0 z-0 bg-[#0a1118]">
        <img src="https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover pixelated-img opacity-80" alt="partner video" />
      </div>
      <div className="relative z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
          <span className="text-[10px] tracking-widest">REC {formatTime(timer)}</span>
        </div>
        <div className="text-[10px] text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]">AI.LINK // MATCHED</div>
      </div>
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-none">
        <div className="px-4 py-2 border-2 border-cyan-500/50 bg-black/40 backdrop-blur-sm text-[12px] text-cyan-300 mt-32 animate-pulse">“能看清我的新样子吗？”</div>
      </div>
      <div className="absolute right-4 bottom-32 w-28 h-36 border-2 border-cyan-400 bg-black z-20 shadow-[0_0_15px_rgba(34,211,238,0.5)] overflow-hidden rounded-md">
        <img src="https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover pixelated-img" alt="my video" />
        <div className="absolute bottom-1 left-2 text-[8px] bg-black/60 px-1">YOU</div>
      </div>
      <div className="relative z-20 h-28 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-8 px-6">
        <button className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-md active:scale-95">
          <Mic className="w-5 h-5 text-white" />
        </button>
        <button onClick={onClose} className="w-16 h-16 rounded-full bg-red-600 border-2 border-red-400 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] active:scale-95 hover:bg-red-500 transition-colors">
          <Phone className="w-7 h-7 text-white transform rotate-[135deg]" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-md active:scale-95">
          <SwitchCamera className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

const callGeminiWithRetry = async (payload: unknown, retries = 5): Promise<string> => {
  const apiKey = "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "我不太明白你的意思...";
    } catch {
      if (i === retries - 1) return "抱歉，我现在有点累，稍后再聊吧。(网络错误)";
      await new Promise((res) => window.setTimeout(res, delay));
      delay *= 2;
    }
  }
  return "我不太明白你的意思...";
};

const ChatModal = ({ target, onClose }: { target: ChatTarget; onClose: () => void }) => {
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { id: 1, type: "model", text: "你终于来啦。", time: "23:14" },
    { id: 2, type: "model", text: target?.isAI ? "今天遇到什么开心的事了吗？想听你分享...(๑• . •๑)" : "Hi, 很高兴匹配到你！", time: "23:14" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    const newMsg: ChatMessage = { id: Date.now(), type: "user", text: userText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMsgs((prev) => [...prev, newMsg]);
    setInput("");

    if (target?.isAI) {
      setIsTyping(true);
      const contents = msgs
        .map((m) => ({
          role: m.type === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }))
        .concat([{ role: "user", parts: [{ text: userText }] }]);

      const payload = {
        contents,
        systemInstruction: {
          parts: [
            {
              text: "你是一个温柔、懂情绪的AI伴侣。你的名字叫苏菲。用户通常称呼你，你称呼用户为“老大”。请用简短、有温度的中文回复，不要像机器人，要像真实的暧昧对象一样交流，字数尽量简短，偶尔带点可爱的颜文字。",
            },
          ],
        },
      };

      const aiText = await callGeminiWithRetry(payload);
      setMsgs((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "model",
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    } else {
      setIsTyping(true);
      window.setTimeout(() => {
        setMsgs((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "model",
            text: "哈哈，确实是这样！",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const bgImage = target?.isAI
    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    : "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="absolute inset-0 z-50 bg-[#12060c] flex flex-col animate-msg">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <img src={bgImage} className="w-full h-full object-cover blur-[40px] opacity-50" alt="bg" />
      </div>
      <div className="relative z-10 glass-panel border-x-0 border-t-0 border-b border-white/10 pt-12 pb-3 px-4 flex items-center justify-between shadow-sm">
        <button onClick={onClose} className="p-2 -ml-2 text-white/70 active:scale-95">
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-serif font-black text-white">{target?.name}</span>
          {target?.isAI && <span className="text-[10px] text-pink-400 font-bold">{isTyping ? "正在输入..." : "在线"}</span>}
        </div>
        <button className="p-2 -mr-2 text-white/70 active:scale-95">
          <Phone className="w-5 h-5" />
        </button>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6">
        <div className="text-center text-xs text-white/40 font-medium my-4">昨天 23:14</div>
        {target?.isAI && (
          <div className="flex justify-center mb-6">
            <div className="bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full text-[10px] text-pink-300 font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(255,105,180,0.1)]">
              <Heart className="w-3 h-3 fill-pink-400/80 text-pink-400" /> 当前亲密等级: Lv.8 满心欢喜
            </div>
          </div>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"} animate-msg`}>
            {m.type === "model" && <img src={bgImage} className="w-8 h-8 rounded-full mr-2 self-end shadow-sm object-cover border border-white/20" alt="avatar" />}
            <div className={`max-w-[75%] p-3.5 text-[15px] leading-relaxed shadow-lg font-medium ${m.type === "user" ? "bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl rounded-br-sm text-white border border-pink-400/50" : "glass-panel rounded-2xl rounded-bl-sm text-white/90 border border-white/10"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-msg">
            <img src={bgImage} className="w-8 h-8 rounded-full mr-2 self-end shadow-sm object-cover border border-white/20" alt="avatar" />
            <div className="glass-panel p-3.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="relative z-10 p-4 glass-panel border-x-0 border-b-0 border-t border-white/10 pb-8 md:pb-4 shadow-[0_-4px_20px_rgba(255,94,160,0.05)]">
        <div className="flex items-end gap-2">
          <button className="p-3 text-white/60 bg-white/5 border border-white/10 rounded-full">
            <Mic className="w-5 h-5" />
          </button>
          <div className="flex-1 glass-input rounded-2xl flex items-center min-h-[44px] px-4 bg-black/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={target?.isAI ? "对她呢喃..." : "发送消息..."}
              className="w-full bg-transparent text-white font-medium outline-none text-sm placeholder:text-white/40"
              disabled={isTyping}
            />
          </div>
          <button onClick={handleSend} disabled={isTyping} className={`p-3 rounded-full transition-colors border shadow-sm ${input.trim() && !isTyping ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400" : "bg-white/5 text-white/40 border-white/10"}`}>
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TabBar = ({ activeTab, setActiveTab }: { activeTab: TabId; setActiveTab: (tab: TabId) => void }) => {
  const tabs: Array<{ id: TabId; icon: typeof Layers; label: string; isCenter?: boolean }> = [
    { id: "match", icon: Layers, label: "邂逅" },
    { id: "explore", icon: Moon, label: "社区" },
    { id: "virtual", icon: Zap, label: "连线", isCenter: true },
    { id: "messages", icon: MessageSquare, label: "消息" },
    { id: "profile", icon: User, label: "我的" },
  ];

  return (
    <div className="absolute bottom-6 left-4 right-4 h-[68px] glass-panel rounded-[2rem] flex items-center justify-between px-2 z-40 bg-[#000000]/60 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        if (tab.isCenter) {
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative flex flex-col items-center justify-center w-16 h-16 -mt-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg border-2 ${isActive ? "bg-cyan-500 border-cyan-300 shadow-[0_0_20px_#22d3ee]" : "bg-gradient-to-br from-pink-500 to-purple-600 border-pink-300/50 shadow-pink-500/50"}`}>
                <Icon className="w-6 h-6 text-white fill-white/20" strokeWidth={2.5} />
              </div>
              <span className={`mt-1 text-[10px] font-bold ${isActive ? "text-cyan-400" : "text-white/60"}`}>{tab.label}</span>
            </button>
          );
        }
        return (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative flex flex-col items-center justify-center w-12 h-14 transition-all duration-300">
            <Icon className={`w-[22px] h-[22px] mb-1 transition-colors duration-300 ${isActive ? "text-pink-400 fill-pink-500/20" : "text-[#8a6b7d]"}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-bold transition-colors duration-300 ${isActive ? "text-pink-300" : "text-[#8a6b7d]"}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
