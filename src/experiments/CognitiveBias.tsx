import { useState, useMemo } from "react";
import {
  Shield,
  Check,
  X,
  ChevronRight,
  AlertTriangle,
  Newspaper,
  BarChart3,
  Dice6,
  ShieldAlert,
  Flame,
  Sparkles,
  Brain,
} from "lucide-react";
import type { SubExperiment } from "@/data/experiments";

interface CognitiveBiasProps {
  onComplete: () => void;
  subExperiments?: SubExperiment[];
}

type Phase = "intro" | "playing" | "result";
type CategoryType = "fake-news" | "visual-mislead" | "probability-illusion" | "risk-judgment";

type BiasType =
  | "confirmation-bias"
  | "availability-heuristic"
  | "anchoring-effect"
  | "framing-effect"
  | "loss-aversion"
  | "affect-heuristic"
  | "bandwagon-effect"
  | "base-rate-neglect"
  | "sunk-cost-fallacy"
  | "gamblers-fallacy"
  | "overconfidence-bias"
  | "hindsight-bias";

interface QuestionOption {
  id: string;
  label: string;
  isDeceptive: boolean;
}

interface Question {
  id: string;
  category: CategoryType;
  categoryIndex: number;
  title: string;
  description?: string;
  visualHint?: React.ReactNode;
  options: QuestionOption[];
  correctOptionId: string;
  targetBias: BiasType;
  biasExplanation: string;
  questionNumber: number;
}

interface AnsweredQuestion {
  questionId: string;
  selectedOptionId: string;
  wasDeceived: boolean;
  targetBias: BiasType;
  category: CategoryType;
}

const TruncatedYAxisChart = () => (
  <div className="glass-card p-4 rounded-lg mb-4">
    <div className="text-center text-sm text-museum-300 mb-3">A、B产品月销量对比</div>
    <svg viewBox="0 0 280 200" className="w-full max-w-md mx-auto">
      <defs>
        <linearGradient id="barA" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="barB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <line x1="50" y1="20" x2="50" y2="170" stroke="#64748b" strokeWidth="1" />
      <line x1="50" y1="170" x2="270" y2="170" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="25" textAnchor="end" fill="#94a3b8" fontSize="10">10000</text>
      <line x1="45" y1="20" x2="50" y2="20" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="65" textAnchor="end" fill="#94a3b8" fontSize="10">9500</text>
      <line x1="45" y1="60" x2="50" y2="60" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="105" textAnchor="end" fill="#94a3b8" fontSize="10">9000</text>
      <line x1="45" y1="100" x2="50" y2="100" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="145" textAnchor="end" fill="#94a3b8" fontSize="10">8500</text>
      <line x1="45" y1="140" x2="50" y2="140" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="175" textAnchor="end" fill="#94a3b8" fontSize="10">8000</text>
      <rect x="90" y="140" width="50" height="30" rx="2" fill="url(#barA)" />
      <rect x="170" y="20" width="50" height="150" rx="2" fill="url(#barB)" />
      <text x="115" y="185" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">A产品</text>
      <text x="195" y="185" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="bold">B产品</text>
      <text x="115" y="135" textAnchor="middle" fill="#cbd5e1" fontSize="9">8500</text>
      <text x="195" y="15" textAnchor="middle" fill="#cbd5e1" fontSize="9">10000</text>
    </svg>
  </div>
);

const Misleading3DPieChart = () => (
  <div className="glass-card p-4 rounded-lg mb-4">
    <div className="text-center text-sm text-museum-300 mb-3">用户年龄分布</div>
    <svg viewBox="0 0 280 240" className="w-full max-w-md mx-auto">
      <defs>
        <ellipse cx="140" cy="160" rx="100" ry="25" fill="#1e293b" />
        <ellipse cx="140" cy="158" rx="100" ry="25" fill="#1e3a5f" opacity="0.5" />
        <path d="M 140 90 L 240 140 A 100 100 0 0 0 150 100 Z" fill="#60a5fa" />
        <path d="M 140 90 L 150 100 A 100 100 0 0 0 135 95 Z" fill="#34d399" />
        <path d="M 140 90 L 135 95 A 100 100 0 0 0 40 140 Z" fill="#f97316" />
        <path d="M 40 140 L 140 90 L 240 140 L 240 160 L 140 205 L 40 160 Z" fill="#1e3a5f" opacity="0.3" />
        <path d="M 140 90 L 240 140 L 240 160 L 140 205 L 150 100 Z" fill="#3b82f6" opacity="0.4" />
        <path d="M 140 90 L 150 100 L 140 205 L 135 95 Z" fill="#10b981" opacity="0.4" />
        <path d="M 140 90 L 135 95 L 40 140 L 40 160 L 140 205 Z" fill="#ea580c" opacity="0.4" />
        <ellipse cx="140" cy="90" rx="100" ry="35" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
      </defs>
      <g transform="translate(20, 200)">
        <rect width="12" height="12" rx="2" fill="#60a5fa" />
        <text x="20" y="10" fill="#cbd5e1" fontSize="11">18-24岁: 35%</text>
      </g>
      <g transform="translate(160, 200)">
        <rect width="12" height="12" rx="2" fill="#34d399" />
        <text x="20" y="10" fill="#cbd5e1" fontSize="11">25-34岁: 40%</text>
      </g>
      <g transform="translate(20, 220)">
        <rect width="12" height="12" rx="2" fill="#f97316" />
        <text x="20" y="10" fill="#cbd5e1" fontSize="11">35岁以上: 25%</text>
      </g>
    </svg>
  </div>
);

