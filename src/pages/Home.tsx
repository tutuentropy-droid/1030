import { Sparkles, ChevronDown } from "lucide-react";
import ExperimentCard from "@/components/ExperimentCard";
import { experiments } from "@/data/experiments";

export default function Home() {
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
            className="animate-slide-up"
            style={{ animationFillMode: "both", animationDelay: "0.3s" }}
          >
            <a href="#experiments" className="btn-primary text-lg">
              开始探索
              <ChevronDown className="w-5 h-5 animate-bounce-slow" />
            </a>
          </div>

          <div className="mt-20 flex justify-center gap-8 text-center animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            <div>
              <div className="text-3xl font-bold gradient-text">5</div>
              <div className="text-sm text-museum-300/60">互动实验</div>
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
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
              选择一个<span className="gradient-text">实验</span>
            </h2>
            <p className="text-museum-200/60 max-w-xl mx-auto">
              每个实验都包含互动体验和科学解释，带你深入了解大脑的工作原理
            </p>
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
