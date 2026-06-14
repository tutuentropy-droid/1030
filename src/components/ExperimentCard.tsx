import { Link } from "react-router-dom";
import {
  Palette,
  RotateCw,
  Brain,
  Eye,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { Experiment } from "@/data/experiments";

const iconMap: Record<string, typeof Palette> = {
  Palette,
  RotateCw,
  Brain,
  Eye,
  Clock,
};

interface ExperimentCardProps {
  experiment: Experiment;
  index: number;
}

export default function ExperimentCard({ experiment, index }: ExperimentCardProps) {
  const IconComponent = iconMap[experiment.icon] || Palette;

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

      <div className="relative p-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `linear-gradient(135deg, ${experiment.accentColor}40, ${experiment.accentColor}10)`,
            boxShadow: `0 0 30px ${experiment.glowColor}`,
          }}
        >
          {IconComponent && (
            <IconComponent
              className="w-8 h-8"
              style={{ color: experiment.accentColor }}
            />
          )}
        </div>

        <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">
          {experiment.title}
        </h3>

        <p className="text-museum-200/70 mb-6 text-sm leading-relaxed">
          {experiment.shortDescription}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: experiment.accentColor }}>
          <span>开始探索</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