const InconsistentXAxisChart = () => (
  <div className="glass-card p-4 rounded-lg mb-4">
    <div className="text-center text-sm text-museum-300 mb-3">某产品用户增长趋势</div>
    <svg viewBox="0 0 300 220" className="w-full max-w-md mx-auto">
      <line x1="40" y1="30" x2="40" y2="180" stroke="#64748b" strokeWidth="1" />
      <line x1="40" y1="180" x2="290" y2="180" stroke="#64748b" strokeWidth="1" />
      <text x="35" y="35" textAnchor="end" fill="#94a3b8" fontSize="10">100万</text>
      <line x1="35" y1="30" x2="40" y2="30" stroke="#64748b" strokeWidth="1" />
      <text x="35" y="80" textAnchor="end" fill="#94a3b8" fontSize="10">75万</text>
      <line x1="35" y1="75" x2="40" y2="75" stroke="#64748b" strokeWidth="1" />
      <text x="35" y="125" textAnchor="end" fill="#94a3b8" fontSize="10">50万</text>
      <line x1="35" y1="120" x2="40" y2="120" stroke="#64748b" strokeWidth="1" />
      <text x="35" y="170" textAnchor="end" fill="#94a3b8" fontSize="10">25万</text>
      <line x1="35" y1="165" x2="40" y2="165" stroke="#64748b" strokeWidth="1" />
      <text x="35" y="188" textAnchor="end" fill="#94a3b8" fontSize="10">0</text>
      <polyline
        points="
          40,165 60,160 80,155 100,145 120,135 140,125 160,115 180,105 200,95 220,85
          240,80 260,75 280,70
        "
        fill="none"
        stroke="#a855f7"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="165" r="3" fill="#a855f7" />
      <circle cx="120" cy="135" r="3" fill="#a855f7" />
      <circle cx="200" cy="95" r="3" fill="#a855f7" />
      <circle cx="280" cy="70" r="3" fill="#a855f7" />
      <text x="40" y="198" textAnchor="middle" fill="#94a3b8" fontSize="9">第1周</text>
      <text x="120" y="198" textAnchor="middle" fill="#94a3b8" fontSize="9">第8周</text>
      <text x="200" y="198" textAnchor="middle" fill="#94a3b8" fontSize="9">第6月</text>
      <text x="280" y="198" textAnchor="middle" fill="#94a3b8" fontSize="9">第12月</text>
      <path
        d="M 40,165 L 60,160 L 80,155 L 100,145 L 120,135 L 140,125 L 160,115 L 180,105 L 200,95 L 220,85 L 240,80 L 260,75 L 280,70"
        fill="rgba(168, 85, 247, 0.1)"
        stroke="none"
      />
    </svg>
  </div>
);

const DualYAxisChart = () => (
  <div className="glass-card p-4 rounded-lg mb-4">
    <div className="text-center text-sm text-museum-300 mb-3">A公司 vs B公司营收增长</div>
    <svg viewBox="0 0 300 220" className="w-full max-w-md mx-auto">
      <line x1="50" y1="30" x2="50" y2="180" stroke="#64748b" strokeWidth="1" />
      <line x1="50" y1="180" x2="270" y2="180" stroke="#64748b" strokeWidth="1" />
      <line x1="270" y1="30" x2="270" y2="180" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="35" textAnchor="end" fill="#60a5fa" fontSize="10">200亿</text>
      <line x1="45" y1="30" x2="50" y2="30" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="80" textAnchor="end" fill="#60a5fa" fontSize="10">150亿</text>
      <line x1="45" y1="75" x2="50" y2="75" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="125" textAnchor="end" fill="#60a5fa" fontSize="10">100亿</text>
      <line x1="45" y1="120" x2="50" y2="120" stroke="#64748b" strokeWidth="1" />
      <text x="45" y="170" textAnchor="end" fill="#60a5fa" fontSize="10">50亿</text>
      <line x1="45" y1="165" x2="50" y2="165" stroke="#64748b" strokeWidth="1" />
      <text x="275" y="35" textAnchor="start" fill="#f97316" fontSize="10">40亿</text>
      <line x1="270" y1="30" x2="275" y2="30" stroke="#64748b" strokeWidth="1" />
      <text x="275" y="80" textAnchor="start" fill="#f97316" fontSize="10">30亿</text>
      <line x1="270" y1="75" x2="275" y2="75" stroke="#64748b" strokeWidth="1" />
      <text x="275" y="125" textAnchor="start" fill="#f97316" fontSize="10">20亿</text>
      <line x1="270" y1="120" x2="275" y2="120" stroke="#64748b" strokeWidth="1" />
      <text x="275" y="170" textAnchor="start" fill="#f97316" fontSize="10">10亿</text>
      <line x1="270" y1="165" x2="275" y2="165" stroke="#64748b" strokeWidth="1" />
      <polyline
        points="60,120 130,95 200,85 260,75"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="120" r="4" fill="#60a5fa" />
      <circle cx="130" cy="95" r="4" fill="#60a5fa" />
      <circle cx="200" cy="85" r="4" fill="#60a5fa" />
      <circle cx="260" cy="75" r="4" fill="#60a5fa" />
      <text x="60" y="138" textAnchor="middle" fill="#cbd5e1" fontSize="10">2023</text>
      <text x="130" y="138" textAnchor="middle" fill="#cbd5e1" fontSize="10">2024</text>
      <text x="200" y="138" textAnchor="middle" fill="#cbd5e1" fontSize="10">2025</text>
      <text x="260" y="138" textAnchor="middle" fill="#cbd5e1" fontSize="10">2026</text>
      <polyline
        points="60,165 130,135 200,105 260,75"
        fill="none"
        stroke="#f97316"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 3"
      />
      <circle cx="60" cy="165" r="4" fill="#f97316" />
      <circle cx="130" cy="135" r="4" fill="#f97316" />
      <circle cx="200" cy="105" r="4" fill="#f97316" />
      <circle cx="260" cy="75" r="4" fill="#f97316" />
      <g transform="translate(70, 10)">
        <rect width="10" height="10" rx="2" fill="#60a5fa" />
        <text x="16" y="9" fill="#cbd5e1" fontSize="10">A公司（左轴）</text>
        <rect x="100" width="10" height="10" rx="2" fill="#f97316" />
        <text x="116" y="9" fill="#cbd5e1" fontSize="10">B公司（右轴）</text>
      </g>
    </svg>
  </div>
);

const CATEGORY_META: Record<CategoryType, {
  label: string;
  emoji: string;
  color: string;
  icon: typeof Newspaper;
}> = {
  "fake-news": { label: "假新闻判断", emoji: "📰", color: "#ff006e", icon: Newspaper },
  "visual-mislead": { label: "视觉误导", emoji: "📊", color: "#ffbe0b", icon: BarChart3 },
  "probability-illusion": { label: "概率错觉", emoji: "🎲", color: "#00d4ff", icon: Dice6 },
  "risk-judgment": { label: "风险判断", emoji: "⚠️", color: "#e63946", icon: ShieldAlert },
};

