import React, { useEffect, useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';

interface SmokeParticle {
  id: number;
  x: number;
  delay: number;
  size: number;
  duration: number;
}

const AlchemyFurnace: React.FC = () => {
  const { temperature, isSmoking, selectedChemist } = useGameStore();
  const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([]);
  const [showTempChange, setShowTempChange] = useState<number | null>(null);
  const [prevTemp, setPrevTemp] = useState(temperature);

  useEffect(() => {
    if (temperature !== prevTemp) {
      const diff = temperature - prevTemp;
      setShowTempChange(diff);
      setPrevTemp(temperature);
      
      const timer = setTimeout(() => setShowTempChange(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [temperature, prevTemp]);

  useEffect(() => {
    if (isSmoking) {
      const particles: SmokeParticle[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: 35 + Math.random() * 30,
        delay: i * 0.2,
        size: 20 + Math.random() * 30,
        duration: 2 + Math.random() * 2,
      }));
      setSmokeParticles(particles);
      
      const timer = setTimeout(() => setSmokeParticles([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [isSmoking]);

  const temperatureColor = useMemo(() => {
    if (temperature < 25) return 'from-blue-400 to-blue-600';
    if (temperature < 50) return 'from-yellow-400 to-orange-500';
    if (temperature < 75) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-flame';
  }, [temperature]);

  const flameIntensity = useMemo(() => {
    if (temperature < 25) return 0.3;
    if (temperature < 50) return 0.6;
    if (temperature < 75) return 0.8;
    return 1;
  }, [temperature]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-80 md:w-80 md:h-96">
        {smokeParticles.map((particle) => (
          <div
            key={particle.id}
            className="smoke-particle"
            style={{
              left: `${particle.x}%`,
              top: '10%',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `smoke ${particle.duration}s ease-out forwards`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        <svg
          viewBox="0 0 200 280"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
        >
          <defs>
            <linearGradient id="furnaceBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="30%" stopColor="#D4A574" />
              <stop offset="70%" stopColor="#B8895A" />
              <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>
            
            <linearGradient id="furnaceRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A0783A" />
              <stop offset="50%" stopColor="#E8C9A0" />
              <stop offset="100%" stopColor="#A0783A" />
            </linearGradient>

            <linearGradient id="tempGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="60%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="100" cy="260" rx="70" ry="15" fill="#1A0F0A" opacity="0.5" />

          <path
            d="M40 60 L40 220 Q40 250 100 250 Q160 250 160 220 L160 60 Q160 30 100 30 Q40 30 40 60"
            fill="url(#furnaceBody)"
            stroke="#5C4A1F"
            strokeWidth="3"
          />

          <ellipse cx="100" cy="60" rx="60" ry="20" fill="url(#furnaceRim)" stroke="#5C4A1F" strokeWidth="2" />
          <ellipse cx="100" cy="60" rx="45" ry="12" fill="#2C1810" />

          <ellipse cx="100" cy="230" rx="45" ry="15" fill="url(#furnaceRim)" stroke="#5C4A1F" strokeWidth="2" />

          <path
            d="M55 90 L55 190"
            stroke="#5C4A1F"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M145 90 L145 190"
            stroke="#5C4A1F"
            strokeWidth="3"
            fill="none"
          />

          <rect x="75" y="95" width="50" height="120" rx="5" fill="#1A0F0A" stroke="#5C4A1F" strokeWidth="2" />

          <rect
            x="80"
            y={95 + 120 - (temperature / 100) * 110}
            width="40"
            height={(temperature / 100) * 110}
            rx="3"
            fill="url(#tempGradient)"
            className="temperature-fill"
            filter={temperature > 50 ? 'url(#glow)' : undefined}
          />

          {temperature > 20 && (
            <g style={{ opacity: flameIntensity }}>
              <ellipse
                cx="100"
                cy={60 - 5}
                rx="30"
                ry="35"
                fill="url(#fireGlow)"
                className="animate-flicker"
              />
              
              <path
                d="M80 55 Q90 10 100 20 Q110 10 120 55 Q110 35 100 40 Q90 35 80 55"
                fill="#FFD700"
                className="animate-flicker"
                style={{ transformOrigin: 'center bottom' }}
              />
              <path
                d="M85 55 Q92 25 100 30 Q108 25 115 55 Q108 40 100 45 Q92 40 85 55"
                fill="#FF6B35"
                className="animate-flicker"
                style={{ animationDelay: '0.3s', transformOrigin: 'center bottom' }}
              />
              <path
                d="M90 55 Q95 35 100 38 Q105 35 110 55 Q105 45 100 48 Q95 45 90 55"
                fill="#FF4500"
                className="animate-flicker"
                style={{ animationDelay: '0.6s', transformOrigin: 'center bottom' }}
              />
            </g>
          )}

          <circle cx="100" cy="165" r="25" fill="#2C1810" stroke="#5C4A1F" strokeWidth="2" />
          
          {temperature > 50 && (
            <circle
              cx="100"
              cy="165"
              r="18"
              fill="url(#fireGlow)"
              className="animate-pulse-glow"
              style={{ opacity: (temperature - 50) / 50 }}
            />
          )}

          {selectedChemist && (
            <text
              x="100"
              y="205"
              textAnchor="middle"
              fill="#E8C9A0"
              fontSize="24"
              className="select-none"
            >
              {selectedChemist.avatar}
            </text>
          )}
        </svg>

        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="relative">
            <span 
              className={`text-3xl font-bold font-display ${
                temperature < 25 ? 'text-blue-400' : 
                temperature < 50 ? 'text-yellow-400' : 
                temperature < 75 ? 'text-orange-400' : 'text-flame text-shadow-glow'
              }`}
            >
              {temperature}°C
            </span>
            {showTempChange !== null && (
              <span
                className={`absolute -right-12 top-0 text-xl font-bold animate-bounce ${
                  showTempChange > 0 ? 'text-green-400' : 'text-red-400'
                }`}
                style={{ animationDuration: '0.5s' }}
              >
                {showTempChange > 0 ? '+' : ''}{showTempChange}
              </span>
            )}
          </div>
          <div className="w-48 h-3 bg-alchemy-darkBrown rounded-full mt-2 overflow-hidden border border-alchemy-copper">
            <div
              className={`h-full bg-gradient-to-r ${temperatureColor} transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, temperature))}%` }}
            />
          </div>
          <div className="flex justify-between w-48 mt-1 text-xs text-alchemy-copperDark">
            <span>0°</span>
            <span>50°</span>
            <span>100°</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-xl font-display text-alchemy-copper">炼金反应炉</h3>
        <p className="text-sm text-alchemy-copperDark mt-1">
          {temperature < 25 ? '🔥 温度过低！反应即将停止...' :
           temperature < 50 ? '⚗️ 温度适中，继续炼金吧！' :
           temperature < 75 ? '🌡️ 温度上升中，快要沸腾了！' :
           '💥 温度极高！小心爆炸！'}
        </p>
      </div>
    </div>
  );
};

export default AlchemyFurnace;
