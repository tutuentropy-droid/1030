import { Sparkles, ChevronDown, Map, RotateCcw, Brain, ArrowRight, Clock, Moon, Smartphone, BookOpen, Users, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import ExperimentCard from "@/components/ExperimentCard";
import { experiments } from "@/data/experiments";
import { useBrainMap } from "@/hooks/useBrainMap";

export default function Home() {
  const { completionStats, isExperimentCompleted } = useBrainMap();
  const stats = completionStats;

  return (
    <div className="relative min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="container relative text-center px-4 pt-16">
          <div className="animate-fade-in" style={{ animationFillMode: "both" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-neon-purple" />
              <span className="text-sm text-museum-200/80">探索你大脑的奥秘</span>
            </div>
          </div>

          <h1
            className="section-title text-5xl md:text-7xl lg:text-8xl mb-6 animate-slide-up"
            style={{ animationFillMode: "both", animationDelay: "0.1s" }}
          >
            <span className="gradient-text">神经错觉</span>
            <br />
            <span className="text-white">博物馆</span>
          </h1>

          <p
            className="text-lg md:text-xl text-museum-200/70 max-w-2xl mx-auto mb-12 animate-slide-up"
            style={{ animationFillMode: "both", animationDelay: "0.2s" }}
          >
            你的大脑一直在欺骗你。通过互动实验，亲身体验那些令人惊叹的神经错觉现象，
            揭开人类感知背后的科学秘密。
          </p>

          <div
            className="animate-slide-up flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationFillMode: "both", animationDelay: "0.3s" }}
          >
            <a href="#experiments" className="btn-primary text-lg">
              开始探索
              <ChevronDown className="w-5 h-5 animate-bounce-slow" />
            </a>
            <Link to="/brain-map" className="btn-secondary text-lg gap-2">
              <Map className="w-5 h-5" />
              大脑地图模式
              {stats.unlockedRegions > 0 && (
                <span
                  className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ml-1"
                  style={{
                    background: "linear-gradient(135deg, #9d4edd, #00d4ff)",
                    color: "white",
                  }}
                >
                  {stats.unlockedRegions}
                </span>
              )}
            </Link>
          </div>

          <div className="mt-20 flex justify-center gap-8 text-center animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            <div>
              <div className="text-3xl font-bold gradient-text">{stats.totalExperiments}</div>
              <div className="text-sm text-museum-300/60">互动实验</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-3xl font-bold gradient-text">{stats.totalRegions}</div>
              <div className="text-sm text-museum-300/60">大脑区域</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-3xl font-bold gradient-text">∞</div>
              <div className="text-sm text-museum-300/60">惊奇时刻</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-3xl font-bold gradient-text">100%</div>
              <div className="text-sm text-museum-300/60">免费体验</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <ChevronDown className="w-6 h-6 text-museum-300/50" />
        </div>
      </section>

      <section id="experiments" className="relative py-24">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
              选择一个<span className="gradient-text">实验</span>
            </h2>
            <p className="text-museum-200/60 max-w-xl mx-auto">
              每个实验都包含互动体验和科学解释，带你深入了解大脑的工作原理
            </p>
          </div>

          <div className="mb-12 animate-fade-in">
            <Link
              to="/brain-replay"
              className="group relative block overflow-hidden rounded-3xl glass-card-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-neon-pink/20 to-neon-blue/30" />
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-neon-purple/40 rounded-full blur-3xl group-hover:bg-neon-purple/60 transition-all duration-700" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-neon-blue/30 rounded-full blur-3xl group-hover:bg-neon-blue/50 transition-all duration-700" />

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-5">
                      <RotateCcw className="w-4 h-4 text-neon-purple" />
                      <span className="text-sm text-museum-200/80">今日专属 · 神经快照</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
                      <span className="gradient-text">今天的大脑回放</span>
                    </h3>
                    <p className="text-museum-200/70 max-w-xl mb-6 leading-relaxed">
                      记录你今天的真实行为 — 睡了多久、刷了多久视频、运动了多久、学了多久、和人聊了多久。
                      <br className="hidden md:block" />
                      <span className="text-white/80">不是健康打卡，是一场神经科学的自我扫描。</span>
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-museum-200/70">
                        <Moon className="w-3.5 h-3.5 text-[#7209b7]" />
                        睡眠
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-museum-200/70">
                        <Smartphone className="w-3.5 h-3.5 text-[#fb5607]" />
                        刷视频
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-museum-200/70">
                        <Dumbbell className="w-3.5 h-3.5 text-[#06ffa5]" />
                        运动
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-museum-200/70">
                        <BookOpen className="w-3.5 h-3.5 text-[#9d4edd]" />
                        学习
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-museum-200/70">
                        <Users className="w-3.5 h-3.5 text-[#f72585]" />
                        社交
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-museum-200/60">
                        <Brain className="w-4 h-4 text-neon-pink" />
                        <span>神经状态图谱</span>
                      </div>
                      <div className="flex items-center gap-2 text-museum-200/60">
                        <Map className="w-4 h-4 text-neon-blue" />
                        <span>活跃脑区定位</span>
                      </div>
                      <div className="flex items-center gap-2 text-museum-200/60">
                        <Sparkles className="w-4 h-4 text-neon-yellow" />
                        <span>匹配实验推荐</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex md:flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue flex items-center justify-center glow-purple group-hover:scale-110 transition-transform duration-500">
                        <RotateCcw className="w-12 h-12 md:w-16 md:h-16 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-neon-yellow to-orange-400 text-black text-xs font-bold animate-pulse">
                        <Clock className="w-3 h-3" />
                        NEW
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-medium group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300">
                      <span>开始扫描</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="md:hidden flex justify-center mt-6">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-medium">
                    <span>开始扫描</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment, index) => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="relative py-12 border-t border-white/5">
        <div className="container px-4 text-center">
          <p className="text-museum-300/50 text-sm">
            神经错觉博物馆 — 用科学的眼光重新认识世界
          </p>
        </div>
      </footer>
    </div>
  );
}
