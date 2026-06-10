import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Thermometer,
  Users,
  Lightbulb,
  Wind,
  Wifi,
  Lock,
  ChevronUp,
  ChevronDown,
  Power,
  Settings,
  Volume2,
  X,
  DoorOpen,
  DoorClosed,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import logoFindMe from "../imports/logoFindME.png";
import logoMeng from "../imports/meng.png";

/* MARKER-MAKE-KIT-INVOKED */

type DeviceState = "boot" | "panel";

// Unsplash white plaster wall — realistic wall mount backdrop
const ROOM_BG =
  "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1600&h=1200&fit=crop&auto=format";

function OccupancyFullscreen({
  occupied,
  onClose,
}: {
  occupied: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      style={{
        background: occupied
          ? "radial-gradient(ellipse at 50% 40%, rgba(0,232,122,0.14) 0%, #050810 60%)"
          : "radial-gradient(ellipse at 50% 40%, rgba(30,38,54,0.8) 0%, #050810 60%)",
        backgroundColor: "#050810",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <button
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#6b7fa0",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        <X size={14} />
      </button>

      <div className="relative flex items-center justify-center mb-6">
        {occupied && (
          <>
            <motion.div
              className="absolute rounded-full"
              style={{ width: "100px", height: "100px", border: "1px solid rgba(0,232,122,0.3)" }}
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ width: "100px", height: "100px", border: "1px solid rgba(0,232,122,0.2)" }}
              animate={{ scale: [1, 2.0], opacity: [0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
            />
          </>
        )}
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: occupied ? "rgba(0,232,122,0.1)" : "rgba(107,127,160,0.08)",
            border: `2px solid ${occupied ? "rgba(0,232,122,0.4)" : "rgba(107,127,160,0.2)"}`,
          }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {occupied ? (
            <DoorClosed size={36} style={{ color: "#00e87a" }} />
          ) : (
            <DoorOpen size={36} style={{ color: "#6b7fa0" }} />
          )}
        </motion.div>
      </div>

      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "28px",
            fontWeight: 700,
            color: occupied ? "#00e87a" : "#e8edf5",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          {occupied ? "OCCUPIED" : "VACANT"}
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#6b7fa0" }}>
          Meeting Room 4B
        </p>

        <div
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: "rgba(0,200,232,0.06)",
            border: "1px solid rgba(0,200,232,0.15)",
          }}
        >
          <ImageWithFallback
            src={logoFindMe}
            alt="FindMe logo"
            style={{ height: "16px", width: "auto", objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              color: "#00c8e8",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            True Presence Detection
          </span>
        </div>

        <div className="mt-3 flex flex-col items-center gap-1">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "#3a4a60",
              letterSpacing: "0.1em",
            }}
          >
            {occupied ? "PRESENCE DETECTED" : "NO MOTION · 12 MIN"}
          </span>
        </div>
      </motion.div>

      <div className="absolute bottom-6 flex flex-col items-center gap-1">
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", color: "#2a3548", letterSpacing: "0.1em" }}>
          POWERED BY
        </span>
        <ImageWithFallback
          src={logoFindMe}
          alt="FindMe"
          style={{ height: "38px", width: "auto", objectFit: "contain", opacity: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

function BootScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: "#080c12" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,200,232,0.07) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <ImageWithFallback
            src={logoMeng}
            alt="VDA Telkonet"
            style={{ height: "52px", width: "auto", objectFit: "contain", filter: "brightness(1.1)" }}
          />
        </motion.div>

        <motion.div
          className="w-px"
          style={{ height: "28px", background: "rgba(0,200,232,0.2)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        />

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <ImageWithFallback
            src={logoFindMe}
            alt="FindMe"
            style={{ height: "60px", width: "auto", objectFit: "contain", filter: "brightness(1.05)" }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              color: "#00c8e8",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Smart Room Control
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      >
        <div className="h-px w-full overflow-hidden" style={{ background: "rgba(0,200,232,0.1)" }}>
          <motion.div
            className="h-full"
            style={{ background: "linear-gradient(90deg, rgba(0,200,232,0.3), rgba(0,200,232,0.8))" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.6, duration: 2, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#2a3548" }}>
            INITIALIZING SYSTEM
          </span>
          <motion.span
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#00c8e8" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4 }}
          >
            READY
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ControlPanel() {
  const [temp, setTemp] = useState(22);
  const [occupied, setOccupied] = useState(true);
  const [showOccupancyFullscreen, setShowOccupancyFullscreen] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);
  const [brightness, setBrightness] = useState(70);
  const [hvacOn, setHvacOn] = useState(true);
  const [fanSpeed, setFanSpeed] = useState<"low" | "med" | "high">("med");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const dateStr = currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: "#080c12" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,200,232,0.05) 0%, transparent 100%)" }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 relative z-10"
        style={{ borderBottom: "1px solid rgba(0,200,232,0.08)" }}
      >
        <ImageWithFallback
          src={logoMeng}
          alt="VDA Telkonet"
          style={{ height: "20px", width: "auto", objectFit: "contain", opacity: 0.85 }}
        />
        <div className="flex flex-col items-end">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "20px", fontWeight: 600, color: "#e8edf5", letterSpacing: "0.05em" }}>
            {timeStr}
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#6b7fa0" }}>{dateStr}</span>
        </div>
      </div>

      {/* Occupancy banner */}
      <motion.div
        className="mx-4 mt-3 px-4 py-2.5 rounded-lg flex items-center gap-3 cursor-pointer relative z-10"
        style={{
          background: occupied ? "rgba(0,232,122,0.08)" : "rgba(107,127,160,0.06)",
          border: `1px solid ${occupied ? "rgba(0,232,122,0.25)" : "rgba(107,127,160,0.15)"}`,
        }}
        onClick={() => setShowOccupancyFullscreen(true)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: occupied ? "#00e87a" : "#3a4a60" }}
          animate={occupied ? { scale: [1, 1.4, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <Users size={13} style={{ color: occupied ? "#00e87a" : "#6b7fa0" }} />
        <div className="flex flex-col">
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, color: occupied ? "#00e87a" : "#6b7fa0" }}>
            {occupied ? "Room Occupied" : "Room Vacant"}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "#3a4a60" }}>
            FindMe True Presence
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Wifi size={10} style={{ color: "#00c8e8" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "#2a3548" }}>TAP FOR DETAILS</span>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-3 p-4 flex-1 overflow-hidden relative z-10">
        {/* Temperature */}
        <div className="rounded-xl p-4 flex flex-col justify-between" style={{ background: "#101520", border: "1px solid rgba(0,200,232,0.1)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Thermometer size={12} style={{ color: "#00c8e8" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#6b7fa0", fontWeight: 500 }}>TEMPERATURE</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "34px", fontWeight: 600, color: "#e8edf5", lineHeight: 1 }}>
                {temp}<span style={{ fontSize: "16px", color: "#6b7fa0" }}>°C</span>
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#6b7fa0", marginTop: "4px" }}>Set point</span>
            </div>
            <div className="flex flex-col gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,232,0.1)", border: "1px solid rgba(0,200,232,0.2)", color: "#00c8e8", cursor: "pointer" }} onClick={() => setTemp(t => Math.min(t + 1, 30))}>
                <ChevronUp size={14} />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,232,0.1)", border: "1px solid rgba(0,200,232,0.2)", color: "#00c8e8", cursor: "pointer" }} onClick={() => setTemp(t => Math.max(t - 1, 16))}>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Lighting */}
        <div className="rounded-xl p-4 flex flex-col justify-between" style={{ background: "#101520", border: `1px solid ${lightsOn ? "rgba(255,220,100,0.15)" : "rgba(0,200,232,0.08)"}` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Lightbulb size={12} style={{ color: lightsOn ? "#ffd864" : "#6b7fa0" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#6b7fa0", fontWeight: 500 }}>LIGHTING</span>
            </div>
            <button className="w-6 h-6 rounded flex items-center justify-center" style={{ background: lightsOn ? "rgba(255,216,100,0.15)" : "rgba(107,127,160,0.08)", border: `1px solid ${lightsOn ? "rgba(255,216,100,0.3)" : "rgba(107,127,160,0.12)"}`, cursor: "pointer" }} onClick={() => setLightsOn(!lightsOn)}>
              <Power size={9} style={{ color: lightsOn ? "#ffd864" : "#3a4a60" }} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "22px", fontWeight: 600, color: lightsOn ? "#ffd864" : "#3a4a60" }}>{brightness}%</span>
            <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: "linear-gradient(90deg, rgba(255,216,100,0.4), #ffd864)" }} animate={{ width: `${brightness}%` }} transition={{ duration: 0.3 }} />
            </div>
            <div className="flex gap-1 mt-1">
              {[25, 50, 75, 100].map(v => (
                <button key={v} className="flex-1 h-5 rounded" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", background: brightness === v ? "rgba(255,216,100,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${brightness === v ? "rgba(255,216,100,0.3)" : "transparent"}`, color: brightness === v ? "#ffd864" : "#3a4a60", cursor: "pointer" }} onClick={() => setBrightness(v)}>{v}%</button>
              ))}
            </div>
          </div>
        </div>

        {/* HVAC */}
        <div className="rounded-xl p-4 flex flex-col justify-between" style={{ background: "#101520", border: `1px solid ${hvacOn ? "rgba(0,200,232,0.12)" : "rgba(0,200,232,0.05)"}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Wind size={12} style={{ color: hvacOn ? "#00c8e8" : "#6b7fa0" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#6b7fa0", fontWeight: 500 }}>HVAC</span>
            </div>
            <button className="w-6 h-6 rounded flex items-center justify-center" style={{ background: hvacOn ? "rgba(0,200,232,0.1)" : "rgba(107,127,160,0.06)", border: `1px solid ${hvacOn ? "rgba(0,200,232,0.25)" : "rgba(107,127,160,0.1)"}`, cursor: "pointer" }} onClick={() => setHvacOn(!hvacOn)}>
              <Power size={9} style={{ color: hvacOn ? "#00c8e8" : "#3a4a60" }} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#6b7fa0" }}>Fan Speed</span>
            <div className="flex gap-1">
              {(["low", "med", "high"] as const).map(speed => (
                <button key={speed} className="flex-1 py-1.5 rounded-lg" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", background: fanSpeed === speed && hvacOn ? "rgba(0,200,232,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${fanSpeed === speed && hvacOn ? "rgba(0,200,232,0.3)" : "rgba(255,255,255,0.05)"}`, color: fanSpeed === speed && hvacOn ? "#00c8e8" : "#3a4a60", cursor: "pointer" }} onClick={() => hvacOn && setFanSpeed(speed)}>{speed}</button>
              ))}
            </div>
          </div>
        </div>

        {/* System status */}
        <div className="rounded-xl p-4 flex flex-col justify-between" style={{ background: "#101520", border: "1px solid rgba(0,200,232,0.07)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Settings size={12} style={{ color: "#6b7fa0" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#6b7fa0", fontWeight: 500 }}>SYSTEM</span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: "Network", value: "Online", ok: true },
              { label: "BMS Link", value: "Active", ok: true },
              { label: "FindMe", value: "Synced", ok: true },
              { label: "Audio", value: "Muted", ok: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#6b7fa0" }}>{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.ok ? "#00e87a" : "#6b7fa0" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: item.ok ? "#00e87a" : "#3a4a60" }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 py-2.5 flex items-center justify-between shrink-0 relative z-10" style={{ borderTop: "1px solid rgba(0,200,232,0.06)" }}>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5" style={{ cursor: "pointer" }}>
            <Volume2 size={11} style={{ color: "#6b7fa0" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#6b7fa0" }}>AUDIO</span>
          </button>
          <button className="flex items-center gap-1.5" style={{ cursor: "pointer" }}>
            <Lock size={11} style={{ color: "#6b7fa0" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#6b7fa0" }}>LOCK</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00e87a" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#3a4a60" }}>ONLINE · v2.4.1</span>
        </div>
      </div>

      <AnimatePresence>
        {showOccupancyFullscreen && (
          <OccupancyFullscreen
            occupied={occupied}
            onClose={() => { setOccupied(o => !o); setShowOccupancyFullscreen(false); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "340px", height: "520px", borderRadius: "20px", background: "linear-gradient(160deg, #1a1f28 0%, #0d1018 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 60px 140px rgba(0,0,0,0.9), 0 0 80px rgba(0,200,232,0.07), inset 0 1px 0 rgba(255,255,255,0.08)", padding: "6px" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "14px", background: "#080c12", overflow: "hidden" }}>
        {children}
      </div>
      <div style={{ position: "absolute", right: "-3px", top: "80px", width: "3px", height: "40px", background: "linear-gradient(180deg, #1e2535, #0d1018)", borderRadius: "0 3px 3px 0" }} />
      <div style={{ position: "absolute", right: "-3px", top: "132px", width: "3px", height: "28px", background: "linear-gradient(180deg, #1e2535, #0d1018)", borderRadius: "0 3px 3px 0" }} />
    </div>
  );
}

export default function App() {
  const [deviceState, setDeviceState] = useState<DeviceState>("boot");
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowToggle(true), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute inset-0">
        <img src={ROOM_BG} alt="Wall" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(220, 218, 212, 0.18)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(160,155,145,0.25) 100%)" }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <motion.div className="mb-5 relative z-10" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(0,200,232,0.06)", border: "1px solid rgba(0,200,232,0.14)", backdropFilter: "blur(8px)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00c8e8" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#6b7fa0", letterSpacing: "0.15em", textTransform: "uppercase" }}>Room Control Unit — VDA-4B</span>
        </div>
      </motion.div>

      <motion.div className="relative z-10" initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <DeviceFrame>
          <AnimatePresence mode="wait">
            {deviceState === "boot" ? (
              <BootScreen key="boot" onComplete={() => setDeviceState("panel")} />
            ) : (
              <ControlPanel key="panel" />
            )}
          </AnimatePresence>
        </DeviceFrame>
      </motion.div>

      <AnimatePresence>
        {showToggle && (
          <motion.button
            className="mt-7 px-5 py-2 rounded-full relative z-10"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7fa0", background: "rgba(8,12,18,0.6)", border: "1px solid rgba(0,200,232,0.14)", backdropFilter: "blur(8px)", cursor: "pointer" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeviceState(s => s === "boot" ? "panel" : "boot")}
            whileHover={{ borderColor: "rgba(0,200,232,0.35)", color: "#00c8e8" }}
          >
            {deviceState === "boot" ? "Skip to panel →" : "← Replay boot"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
