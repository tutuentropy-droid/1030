import type { ReactNode } from "react";

interface ExplanationCardProps {
  icon: ReactNode;
  title: string;
  content: string;
  color: string;
  delay?: number;
}

export default function ExplanationCard({
  icon,
  title,
  content,
  color,
  delay = 0,
}: ExplanationCardProps) {
  return (
    <div
      className="glass-card p-6 animate-slide-up"
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          boxShadow: `0 0 20px ${color}20`,
        }}
      >
        <div style={{ color }}>{icon}</div>
      </div>

      <h3 className="text-xl font-display font-bold text-white mb-3">
        {title}
      </h3>

      <p className="text-museum-200/80 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );
}
