import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Map, Trophy } from "lucide-react";
import BrainMap from "@/components/BrainMap";
import BrainRegionModal from "@/components/BrainRegionModal";
import type { BrainRegion } from "@/data/brainRegions";
import { useBrainMap } from "@/hooks/useBrainMap";

export default function BrainMapPage() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);
  const navigate = useNavigate();
  const { completionStats, resetProgress } = useBrainMap();
  const stats = completionStats;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container px-4">
        <div className="mb-8 animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-museum-300/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回大厅
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(157, 78, 221, 0.3), rgba(0, 212, 255, 0.3))",
                  boxShadow:
                    "0 0 30px rgba(157, 78, 221, 0.3), 0 0 30px rgba(0, 212, 255, 0.2)",
                }}
              >
                <Map className="w-7 h-7" style={{ color: "#00d4ff" }} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  <span className="gradient-text">大脑地图</span> 模式
                </h1>
                <p className="text-museum-300/70">
                  完成实验，解锁脑区，收集你的神经科学地图
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-yellow" />
                <span className="text-sm text-museum-200/80">
                  收集进度：
                  <span className="font-bold text-white">
                    {stats.unlockedRegions}/{stats.totalRegions}
                  </span>
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm("确定要重置所有进度吗？此操作不可撤销。")) {
                    resetProgress();
                  }
                }}
                className="text-xs text-museum-300/50 hover:text-museum-200/70 transition-colors px-3 py-1"
              >
                重置进度
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div
            className="glass-card p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(157, 78, 221, 0.1), rgba(6, 255, 165, 0.05))",
              border: "1px solid rgba(157, 78, 221, 0.2)",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-neon-yellow/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-neon-yellow" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-white font-medium mb-1">🎮 脑地图收集游戏</p>
              <p className="text-museum-300/70 text-sm">
                每完成一个实验，会自动解锁相关的大脑区域。点击已解锁的脑区，
                查看它参与过哪些实验、常见问题和现实影响。集齐5个脑区，解锁全部成就！
              </p>
            </div>
            <Link
              to="/"
              className="btn-primary text-sm whitespace-nowrap"
              onClick={() => navigate("/#experiments")}
            >
              开始体验
            </Link>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <BrainMap onSelectRegion={setSelectedRegion} />
        </div>
      </div>

      <BrainRegionModal
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
      />
    </div>
  );
}
