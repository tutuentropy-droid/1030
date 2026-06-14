import { Link, useLocation } from "react-router-dom";
import { Home, Brain } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

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

        {!isHome && (
          <Link to="/" className="btn-secondary text-sm py-2 px-4 gap-1">
            <Home className="w-4 h-4" />
            返回大厅
          </Link>
        )}
      </div>
    </nav>
  );
}