const BIAS_META: Record<BiasType, {
  name: string;
  chineseName: string;
  color: string;
  description: string;
}> = {
  "confirmation-bias": {
    name: "Confirmation Bias",
    chineseName: "确认偏误",
    color: "#9d4edd",
    description: "倾向于寻找、解释和记忆能证实自己已有想法的信息，忽略反面证据。",
  },
  "availability-heuristic": {
    name: "Availability Heuristic",
    chineseName: "可得性启发",
    color: "#ff006e",
    description: "根据记忆中容易想到的例子来判断事件发生的概率——越是印象深刻的事，越觉得它常发生。",
  },
  "anchoring-effect": {
    name: "Anchoring Effect",
    chineseName: "锚定效应",
    color: "#fb5607",
    description: "过度依赖获得的第一个信息（锚点）来做后续判断，即使这个信息可能完全无关。",
  },
  "framing-effect": {
    name: "Framing Effect",
    chineseName: "框架效应",
    color: "#00d4ff",
    description: "同一个事实，用不同的方式表达（收益框架vs损失框架），会导致截然不同的决策。",
  },
  "loss-aversion": {
    name: "Loss Aversion",
    chineseName: "损失厌恶",
    color: "#e63946",
    description: "损失带来的痛苦大约是收益带来快乐的2-2.5倍，因此人们会冒更大风险去避免损失。",
  },
  "affect-heuristic": {
    name: "Affect Heuristic",
    chineseName: "情感启发",
    color: "#f72585",
    description: "根据当前的情绪感觉（好/坏）来做判断和决策，而不是基于客观数据。",
  },
  "bandwagon-effect": {
    name: "Bandwagon Effect",
    chineseName: "从众效应",
    color: "#7209b7",
    description: "因为'大家都这么想/这么做'，就认为这是对的，不加独立思考地跟随。",
  },
  "base-rate-neglect": {
    name: "Base Rate Neglect",
    chineseName: "基础概率忽略",
    color: "#3a86ff",
    description: "判断概率时忽略统计学上的基础概率（先验概率），只关注当前个案的具体信息。",
  },
  "sunk-cost-fallacy": {
    name: "Sunk Cost Fallacy",
    chineseName: "沉没成本谬误",
    color: "#ff9e00",
    description: "因为已经投入了时间、金钱、精力，即使继续下去只会更糟，也舍不得'止损'。",
  },
  "gamblers-fallacy": {
    name: "Gambler's Fallacy",
    chineseName: "赌徒谬误",
    color: "#06ffa5",
    description: "认为如果某事最近频繁发生，接下来就'该'不发生了（或者反过来），但独立事件的概率是不变的。",
  },
  "overconfidence-bias": {
    name: "Overconfidence Bias",
    chineseName: "过度自信",
    color: "#38b000",
    description: "高估自己的知识、能力和判断的准确性，认为自己比实际更聪明、更厉害。",
  },
  "hindsight-bias": {
    name: "Hindsight Bias",
    chineseName: "事后诸葛亮",
    color: "#bc00dd",
    description: "事情发生后，觉得自己'早就预见到了'，但事实上事前根本没那么确定。",
  },
};

