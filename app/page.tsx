"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  Heart,
  User,
  Mic,
  Send,
  ChevronLeft,
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
      background: linear-gradient(135deg, #2d1622 0%, #170710 100%);
      position: relative;
      overflow: hidden;
    }
    .vip-card-glow::after {
      content: '';
      position: absolute;
      top: -50%; left: -50%; width: 200%; height: 200%;
      background: linear-gradient(to right, rgba(255,182,193,0) 0%, rgba(255,182,193,0.15) 50%, rgba(255,182,193,0) 100%);
      transform: rotate(30deg);
      animation: sweep 6s infinite linear;
    }
    @keyframes sweep {
      0% { transform: translateX(-100%) rotate(30deg); }
      100% { transform: translateX(100%) rotate(30deg); }
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
        return "from-[#1a1325] to-[#0a0710]";
      case "virtual":
        return "from-[#0a171c] to-[#04080a]";
      case "messages":
        return "from-[#1f1118] to-[#0d0508]";
      case "profile":
        return "from-[#1c1511] to-[#0a0604]";
    }
  };

  const getOrbColors = (tab: TabId) => {
    switch (tab) {
      case "match":
        return ["bg-pink-500/20", "bg-rose-500/20"];
      case "explore":
        return ["bg-indigo-500/20", "bg-purple-500/20"];
      case "virtual":
        return ["bg-cyan-500/15", "bg-emerald-500/15"];
      case "messages":
        return ["bg-rose-500/20", "bg-pink-500/20"];
      case "profile":
        return ["bg-orange-500/10", "bg-red-500/10"];
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
  const [flyDirection, setFlyDirection] = useState<"left" | "right" | null>(null);
  const [lastAction, setLastAction] = useState<"like" | "pass" | "super" | null>(null);
  const featured = matchOrder[profileIndex % matchOrder.length];
  const nextProfiles = Array.from({ length: Math.min(3, matchOrder.length - 1) }, (_, i) => matchOrder[(profileIndex + i + 1) % matchOrder.length]);

  const moveNext = (action: "like" | "pass" | "super") => {
    if (flyDirection) return;
    setLastAction(action);
    setFlyDirection(action === "pass" ? "left" : "right");
    window.setTimeout(() => {
      setProfileIndex((idx) => (idx + 1) % matchOrder.length);
      setFlyDirection(null);
    }, 320);
  };

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

      <div className="flex-1 relative w-full">
        {nextProfiles.slice(0, 2).reverse().map((profile, stackIndex) => (
          <div
            key={profile.id}
            className="absolute inset-0 glass-panel rounded-[32px] overflow-hidden shadow-2xl shadow-black/30"
            style={{
              transform: `scale(${0.93 + stackIndex * 0.035}) translateY(${18 - stackIndex * 8}px)`,
              opacity: 0.46 + stackIndex * 0.22,
            }}
          >
            <img src={profile.photo} alt={profile.displayName} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>
        ))}

        <AnimatePresence mode="wait">
          <SwipeProfileCard
            key={featured.id}
            profile={featured}
            flyDirection={flyDirection}
            onOpenProfile={onOpenProfile}
            onSwipe={moveNext}
          />
        </AnimatePresence>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 px-3 py-1.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-xl text-[10px] text-white/55 font-bold pointer-events-none">
          ← 不喜欢　右滑喜欢 →
        </div>
      </div>

      {lastAction && (
        <div className="mt-3 text-center text-[11px] text-white/55 font-bold h-4">
          {lastAction === "like" ? "已喜欢，等待对方回应" : lastAction === "pass" ? "已跳过，继续为你推荐" : "已发送超级喜欢"}
        </div>
      )}

      <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
        {nextProfiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onOpenProfile(profile)}
            className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0 border border-white/12 bg-white/5"
          >
            <img src={profile.photo} alt={profile.displayName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-bold text-white truncate">{profile.displayName}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-center items-center gap-6 mt-4 pb-4">
        <button onClick={() => moveNext("pass")} className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white/50 hover:bg-white/10 transition-all hover:scale-105">
          <X className="w-6 h-6" />
        </button>
        <button onClick={() => moveNext("like")} className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-[0_8px_20px_rgba(255,94,160,0.4)] hover:scale-105 transition-all border border-pink-400">
          <Heart className="w-7 h-7 fill-white" />
        </button>
        <button onClick={() => moveNext("super")} className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-yellow-400 hover:bg-white/10 transition-all hover:scale-105">
          <Sparkles className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const SwipeProfileCard = ({
  profile,
  flyDirection,
  onOpenProfile,
  onSwipe,
}: {
  profile: DetailProfile;
  flyDirection: "left" | "right" | null;
  onOpenProfile: (profile: DetailProfile) => void;
  onSwipe: (action: "like" | "pass") => void;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 0, 180], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [32, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -32], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 glass-panel rounded-[32px] overflow-hidden shadow-2xl shadow-pink-900/20 text-left cursor-grab active:cursor-grabbing touch-none"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      style={{ x, rotate }}
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: flyDirection === "left" ? -520 : flyDirection === "right" ? 520 : 0,
        rotate: flyDirection === "left" ? -24 : flyDirection === "right" ? 24 : 0,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      onDragEnd={(_, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        if (offset > 115 || velocity > 700) onSwipe("like");
        else if (offset < -115 || velocity < -700) onSwipe("pass");
      }}
      onDoubleClick={() => onOpenProfile(profile)}
    >
      <img src={profile.photo} alt={profile.displayName} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent pointer-events-none" />

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
        <div className="space-y-5 animate-msg">
          <div className="glass-panel rounded-3xl p-4 shadow-lg shadow-black/20 border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-400/40 border border-white/10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" alt="avatar" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white/90">想吃小蛋糕</div>
                  <div className="text-[9px] text-white/40 font-medium">10分钟前 · 渴望拥抱</div>
                </div>
              </div>
              <button className="text-white/30">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[14px] text-white/80 leading-relaxed mb-3 font-medium px-1">今天下雨了，没有带伞，被淋成了落汤鸡。好想喝一杯热乎乎的奶茶啊... 😭</p>
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-inner relative group">
              <img src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="post" />
            </div>
            <div className="flex items-center justify-between px-2 mb-4 text-white/40">
              <div className="flex items-center gap-5">
                <button className="flex items-center gap-1.5 hover:text-purple-400">
                  <Heart className="w-4 h-4" /> <span className="text-xs">32</span>
                </button>
                <button className="flex items-center gap-1.5 text-purple-400">
                  <MessageSquare className="w-4 h-4 fill-purple-500/20" /> <span className="text-xs">5</span>
                </button>
              </div>
              <button>
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl p-3 border-l-2 border-purple-400 flex gap-3 shadow-inner backdrop-blur-sm">
              <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 border border-purple-400/50">
                <Sparkles className="w-3 h-3 text-purple-300" />
              </div>
              <div>
                <div className="text-[11px] text-purple-300 mb-1 font-bold flex items-center gap-2">
                  AI 暖友 · 苏菲 <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-[8px] text-purple-200">秒回</span>
                </div>
                <p className="text-[12px] text-white/80 font-medium">赶紧洗个热水澡换身干衣服呀！给你一个大大的虚拟拥抱，别感冒啦！</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-msg">
          <div className="glass-panel rounded-3xl p-5 relative overflow-hidden group border-white/5">
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 border border-purple-500/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI 聊天破冰辅助</h3>
                  <p className="text-[10px] text-white/50 font-medium">截图分析 TA 的潜台词</p>
                </div>
              </div>
            </div>
            <div className="w-full h-20 bg-black/20 border border-white/10 border-dashed rounded-xl flex flex-col items-center justify-center text-white/40 mb-3 cursor-pointer hover:bg-white/5">
              <ImageIcon className="w-6 h-6 mb-1 opacity-70" />
              <span className="text-[10px] font-bold">点击上传聊天截图</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ToolTile icon={<Heart className="w-5 h-5" />} title="恋爱人格" desc="测测你的隐藏属性" color="rose" />
            <ToolTile icon={<Flame className="w-5 h-5" />} title="心动剧本" desc="平行时空的邂逅" color="orange" />
          </div>
        </div>
      )}
    </div>
  );
};

