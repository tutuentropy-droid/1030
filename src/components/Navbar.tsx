import { Link, useLocation } from "react-router-dom";
import { Home, Brain, Map, RotateCcw } from "lucide-react";
import { useBrainMap } from "@/hooks/useBrainMap";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isBrainMap = location.pathname === "/brain-map";
  const isBrainReplay = location.pathname === "/brain-replay";
  const { completionStats } = useBrainMap();
  const stats = completionStats;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-museum-950/70 backdrop-blur-xl border-b border-white/10" />
      <div className="container relative flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center glow-purple transition-transform group-hover:scale-110">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">
            神经错觉博物馆
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/brain-replay"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isBrainReplay
                ? "bg-neon-pink/20 border border-neon-pink/40 text-white"
                : "text-museum-300/70 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">大脑回放</span>
          </Link>

          <Link
            to="/brain-map"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isBrainMap
                ? "bg-neon-purple/20 border border-neon-purple/40 text-white"
                : "text-museum-300/70 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">大脑地图</span>
            {stats.unlockedRegions > 0 && (
              <span
                className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                style={{
                  background: "linear-gradient(135deg, #9d4edd, #00d4ff)",
                  color: "white",
                }}
              >
                {stats.unlockedRegions}
              </span>
            )}
          </Link>

          {!isHome && !isBrainMap && !isBrainReplay && (
            <Link to="/" className="btn-secondary text-sm py-2 px-4 gap-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">返回大厅</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