const QUESTIONS: Question[] = [
  {
    id: "fn-1",
    category: "fake-news",
    categoryIndex: 0,
    questionNumber: 1,
    title: "你看到一条朋友圈消息说：'某品牌手机电池爆炸，3人重伤！赶紧转发警告家人！'配了一张手机冒烟的模糊照片。你第一反应是？",
    options: [
      { id: "a", label: "太可怕了！赶紧转发给家人朋友", isDeceptive: true },
      { id: "b", label: "先等等，我去查查权威媒体有没有报道", isDeceptive: false },
      { id: "c", label: "手机爆炸不是第一次听说了，应该是真的", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "availability-heuristic",
    biasExplanation: "模糊图片+情绪化措辞是典型的'低质量信息包'。你的可得性启发被激活了——因为曾经看过类似的新闻报道，就觉得'肯定是真的'。但真正的新闻会有明确的时间、地点、来源、当事人信息，而这一条什么都没有。",
  },
  {
    id: "fn-2",
    category: "fake-news",
    categoryIndex: 0,
    questionNumber: 2,
    title: "某公众号文章说：'常吃XX粥可以抗癌降三高，我丈母娘喝了3个月，晚期肿瘤都没了！'文章下面有2000多条评论，大家都说'太神奇了，我也在喝'。你觉得？",
    options: [
      { id: "a", label: "这么多人验证了，一定有效果，我也买来试试", isDeceptive: true },
      { id: "b", label: "个案说明不了什么，要看有没有正规医学论文支持", isDeceptive: false },
      { id: "c", label: "宁可信其有，反正喝粥对身体也没坏处", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "bandwagon-effect",
    biasExplanation: "2000条评论 = '大家都信' = 从众效应被激活。你还同时中了情感启发——'丈母娘'这个词让人联想到亲情，降低了警惕。个案（n=1）在医学上没有任何意义，评论区也可能是刷的。真正有效的疗法需要双盲随机对照试验。",
  },
  {
    id: "fn-3",
    category: "fake-news",
    categoryIndex: 0,
    questionNumber: 3,
    title: "你对'某明星偷税漏税被抓'这件事半信半疑。刷微博时发现你关注的几个大V都在转发谴责这条消息，而且说得有鼻子有眼。你会？",
    options: [
      { id: "a", label: "连我关注的人都在说，看来是实锤了，转发加一锤", isDeceptive: true },
      { id: "b", label: "继续观望，等官方通报或者当事人回应", isDeceptive: false },
    ],
    correctOptionId: "b",
    targetBias: "confirmation-bias",
    biasExplanation: "你的确认偏误在起作用——你本来就'半信半疑'（倾向于相信），然后算法给你推的都是同样的信息，形成了'信息茧房'，让你觉得'证据确凿'。但大V们转发也可能是跟风，或者只是蹭流量。",
  },
  {
    id: "fn-4",
    category: "fake-news",
    categoryIndex: 0,
    questionNumber: 4,
    title: "一篇养生文章说：'每天喝8杯水的人患肾结石风险降低40%'。你之前就看过很多说'多喝水好'的文章，你觉得这个说法？",
    options: [
      { id: "a", label: "和我知道的知识一致，这个研究肯定是对的", isDeceptive: true },
      { id: "b", label: "得看看研究样本量、对照组、有没有排除其他因素", isDeceptive: false },
      { id: "c", label: "多喝水本来就没坏处，照做就是了", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "confirmation-bias",
    biasExplanation: "确认偏误：你之前就相信'多喝水好'，所以看到支持你观点的文章就自动默认是对的。但很多伪科学就是利用了这一点——把大家都认同的常识和一个未经证实的结论绑在一起，让你不假思索就接受。",
  },
  {
    id: "vm-1",
    category: "visual-mislead",
    categoryIndex: 1,
    questionNumber: 5,
    title: "下面是一张销售业绩对比柱状图，展示A、B产品的月销量。看完图后，你的直觉是？",
    visualHint: <TruncatedYAxisChart />,
    options: [
      { id: "a", label: "Y轴从哪开始不重要，看柱子高度差就够了", isDeceptive: true },
      { id: "b", label: "这是经典的截断Y轴手法，实际差距可能远没有看起来那么大", isDeceptive: false },
      { id: "c", label: "柱子高矮摆在那，视觉不会骗人", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "anchoring-effect",
    biasExplanation: "这是数据可视化最常见的骗术——截断Y轴。实际数据：A产品8500，B产品10000，只差了17.6%！但因为Y轴从8000开始，B的柱子高度是A的5倍（高150像素 vs 高30像素），视觉上B看起来是A的5倍销量。媒体、广告、PPT演讲中几乎每天都在用这个套路。",
  },
  {
    id: "vm-2",
    category: "visual-mislead",
    categoryIndex: 1,
    questionNumber: 6,
    title: "下面是一个3D饼图展示用户年龄分布。看完图后，你觉得？",
    visualHint: <Misleading3DPieChart />,
    options: [
      { id: "a", label: "饼图可能是2D转3D角度产生的视觉误差，数据应该是对的", isDeceptive: true },
      { id: "b", label: "饼图扇形面积和数据明显不符，这是在刻意误导读者", isDeceptive: false },
      { id: "c", label: "数字对就行，图形只是装饰", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "anchoring-effect",
    biasExplanation: "3D饼图是另一个经典骗术——透视角度会让靠近观察者的扇形看起来比实际大得多。加上人们本来就不擅长比较扇形面积（柱状图更容易准确比较），3D饼图几乎每次都是在刻意误导。真实数据：25-34岁占40%（最大），18-24岁35%，35岁以上25%（最小），但视觉上你会觉得蓝色的18-24岁组最大。",
  },
  {
    id: "vm-3",
    category: "visual-mislead",
    categoryIndex: 1,
    questionNumber: 7,
    title: "下面是一张折线图展示'某产品用户增长'。看完图后，你的直觉是？",
    visualHint: <InconsistentXAxisChart />,
    options: [
      { id: "a", label: "线一直在往上走，说明增长趋势很好、越来越快", isDeceptive: true },
      { id: "b", label: "坐标轴被改过了，这张图不能看，趋势很可能被美化了", isDeceptive: false },
      { id: "c", label: "可能只是数据更新频率变了，不影响趋势判断", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "framing-effect",
    biasExplanation: "改坐标轴刻度是'数据美容'的常用手法。看X轴标签：前两个点是'第1周'→'第8周'，差了7周但像素间隔只有80像素；后两个点是'第6月'→'第12月'，差了6个月但像素间隔也是80像素！X轴单位不一会让'增长放缓'被伪装成'持续高增长'。实际增速：前8周增长了30万（约每周3.75万），后面48周只增长了65万（约每周1.35万），增速已经大幅放缓了！专业做法是：坐标轴刻度必须等距、单位统一。",
  },
  {
    id: "vm-4",
    category: "visual-mislead",
    categoryIndex: 1,
    questionNumber: 8,
    title: "下面是一张双折线图对比A公司和B公司的营收增长。看完图后，你觉得？",
    visualHint: <DualYAxisChart />,
    options: [
      { id: "a", label: "两个公司营收都在涨，大家都很强，增长势头差不多", isDeceptive: true },
      { id: "b", label: "双Y轴不透明是典型的'混淆对比'，单独画才能看出真实差距", isDeceptive: false },
    ],
    correctOptionId: "b",
    targetBias: "anchoring-effect",
    biasExplanation: "双Y轴的暗黑用法：给两个规模完全不同的数据各自配一个Y轴，让小公司的暴涨线和大公司的稳步增长线看起来'差不多高'。真实数据：A公司从100亿到150亿（+50亿），B公司从10亿到30亿（+20亿），绝对值差了2.5倍！而且看2026年终点，两条线居然一样高——但一个是150亿，另一个是30亿，差了5倍！配合标题'A公司 vs B公司业绩对比'，读者会误以为两者在同一量级。",
  },
  {
    id: "pi-1",
    category: "probability-illusion",
    categoryIndex: 2,
    questionNumber: 9,
    title: "你连续抛硬币，已经连续5次正面了。下一次抛硬币，你觉得？",
    options: [
      { id: "a", label: "已经5次正面了，'该'出反面了吧，反面概率更大", isDeceptive: true },
      { id: "b", label: "每次独立，正反面概率还是各50%", isDeceptive: false },
      { id: "c", label: "手气好，继续正面的概率更大", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "gamblers-fallacy",
    biasExplanation: "赌徒谬误！硬币没有记忆，每一次抛掷都是独立事件，概率永远是各50%。同理，彩票连续10期没出某个号码，下一期出的概率也不会增加。但几乎所有赌徒都'感觉'概率会'自我修正'——这就是赌场赚钱的根本原因之一。",
  },
  {
    id: "pi-2",
    category: "probability-illusion",
    categoryIndex: 2,
    questionNumber: 10,
    title: "一种罕见病的发病率是0.1%（1000人里1人患病）。现在有一种检测方法：对真正患病的人准确率是99%（能查出99%的病人），对健康人也有1%的假阳性（把1%的健康人误判为患病）。如果检测结果是阳性，你觉得真正患病的概率大概是多少？",
    options: [
      { id: "a", label: "99%左右，准确率这么高肯定差不多", isDeceptive: true },
      { id: "b", label: "大约50%，一半一半", isDeceptive: true },
      { id: "c", label: "只有约9%，假阳性太多了", isDeceptive: false },
      { id: "d", label: "不到1%，几乎不可能真的得病", isDeceptive: true },
    ],
    correctOptionId: "c",
    targetBias: "base-rate-neglect",
    biasExplanation: "基础概率忽略！这题正确答案是约9%。用贝叶斯定理算：10000人中10人患病（0.1%），9990人健康。99%准确率意味着10个病人中9.9个被正确检出；1%假阳性意味着9990健康人中约99.9个被误判。总阳性=9.9+99.9≈110，真患病只有9.9，9.9/110=9%。当基础概率极低时，任何检测的阳性结果都必须打个大问号。",
  },
  {
    id: "pi-3",
    category: "probability-illusion",
    categoryIndex: 2,
    questionNumber: 11,
    title: "你打算买基金，看到经理A在宣传：'我的基金过去3年连续跑赢大盘！'你觉得这个经理是不是很厉害？",
    options: [
      { id: "a", label: "连续3年跑赢大盘，肯定有真本事", isDeceptive: true },
      { id: "b", label: "得看全市场有多少基金，如果有几千只，随机也会有人连续3年赢", isDeceptive: false },
      { id: "c", label: "3年已经很长了，足以证明实力", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "base-rate-neglect",
    biasExplanation: "基础概率忽略又出现了！假设全市场有10000只基金，每年跑赢大盘概率50%（近似随机），连续3年跑赢的预期数量是10000×(0.5)³=1250只。也就是说，即使所有基金经理都是扔飞镖选股，也会有1250个'三年常胜将军'出现在广告上。你看到的只是幸存者偏差筛选后的结果。",
  },
  {
    id: "pi-4",
    category: "probability-illusion",
    categoryIndex: 2,
    questionNumber: 12,
    title: "你在赌场玩轮盘，观察到过去10次结果中有8次是红色。你觉得下一把？",
    options: [
      { id: "a", label: "红色太热了，继续押红色", isDeceptive: true },
      { id: "b", label: "红了这么多次，下一把黑的概率更高", isDeceptive: true },
      { id: "c", label: "每次独立，红黑概率不变（忽略0），我不玩", isDeceptive: false },
    ],
    correctOptionId: "c",
    targetBias: "gamblers-fallacy",
    biasExplanation: "这道题同时测试两种方向的赌徒谬误：'热手谬误'（认为好运会持续）和'均值回归谬误'（认为运气会反转）。两者都是错的——轮盘每次转动都是独立事件。更重要的是：赌场的期望收益永远是正的（因为有0和00），长期来看你一定输。",
  },
  {
    id: "rj-1",
    category: "risk-judgment",
    categoryIndex: 3,
    questionNumber: 13,
    title: "医生给你两个选择来治疗一种罕见病：方案A：确定能救200人。方案B：有1/3概率救600人，2/3概率一个都救不了。你选哪个？",
    options: [
      { id: "a", label: "选A，确定救人，不要冒险", isDeceptive: true },
      { id: "b", label: "两个方案的数学期望一样（都是200），但我选A", isDeceptive: true },
      { id: "c", label: "数学期望一样，我无所谓，但这题换个说法我可能选反", isDeceptive: false },
    ],
    correctOptionId: "c",
    targetBias: "framing-effect",
    biasExplanation: "这就是著名的'亚洲病问题'，框架效应的经典实验。题目用'救多少人'（收益框架）来描述，大多数人选A（确定）。但如果换个说法：'方案A：确定死400人；方案B：1/3概率一个都不死，2/3概率死600人'（损失框架）——你猜怎么着？大多数人选B（冒险）！同一个数学问题，换个说法，决策完全相反。",
  },
  {
    id: "rj-2",
    category: "risk-judgment",
    categoryIndex: 3,
    questionNumber: 14,
    title: "你买了一张80元的电影票，到了影院发现票丢了。你会再花80元买一张吗？如果换个场景：你还没买票，但到了影院发现钱包里刚刚丢了80元现金，你还会花80元买票吗？",
    options: [
      { id: "a", label: "票丢了我不会再买，但丢80元现金我还是会买票——花的不是一个钱袋的钱", isDeceptive: true },
      { id: "b", label: "两种情况都是损失了80元，决策应该一样", isDeceptive: false },
      { id: "c", label: "票丢了那这电影注定跟我无缘，不看了", isDeceptive: true },
    ],
    correctOptionId: "b",
    targetBias: "sunk-cost-fallacy",
    biasExplanation: "这里同时考了心理账户和沉没成本。丢票=感觉'为电影花了160元'，心理账户觉得太贵；丢钱=只是'钱包少了80'，电影账户还是只花80。但理性来看，两种情况你此刻的总资产完全一样，要不要看电影只应该取决于电影值不值80元，和过去的损失无关。",
  },
  {
    id: "rj-3",
    category: "risk-judgment",
    categoryIndex: 3,
    questionNumber: 15,
    title: "假设你在一只股票上已经亏了5万元。现在有两个选择：A）立即止损卖出，确定亏5万。B）继续持有，有50%概率回本（不亏），50%概率再亏5万（总共亏10万）。你怎么选？",
    options: [
      { id: "a", label: "选B，死扛不卖，万一回本了呢？割肉太痛了", isDeceptive: true },
      { id: "b", label: "选A，亏了就亏了，现金为王，不承担额外风险", isDeceptive: false },
      { id: "c", label: "忽略已经亏的5万，只看这个股票未来值不值得持有", isDeceptive: false },
    ],
    correctOptionId: "c",
    targetBias: "loss-aversion",
    biasExplanation: "损失厌恶+沉没成本双重暴击！已经亏的5万是沉没成本，理性决策时必须完全忽略。你唯一应该问的问题是：'站在今天，这只股票未来上涨的概率和幅度是否值得我继续承担风险？'选B死扛不卖是典型的损失厌恶——为了避免'兑现损失'的痛苦，你愿意承担更大的风险。选A止损是合理的保守策略，但C才是最理性的：忽略沉没成本，只看未来。90%的散户会选B死扛，结果经常亏到退市。",
  },
  {
    id: "rj-4",
    category: "risk-judgment",
    categoryIndex: 3,
    questionNumber: 16,
    title: "你觉得下面哪种情况更可能让你死亡？A）飞机失事。B）走路时玩手机被车撞。C）在家里洗澡滑倒。D）长期久坐引发心血管疾病。",
    options: [
      { id: "a", label: "飞机失事最可怕，死亡概率最高", isDeceptive: true },
      { id: "b", label: "玩手机被车撞才是最常见的", isDeceptive: true },
      { id: "c", label: "洗澡滑倒经常在新闻里看到，这个多", isDeceptive: true },
      { id: "d", label: "长期久坐的慢性伤害才是真正的杀手", isDeceptive: false },
    ],
    correctOptionId: "d",
    targetBias: "availability-heuristic",
    biasExplanation: "可得性启发的经典案例！飞机失事一旦发生就是新闻头条，记忆极其鲜活，所以你大大高估了它的概率。但统计数据显示：全球每年死于飞机失事约500人（概率百万分之一级别），洗澡滑倒约7000人，交通事故（含走路玩手机）约135万人，而长期久坐引发的心血管疾病、糖尿病、癌症——每年上千万人死亡！但这些'慢死'不会上新闻，所以你感觉不到危险。",
  },
];

const ALL_BIASES: BiasType[] = [
  "confirmation-bias",
  "availability-heuristic",
  "anchoring-effect",
  "framing-effect",
  "loss-aversion",
  "affect-heuristic",
  "bandwagon-effect",
  "base-rate-neglect",
  "sunk-cost-fallacy",
  "gamblers-fallacy",
  "overconfidence-bias",
  "hindsight-bias",
];

const ALL_CATEGORIES: CategoryType[] = [
  "fake-news",
  "visual-mislead",
  "probability-illusion",
  "risk-judgment",
];

export default function CognitiveBias({
  onComplete,
  subExperiments,
}: CognitiveBiasProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);

  const [completed, setCompleted] = useState(false);

  const subList = subExperiments ?? [];

  const currentQuestion = QUESTIONS[currentQuestionIdx];
  const totalQuestions = QUESTIONS.length;
  const progress = Math.min(
    Math.floor(((currentQuestionIdx + (showExplanation ? 1 : 0)) / totalQuestions) * 100),
    100
  );

  const currentCategory = currentQuestion?.category;
  const currentCategoryMeta = currentCategory ? CATEGORY_META[currentCategory] : null;

  const categoryIdxMap = useMemo(() => {
    const map: Record<CategoryType, number> = {
      "fake-news": 0,
      "visual-mislead": 1,
      "probability-illusion": 2,
      "risk-judgment": 3,
    };
    return map;
  }, []);

  const currentSubIndex = currentQuestion
    ? categoryIdxMap[currentQuestion.category]
    : 0;

  const startGame = () => {
    setPhase("playing");
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnsweredQuestions([]);
    setCompleted(false);
  };

  const selectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedOption(optionId);
  };

  const confirmAnswer = () => {
    if (!selectedOption || !currentQuestion) return;

    const selectedOpt = currentQuestion.options.find((o) => o.id === selectedOption);
    const wasDeceived = selectedOpt?.isDeceptive ?? false;

    setAnsweredQuestions((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOptionId: selectedOption,
        wasDeceived,
        targetBias: currentQuestion.targetBias,
        category: currentQuestion.category,
      },
    ]);

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setPhase("result");
    }
  };

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    onComplete();
  };

  const biasStats = useMemo(() => {
    const stats = ALL_BIASES.reduce(
      (acc, b) => {
        acc[b] = { total: 0, deceived: 0 };
        return acc;
      },
      {} as Record<BiasType, { total: number; deceived: number }>
    );
    answeredQuestions.forEach((aq) => {
      stats[aq.targetBias].total += 1;
      if (aq.wasDeceived) {
        stats[aq.targetBias].deceived += 1;
      }
    });
    return stats;
  }, [answeredQuestions]);

  const categoryStats = useMemo(() => {
    const stats = ALL_CATEGORIES.reduce(
      (acc, c) => {
        acc[c] = { total: 0, deceived: 0 };
        return acc;
      },
      {} as Record<CategoryType, { total: number; deceived: number }>
    );
    answeredQuestions.forEach((aq) => {
      stats[aq.category].total += 1;
      if (aq.wasDeceived) {
        stats[aq.category].deceived += 1;
      }
    });
    return stats;
  }, [answeredQuestions]);

  const totalDeceived = answeredQuestions.filter((a) => a.wasDeceived).length;
  const deceptionRate = answeredQuestions.length > 0 ? totalDeceived / answeredQuestions.length : 0;

  const getVulnerabilityLabel = (rate: number) => {
    if (rate >= 0.6) return { label: "严重漏洞", color: "#ff006e", emoji: "🚨" };
    if (rate >= 0.4) return { label: "明显弱点", color: "#fb5607", emoji: "⚠️" };
    if (rate >= 0.2) return { label: "轻微风险", color: "#ffbe0b", emoji: "🔔" };
    return { label: "防御优秀", color: "#06ffa5", emoji: "🛡️" };
  };

  const overallStatus = getVulnerabilityLabel(deceptionRate);

  const getTopBiases = (count: number = 3) => {
    return ALL_BIASES
      .filter((b) => biasStats[b].total > 0)
      .map((b) => ({
        bias: b,
        rate: biasStats[b].total > 0 ? biasStats[b].deceived / biasStats[b].total : 0,
        total: biasStats[b].total,
        deceived: biasStats[b].deceived,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, count);
  };

  const getOverallAnalysis = () => {
    const top = getTopBiases(2);
    if (deceptionRate >= 0.6) {
      return {
        title: "你的大脑是骗子的完美目标",
        description: `你被"骗"的次数超过了60%。别难过——这说明你的系统1（直觉系统）非常活跃，而这是大多数人的常态。你最弱的偏差是${top
          .map((t) => BIAS_META[t.bias].chineseName)
          .join("、")}。好消息是：只要知道这些偏差的存在，下次遇到类似场景时，你就可以主动调用系统2（理性系统）来慢下来思考。意识到偏差是克服偏差的第一步。`,
      };
    }
    if (deceptionRate >= 0.4) {
      return {
        title: "你有几个明显的认知弱点",
        description: `你的受骗率在40%-60%之间，属于典型的人类水平。${top
          .map((t) => BIAS_META[t.bias].chineseName)
          .join("和")}在你身上表现比较明显。这些偏差在日常生活中很难完全避免，但下次在做重要决策（花钱、投资、买东西）之前，不妨先问问自己："我是不是被XX偏差影响了？"多花30秒想一想，结果可能完全不同。`,
      };
    }
    if (deceptionRate >= 0.2) {
      return {
        title: "你的认知防御能力不错",
        description: `只有不到40%的题"骗"到了你，说明你经常会停下来理性思考。你最弱的地方是${top
          .map((t) => BIAS_META[t.bias].chineseName)
          .join("和")}——但总体来说，你的系统2已经相当勤奋了。不过要注意：人在疲劳、压力大、情绪激动时，系统1会接管，这时候最容易上当。重要决策尽量在状态好的时候做。`,
      };
    }
    return {
      title: "你的认知防御能力非常出色",
      description: `太棒了！你成功抵御了大多数认知陷阱，受骗率不到20%。你在${ALL_BIASES.filter(
        (b) => biasStats[b].total > 0 && biasStats[b].deceived === 0
      )
        .map((b) => BIAS_META[b].chineseName)
        .slice(0, 2)
        .join("、")}方面几乎没有弱点。不过永远不要掉以轻心——骗子和设计师们每天都在研究新的套路。持续学习、保持谦逊、定期反思，是防止认知老化的最好方式。`,
    };
  };

  const renderHeatmap = () => {
    return (
      <div className="glass-card p-6 md:p-8">
        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Flame className="w-5 h-5" style={{ color: "#e63946" }} />
          认知漏洞热力图
        </h4>
        <p className="text-sm text-museum-300/60 mb-6">
          颜色越深代表该类偏差对你影响越大，也就是你最大的认知"后门"。
        </p>

        <div className="mb-6">
          <p className="text-sm text-museum-200/80 font-medium mb-3">按偏差类型维度</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_BIASES.filter((b) => biasStats[b].total > 0).map((bias) => {
              const meta = BIAS_META[bias];
              const s = biasStats[bias];
              const rate = s.total > 0 ? s.deceived / s.total : 0;
              const intensity = Math.min(1, rate * 1.5);

              return (
                <div
                  key={bias}
                  className="p-4 rounded-xl relative overflow-hidden transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${meta.color}${Math.round(
                      5 + intensity * 45
                    ).toString(16).padStart(2, "0")}, rgba(26,26,62,0.6))`,
                    border: `1px solid ${meta.color}${Math.round(
                      20 + intensity * 60
                    ).toString(16).padStart(2, "0")}`,
                    boxShadow: intensity > 0.4 ? `0 0 20px ${meta.color}${Math.round(intensity * 40).toString(16).padStart(2, "0")}` : "none",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-lg">{rate > 0.6 ? "🔥" : rate > 0.3 ? "⚠️" : "🛡️"}</div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: meta.color }}
                    >
                      {Math.round(rate * 100)}%
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{meta.chineseName}</p>
                  <p className="text-xs text-museum-300/60 mb-2">
                    受骗 {s.deceived}/{s.total} 题
                  </p>
                  <div className="h-1.5 bg-museum-900/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${rate * 100}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-sm text-museum-200/80 font-medium mb-3">按题目类型维度</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const s = categoryStats[cat];
              const rate = s.total > 0 ? s.deceived / s.total : 0;
              const intensity = Math.min(1, rate * 1.5);

              return (
                <div
                  key={cat}
                  className="p-5 rounded-xl relative overflow-hidden transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${meta.color}${Math.round(
                      8 + intensity * 42
                    ).toString(16).padStart(2, "0")}, rgba(26,26,62,0.6))`,
                    border: `1px solid ${meta.color}${Math.round(
                      25 + intensity * 55
                    ).toString(16).padStart(2, "0")}`,
                  }}
                >
                  <div className="text-3xl mb-3">{meta.emoji}</div>
                  <p className="text-base font-medium text-white mb-1">{meta.label}</p>
                  <p className="text-xs text-museum-300/60 mb-3">
                    受骗 {s.deceived}/{s.total} 题
                  </p>
                  <div className="flex items-end gap-2 mb-2">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: meta.color }}
                    >
                      {Math.round(rate * 100)}
                    </span>
                    <span className="text-sm text-museum-300/50 mb-1">%</span>
                  </div>
                  <div className="h-2 bg-museum-900/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${rate * 100}%`,
                        background: `linear-gradient(90deg, ${meta.color}, ${meta.color}dd)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "#06ffa530", border: "1px solid #06ffa560" }} />
            <span className="text-museum-300/60">低风险</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "#ffbe0b50", border: "1px solid #ffbe0b80" }} />
            <span className="text-museum-300/60">中风险</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "#ff006e60", border: "1px solid #ff006ea0", boxShadow: "0 0 10px #ff006e40" }} />
            <span className="text-museum-300/60">高风险</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {phase !== "result" && subList.length > 0 && (
        <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
          {subList.map((sub, idx) => {
            const cat = ALL_CATEGORIES[idx];
            const catMeta = cat ? CATEGORY_META[cat] : null;
            const active = idx === currentSubIndex;
            const allInCategoryDone =
              cat &&
              QUESTIONS.filter((q) => q.category === cat).every((q) =>
                answeredQuestions.some((a) => a.questionId === q.id)
              );

            return (
              <div key={sub.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    allInCategoryDone
                      ? "text-neon-green border border-neon-green/40"
                      : active
                      ? "text-neon-purple border border-neon-purple/40 animate-pulse"
                      : "text-museum-300/50 border border-white/10"
                  }`}
                  style={{
                    background: allInCategoryDone
                      ? "rgba(6, 255, 165, 0.15)"
                      : active
                      ? `${catMeta?.color}20`
                      : "rgba(26, 26, 62, 0.6)",
                  }}
                >
                  {allInCategoryDone ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span style={active ? { color: catMeta?.color } : undefined}>{idx + 1}</span>
                  )}
                </div>
                {idx < subList.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 transition-all ${
                      allInCategoryDone ? "bg-neon-green/40" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="glass-card p-6 md:p-8">
        {phase === "intro" && (
          <div className="text-center animate-fade-in">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: "linear-gradient(135deg, rgba(230, 57, 70, 0.3), rgba(255, 0, 110, 0.25))",
                boxShadow: "0 0 30px rgba(230, 57, 70, 0.35)",
              }}
            >
              <Shield className="w-10 h-10" style={{ color: "#e63946" }} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">认知漏洞检测</h3>
            <p className="text-museum-200/80 mb-6 leading-relaxed">
              你将面对 <span className="font-bold" style={{ color: "#ff006e" }}>16道</span> 精心设计的"陷阱题"，
              涵盖4大类认知骗局。准备好了吗？
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
              {ALL_CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const CatIcon = meta.icon;
                const catCount = QUESTIONS.filter((q) => q.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="p-4 rounded-xl text-left"
                    style={{
                      background: `${meta.color}10`,
                      border: `1px solid ${meta.color}30`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${meta.color}25` }}
                      >
                        <CatIcon className="w-5 h-5" style={{ color: meta.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{meta.label}</p>
                        <p className="text-xs text-museum-300/60">{catCount} 道题</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="p-4 rounded-xl mb-8 max-w-lg mx-auto text-left"
              style={{
                background: "rgba(230, 57, 70, 0.08)",
                border: "1px solid rgba(230, 57, 70, 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" style={{ color: "#e63946" }} />
                <span className="text-sm font-bold text-white">测试规则</span>
              </div>
              <ul className="space-y-2 text-sm text-museum-200/70">
                <li className="flex items-start gap-2">
                  <span style={{ color: "#e63946" }}>·</span>
                  <span>请凭<strong>第一直觉</strong>快速作答，不要想太久——我们测试的就是自动化偏差</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#e63946" }}>·</span>
                  <span>每题答完会告诉你<strong>是否上当</strong>，以及对应的认知偏差</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#e63946" }}>·</span>
                  <span>全部答完后生成你的<strong>专属认知漏洞热力图</strong></span>
                </li>
              </ul>
            </div>

            <button onClick={startGame} className="btn-primary">
              开始测试
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {phase === "playing" && currentQuestion && currentCategoryMeta && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${currentCategoryMeta.color}20`,
                    border: `1px solid ${currentCategoryMeta.color}40`,
                  }}
                >
                  <span className="text-2xl">{currentCategoryMeta.emoji}</span>
                </div>
                <div>
                  <p className="text-xs text-museum-300/60 mb-0.5">
                    第 {currentQuestion.questionNumber} / {totalQuestions} 题
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: currentCategoryMeta.color }}
                  >
                    {currentCategoryMeta.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-museum-300/50">已上当</span>
                <span
                  className="font-bold text-lg"
                  style={{ color: answeredQuestions.filter((a) => a.wasDeceived).length > 0 ? "#ff006e" : "#06ffa5" }}
                >
                  {totalDeceived}
                </span>
                <span className="text-museum-300/50">次</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-museum-800 rounded-full overflow-hidden mb-8">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${currentCategoryMeta.color}, #9d4edd)`,
                }}
              />
            </div>

            <div className="mb-8">
              <h4 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {currentQuestion.title}
              </h4>
            </div>

            {currentQuestion.visualHint && (
              <div className="mb-6">
                {currentQuestion.visualHint}
              </div>
            )}

            {!showExplanation ? (
              <div>
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectOption(opt.id)}
                        className={`w-full p-5 rounded-2xl text-left transition-all ${
                          isSelected
                            ? "scale-[1.01]"
                            : "hover:scale-[1.005]"
                        }`}
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, #9d4edd30, #4040f520)`
                            : "rgba(255, 255, 255, 0.04)",
                          border: isSelected
                            ? "2px solid #9d4edd"
                            : "1px solid rgba(255, 255, 255, 0.12)",
                          boxShadow: isSelected
                            ? "0 0 25px rgba(157, 78, 221, 0.3)"
                            : "none",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                              isSelected ? "text-white" : "text-museum-300/60"
                            }`}
                            style={{
                              background: isSelected
                                ? "linear-gradient(135deg, #9d4edd, #4040f5)"
                                : "rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            {String.fromCharCode(65 + currentQuestion.options.findIndex((o) => o.id === opt.id))}
                          </div>
                          <p
                            className={`text-sm md:text-base leading-relaxed ${
                              isSelected ? "text-white font-medium" : "text-museum-200/85"
                            }`}
                          >
                            {opt.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={confirmAnswer}
                    disabled={!selectedOption}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    确认答案
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                {(() => {
                  const selectedOpt = currentQuestion.options.find(
                    (o) => o.id === selectedOption
                  );
                  const wasDeceived = selectedOpt?.isDeceptive ?? false;
                  const biasMeta = BIAS_META[currentQuestion.targetBias];
                  const correctOpt = currentQuestion.options.find(
                    (o) => o.id === currentQuestion.correctOptionId
                  );

                  return (
                    <div>
                      <div
                        className={`p-6 rounded-2xl mb-6 ${
                          wasDeceived ? "" : ""
                        }`}
                        style={{
                          background: wasDeceived
                            ? "linear-gradient(135deg, rgba(255, 0, 110, 0.15), rgba(230, 57, 70, 0.08))"
                            : "linear-gradient(135deg, rgba(6, 255, 165, 0.15), rgba(0, 212, 255, 0.08))",
                          border: wasDeceived
                            ? "1px solid rgba(255, 0, 110, 0.4)"
                            : "1px solid rgba(6, 255, 165, 0.4)",
                          boxShadow: wasDeceived
                            ? "0 0 30px rgba(255, 0, 110, 0.2)"
                            : "0 0 30px rgba(6, 255, 165, 0.15)",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {wasDeceived ? (
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ background: "rgba(255, 0, 110, 0.3)" }}
                            >
                              <X className="w-6 h-6" style={{ color: "#ff006e" }} />
                            </div>
                          ) : (
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ background: "rgba(6, 255, 165, 0.3)" }}
                            >
                              <Check className="w-6 h-6 text-neon-green" />
                            </div>
                          )}
                          <div>
                            <p
                              className="text-xl font-bold"
                              style={{
                                color: wasDeceived ? "#ff006e" : "#06ffa5",
                              }}
                            >
                              {wasDeceived ? "😵 你上当了！" : "🛡️ 防御成功！"}
                            </p>
                            <p className="text-sm text-museum-200/70">
                              {wasDeceived
                                ? "别沮丧，90%的人都会在这里栽跟头"
                                : "干得漂亮，你的系统2成功拦截了偏差"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-museum-300/50">你的选择：</span>
                            <span className={wasDeceived ? "text-pink-400 ml-1" : "text-neon-green ml-1"}>
                              {String.fromCharCode(65 + currentQuestion.options.findIndex((o) => o.id === selectedOption))}. {selectedOpt?.label}
                            </span>
                          </div>
                          {wasDeceived && correctOpt && (
                            <div>
                              <span className="text-museum-300/50">正确选项：</span>
                              <span className="text-neon-green ml-1">
                                {String.fromCharCode(65 + currentQuestion.options.findIndex((o) => o.id === correctOpt.id))}. {correctOpt.label}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="p-6 rounded-2xl mb-8"
                        style={{
                          background: `${biasMeta.color}10`,
                          border: `1px solid ${biasMeta.color}35`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${biasMeta.color}25` }}
                          >
                            <Sparkles className="w-5 h-5" style={{ color: biasMeta.color }} />
                          </div>
                          <div>
                            <p
                              className="text-sm font-bold"
                              style={{ color: biasMeta.color }}
                            >
                              🔬 对应偏差：{biasMeta.chineseName}
                            </p>
                            <p className="text-xs text-museum-300/50">
                              {biasMeta.name}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-museum-200/85 leading-relaxed">
                          {currentQuestion.biasExplanation}
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <button onClick={nextQuestion} className="btn-primary">
                          {currentQuestionIdx < totalQuestions - 1 ? "下一题" : "查看认知漏洞报告"}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {phase === "result" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                style={{
                  background: `linear-gradient(135deg, ${overallStatus.color}30, #9d4edd20)`,
                  boxShadow: `0 0 40px ${overallStatus.color}40`,
                }}
              >
                <span className="text-4xl">{overallStatus.emoji}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                认知漏洞检测完成！
              </h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    background: `${overallStatus.color}18`,
                    color: overallStatus.color,
                    border: `1px solid ${overallStatus.color}40`,
                  }}
                >
                  总体评级：{overallStatus.label}
                </div>
              </div>
              <p className="text-museum-200/70 max-w-2xl mx-auto">
                你一共被骗了 <span className="text-pink-400 font-bold">{totalDeceived}</span> 次，
                受骗率 <span className="text-pink-400 font-bold">{Math.round(deceptionRate * 100)}%</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
              {ALL_CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const s = categoryStats[cat];
                return (
                  <div
                    key={cat}
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: `${meta.color}08`,
                      border: `1px solid ${meta.color}25`,
                    }}
                  >
                    <div className="text-2xl mb-2">{meta.emoji}</div>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: meta.color }}
                    >
                      {s.deceived}
                      <span className="text-sm text-museum-300/40">/{s.total}</span>
                    </div>
                    <p className="text-xs text-museum-300/60">{meta.label}</p>
                  </div>
                );
              })}
            </div>

            {(() => {
              const analysis = getOverallAnalysis();
              return (
                <div
                  className="p-6 rounded-2xl max-w-2xl mx-auto mb-8"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(157, 78, 221, 0.12), rgba(0, 212, 255, 0.08))",
                    border: "1px solid rgba(157, 78, 221, 0.3)",
                  }}
                >
                  <h4 className="text-lg font-bold text-white mb-3">{analysis.title}</h4>
                  <p className="text-sm text-museum-200/80 leading-relaxed">
                    {analysis.description}
                  </p>
                </div>
              );
            })()}

            <div className="mb-8">
              {renderHeatmap()}
            </div>

            {getTopBiases(3).length > 0 && (
              <div className="glass-card p-6 md:p-8 mb-8">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-neon-yellow" />
                  你的 Top 3 高危偏差
                </h4>
                <div className="space-y-4">
                  {getTopBiases(3).map((item, idx) => {
                    const meta = BIAS_META[item.bias];
                    return (
                      <div
                        key={item.bias}
                        className="flex items-start gap-4 p-4 rounded-xl"
                        style={{
                          background: `${meta.color}08`,
                          border: `1px solid ${meta.color}25`,
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                          style={{
                            background: `${meta.color}20`,
                            color: meta.color,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-base font-bold text-white">
                              {meta.chineseName}
                            </p>
                            <span
                              className="text-sm font-bold"
                              style={{ color: meta.color }}
                            >
                              受骗率 {Math.round(item.rate * 100)}%
                            </span>
                          </div>
                          <p className="text-xs text-museum-300/60 mb-2">
                            {item.deceived}/{item.total} 题中招 · {meta.name}
                          </p>
                          <p className="text-sm text-museum-200/75 leading-relaxed">
                            {meta.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={handleComplete}
                disabled={completed}
                className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Brain className="w-4 h-4" />
                {completed ? "正在生成..." : "查看脑区参与链路"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