const ToolTile = ({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: "rose" | "orange" }) => {
  const colorClass = color === "rose" ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-orange-500/20 text-orange-300 border-orange-500/30";
  return (
    <div className="glass-panel rounded-3xl p-5 aspect-square relative border-white/5 flex flex-col justify-between">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${colorClass}`}>{icon}</div>
      <div>
        <h3 className="font-bold text-white mb-1">{title}</h3>
        <p className="text-[10px] text-white/50">{desc}</p>
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

const ProfileView = () => (
  <div className="px-5 pt-14 pb-8 animate-msg flex flex-col">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 shadow-md overflow-hidden">
        <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Me" />
      </div>
      <div className="flex-1">
        <h2 className="font-serif text-2xl font-bold mb-1 text-[#fdf8fa]">老大</h2>
        <p className="text-xs text-white/50 font-medium flex items-center gap-1">
          ID: 893204 · <MapPin className="w-3 h-3" /> 上海
        </p>
      </div>
    </div>
    <div className="w-full h-32 rounded-3xl vip-card-glow p-5 mb-6 shadow-xl shadow-red-900/10 flex flex-col justify-between border border-red-300/10">
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-[#e3a891]">
          <Crown className="w-5 h-5" />
          <span className="font-serif font-black text-[15px] tracking-widest">SVIP 尊享会员</span>
        </div>
      </div>
      <div className="flex justify-between items-end z-10">
        <div>
          <div className="text-[10px] text-[#e3a891]/80 font-bold mb-1">解锁无限制 AI 语音与专属记忆</div>
        </div>
        <button className="px-4 py-1.5 bg-gradient-to-r from-[#e3a891] to-[#b87c67] text-[#2d1622] text-xs font-bold rounded-full shadow-md">续费</button>
      </div>
    </div>
  </div>
);

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
