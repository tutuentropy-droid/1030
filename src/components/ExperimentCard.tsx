import { Link } from "react-router-dom";
import {
  Palette,
  RotateCw,
  Brain,
  Eye,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  Shield,
  Gift,
  Moon,
} from "lucide-react";
import type { Experiment } from "@/data/experiments";
import { useBrainMap } from "@/hooks/useBrainMap";

const iconMap: Record<string, typeof Palette> = {
  Palette,
  RotateCw,
  Brain,
  Eye,
  Clock,
  Sparkles,
  Shield,
  Gift,
  Moon,
};

interface ExperimentCardProps {
  experiment: Experiment;
  index: number;
}

export default function ExperimentCard({ experiment, index }: ExperimentCardProps) {
  const IconComponent = iconMap[experiment.icon] || Palette;
  const { isExperimentCompleted } = useBrainMap();
  const completed = isExperimentCompleted(experiment.id);

  return (
    <Link
      to={`/experiment/${experiment.id}`}
      className="glass-card glass-card-hover group relative overflow-hidden animate-slide-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: "both",
      }}
    >
      <div
        className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"
        style={{ background: experiment.accentColor }}
      />

      {completed && (
        <div className="absolute top-4 right-4 z-10 animate-fade-in">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #06ffa5, #00d4ff)",
              boxShadow: "0 0 15px rgba(6, 255, 165, 0.5)",
            }}
          >
            <Check className="w-4 h-4 text-museum-950" strokeWidth={3} />
          </div>
        </div>
      )}

      <div className="relative p-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `linear-gradient(135deg, ${experiment.accentColor}40, ${experiment.accentColor}10)`,
            boxShadow: `0 0 30px ${experiment.glowColor}`,
            opacity: completed ? 0.8 : 1,
          }}
        >
          {IconComponent && (
            <IconComponent
              className="w-8 h-8"
              style={{ color: experiment.accentColor }}
            />
          )}
        </div>

        <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300 flex items-center gap-2">
          {experiment.title}
        </h3>

        <p className="text-museum-200/70 mb-6 text-sm leading-relaxed">
          {experiment.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: experiment.accentColor }}>
            <span>{completed ? "再次探索" : "开始探索"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
          {completed && (
            <span className="text-xs px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green font-medium">
              ✓ 已完成
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
