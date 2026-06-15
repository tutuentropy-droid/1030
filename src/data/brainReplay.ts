import { brainRegions, getBrainRegionById } from "./brainRegions";

export interface BehaviorInput {
  sleepHours: number;
  videoTime: number;
  exerciseMinutes: number;
  studyHours: number;
  socialHours: number;
}

export interface NeuroState {
  id: string;
  name: string;
  chineseName: string;
  level: number;
  color: string;
  description: string;
  affectedBy: string[];
}

export interface BrainRegionState {
  id: string;
  name: string;
  chineseName: string;
  activity: number;
  color: string;
  emoji: string;
  explanation: string;
}

export interface RecommendedExperiment {
  experimentId: string;
  reason: string;
  connectionType: "similar-state" | "contrast" | "deep-dive";
}

export interface BehaviorEffect {
  behaviorId: string;
  behaviorName: string;
  emoji: string;
  neuroEffects: {
    neuroStateId: string;
    impact: number;
    description: string;
  }[];
  regionEffects: {
    regionId: string;
    activityChange: number;
    description: string;
  }[];
  relatedExperiments: string[];
}

export const NEURO_STATES: Omit<NeuroState, "level">[] = [
  {
    id: "dopamine-balance",
    name: "Dopamine Balance",
    chineseName: "多巴胺平衡",
    color: "#06ffa5",
    description: "多巴胺系统的敏感度与耐受性。过度刺激会导致受体脱敏，需要更多刺激才能获得愉悦感。",
    affectedBy: [],
  },
  {
    id: "attention-reserve",
    name: "Attention Reserve",
    chineseName: "注意力储备",
    color: "#ffbe0b",
    description: "前额叶的注意力控制资源。持续的认知消耗会降低注意力储备，导致分心和决策疲劳。",
    affectedBy: [],
  },
  {
    id: "memory-consolidation",
    name: "Memory Consolidation",
    chineseName: "记忆巩固水平",
    color: "#ff006e",
    description: "海马体将短期记忆转化为长期记忆的能力。睡眠是记忆巩固的关键窗口。",
    affectedBy: [],
  },
  {
    id: "amygdala-arousal",
    name: "Amygdala Arousal",
    chineseName: "杏仁核唤醒度",
    color: "#ff5c8a",
    description: "情绪中枢的激活水平。过高会导致焦虑和冲动决策，过低则会缺乏动力。",
    affectedBy: [],
  },
  {
    id: "neuro-plasticity",
    name: "Neuro Plasticity",
    chineseName: "神经可塑性",
    color: "#9d4edd",
    description: "大脑形成新连接的能力。运动和学习促进可塑性，久坐和单调环境削弱它。",
    affectedBy: [],
  },
  {
    id: "dmn-activation",
    name: "Default Mode Network",
    chineseName: "默认模式网络激活",
    color: "#f72585",
    description: "大脑'离线'状态下的自发思维系统。过度激活与反刍和焦虑相关，适当激活有利于创意。",
    affectedBy: [],
  },
];

export const BEHAVIOR_EFFECTS: BehaviorEffect[] = [
  {
    behaviorId: "sleep",
    behaviorName: "睡眠",
    emoji: "🌙",
    neuroEffects: [
      {
        neuroStateId: "memory-consolidation",
        impact: 1,
        description: "睡眠期间海马体将白天的记忆'回放'并转移到大脑皮层",
      },
      {
        neuroStateId: "attention-reserve",
        impact: 1,
        description: "充足睡眠让前额叶的注意力资源完全恢复",
      },
      {
        neuroStateId: "amygdala-arousal",
        impact: -0.8,
        description: "睡眠不足会导致杏仁核过度活跃，情绪波动增大",
      },
      {
        neuroStateId: "neuro-plasticity",
        impact: 0.6,
        description: "睡眠中突触修剪巩固重要连接，删除无用连接",
      },
    ],
    regionEffects: [
      {
        regionId: "hippocampus",
        activityChange: 1,
        description: "海马体在NREM睡眠中进行记忆回放和巩固",
      },
      {
        regionId: "prefrontal-cortex",
        activityChange: 0.8,
        description: "前额叶在睡眠中恢复能量，为第二天的决策做准备",
      },
      {
        regionId: "amygdala",
        activityChange: -0.6,
        description: "睡眠不足会让杏仁核与前额叶的连接减弱，情绪调节失控",
      },
      {
        regionId: "pons",
        activityChange: 0.9,
        description: "脑桥在REM睡眠中发出PGO波，驱动梦境生成",
      },
    ],
    relatedExperiments: ["dream-neuroscience", "memory-illusion", "time-illusion"],
  },
  {
    behaviorId: "video",
    behaviorName: "刷视频",
    emoji: "📱",
    neuroEffects: [
      {
        neuroStateId: "dopamine-balance",
        impact: -1,
        description: "短视频的可变奖励模式疯狂刺激多巴胺释放，导致受体脱敏",
      },
      {
        neuroStateId: "attention-reserve",
        impact: -0.7,
        description: "15秒切换一次内容，让顶叶的注意力过滤系统持续过载",
      },
      {
        neuroStateId: "dmn-activation",
        impact: -0.5,
        description: "持续的外部输入抑制默认模式网络，大脑无法'离线'处理信息",
      },
      {
        neuroStateId: "memory-consolidation",
        impact: -0.3,
        description: "碎片化信息占用工作记忆，干扰海马体的记忆编码",
      },
    ],
    regionEffects: [
      {
        regionId: "ventral-tegmental-area",
        activityChange: 1.2,
        description: "VTA持续释放多巴胺，但受体逐渐脱敏，需要更强刺激",
      },
      {
        regionId: "nucleus-accumbens",
        activityChange: 1,
        description: "伏隔核不断接收到多巴胺信号，奖励阈值被抬高",
      },
      {
        regionId: "prefrontal-cortex",
        activityChange: -0.6,
        description: "前额叶的执行控制功能被抑制，冲动控制能力下降",
      },
      {
        regionId: "parietal-lobe",
        activityChange: -0.4,
        description: "快速切换的视觉内容削弱了顶叶的持续注意力能力",
      },
    ],
    relatedExperiments: ["reward-circuit", "attention-blindspot", "time-illusion"],
  },
  {
    behaviorId: "exercise",
    behaviorName: "运动",
    emoji: "🏃",
    neuroEffects: [
      {
        neuroStateId: "neuro-plasticity",
        impact: 1,
        description: "有氧运动促进BDNF（脑源性神经营养因子）释放，增强神经可塑性",
      },
      {
        neuroStateId: "dopamine-balance",
        impact: 0.7,
        description: "自然的多巴胺释放，不会导致受体脱敏，反而提升基线水平",
      },
      {
        neuroStateId: "amygdala-arousal",
        impact: -0.6,
        description: "运动释放内啡肽和GABA，降低杏仁核的焦虑唤醒水平",
      },
      {
        neuroStateId: "attention-reserve",
        impact: 0.5,
        description: "运动后前额叶血流增加，注意力和执行功能暂时提升",
      },
    ],
    regionEffects: [
      {
        regionId: "hippocampus",
        activityChange: 0.8,
        description: "运动促进海马体神经发生，增加体积和记忆能力",
      },
      {
        regionId: "prefrontal-cortex",
        activityChange: 0.7,
        description: "前额叶血流和氧气供应增加，执行功能提升",
      },
      {
        regionId: "amygdala",
        activityChange: -0.5,
        description: "GABA和内啡肽抑制杏仁核过度活动，缓解焦虑",
      },
      {
        regionId: "reward-system",
        activityChange: 0.6,
        description: "跑步者高潮是内啡肽和多巴胺共同作用的结果",
      },
    ],
    relatedExperiments: ["reward-circuit", "time-illusion", "memory-illusion"],
  },
  {
    behaviorId: "study",
    behaviorName: "学习",
    emoji: "📚",
    neuroEffects: [
      {
        neuroStateId: "neuro-plasticity",
        impact: 0.8,
        description: "主动学习强化新突触连接，大脑结构发生实质性改变",
      },
      {
        neuroStateId: "attention-reserve",
        impact: -0.6,
        description: "深度思考消耗前额叶资源，需要休息来恢复",
      },
      {
        neuroStateId: "memory-consolidation",
        impact: 0.7,
        description: "编码后的记忆在随后的睡眠中被巩固为长期记忆",
      },
      {
        neuroStateId: "dmn-activation",
        impact: -0.3,
        description: "专注学习时默认模式网络被抑制，减少思维游荡",
      },
    ],
    regionEffects: [
      {
        regionId: "prefrontal-cortex",
        activityChange: 0.9,
        description: "前额叶高度活跃，进行工作记忆、逻辑推理和决策",
      },
      {
        regionId: "hippocampus",
        activityChange: 0.8,
        description: "海马体编码新信息，准备在睡眠中进行巩固",
      },
      {
        regionId: "parietal-lobe",
        activityChange: 0.6,
        description: "顶叶参与空间注意力和工作记忆的操作",
      },
      {
        regionId: "default-mode-network",
        activityChange: -0.5,
        description: "任务导向时DMN被抑制，防止无关思维干扰",
      },
    ],
    relatedExperiments: ["memory-illusion", "attention-blindspot", "cognitive-bias"],
  },
  {
    behaviorId: "social",
    behaviorName: "社交",
    emoji: "👥",
    neuroEffects: [
      {
        neuroStateId: "amygdala-arousal",
        impact: 0.4,
        description: "社交互动激活情绪中枢，愉悦的社交降低焦虑水平",
      },
      {
        neuroStateId: "dopamine-balance",
        impact: 0.5,
        description: "社交反馈（微笑、赞美、认同）自然触发多巴胺释放",
      },
      {
        neuroStateId: "dmn-activation",
        impact: 0.6,
        description: "社交中的心智化（理解他人想法）激活默认模式网络",
      },
      {
        neuroStateId: "attention-reserve",
        impact: -0.3,
        description: "复杂社交需要消耗认知资源来处理表情、语气和意图",
      },
    ],
    regionEffects: [
      {
        regionId: "amygdala",
        activityChange: 0.5,
        description: "杏仁核参与社交情绪识别，如辨别他人的表情和语气",
      },
      {
        regionId: "superior-temporal-sulcus",
        activityChange: 0.8,
        description: "STS检测生物运动、眼神方向和视听同步，理解他人意图",
      },
      {
        regionId: "ventral-tegmental-area",
        activityChange: 0.6,
        description: "社交奖励（被喜欢、被认同）激活VTA-伏隔核通路",
      },
      {
        regionId: "insula",
        activityChange: 0.5,
        description: "岛叶参与共情，感知他人的情绪和身体状态",
      },
    ],
    relatedExperiments: ["sensory-conflict", "reward-circuit", "cognitive-bias"],
  },
];

export function calculateNeuroStates(input: BehaviorInput): NeuroState[] {
  const weights = {
    sleep: Math.min(Math.max((input.sleepHours - 4) / 4, -1), 1),
    video: Math.min(Math.max(input.videoTime / 4, 0), 1),
    exercise: Math.min(Math.max(input.exerciseMinutes / 60, 0), 1),
    study: Math.min(Math.max(input.studyHours / 4, 0), 1),
    social: Math.min(Math.max(input.socialHours / 4, 0), 1),
  };

  const stateMap: Record<string, number> = {};
  NEURO_STATES.forEach((s) => (stateMap[s.id] = 0));

  BEHAVIOR_EFFECTS.forEach((behavior) => {
    const w = weights[behavior.behaviorId as keyof typeof weights] || 0;
    behavior.neuroEffects.forEach((effect) => {
      stateMap[effect.neuroStateId] += effect.impact * w;
    });
  });

  return NEURO_STATES.map((state) => ({
    ...state,
    level: Math.max(-1, Math.min(1, stateMap[state.id])),
  }));
}

export function calculateRegionStates(input: BehaviorInput): BrainRegionState[] {

  const weights = {
    sleep: Math.min(Math.max((input.sleepHours - 4) / 4, -1), 1),
    video: Math.min(Math.max(input.videoTime / 4, 0), 1),
    exercise: Math.min(Math.max(input.exerciseMinutes / 60, 0), 1),
    study: Math.min(Math.max(input.studyHours / 4, 0), 1),
    social: Math.min(Math.max(input.socialHours / 4, 0), 1),
  };

  const regionMap: Record<string, { activity: number; explanations: string[] }> = {};
  brainRegions.forEach((r: any) => {
    regionMap[r.id] = { activity: 0, explanations: [] };
  });

  BEHAVIOR_EFFECTS.forEach((behavior) => {
    const w = weights[behavior.behaviorId as keyof typeof weights] || 0;
    behavior.regionEffects.forEach((effect) => {
      if (regionMap[effect.regionId]) {
        regionMap[effect.regionId].activity += effect.activityChange * w;
        if (Math.abs(effect.activityChange * w) > 0.2) {
          regionMap[effect.regionId].explanations.push(
            `${behavior.emoji} ${behavior.behaviorName}：${effect.description}`
          );
        }
      }
    });
  });

  return brainRegions
    .map((region: any) => ({
      id: region.id,
      name: region.name,
      chineseName: region.chineseName,
      activity: Math.max(-1, Math.min(1, regionMap[region.id].activity)),
      color: region.color,
      emoji: region.emoji,
      explanation: regionMap[region.id].explanations.join("\n"),
    }))
    .filter((r: BrainRegionState) => Math.abs(r.activity) > 0.15)
    .sort((a: BrainRegionState, b: BrainRegionState) => Math.abs(b.activity) - Math.abs(a.activity));
}

interface BehaviorContext {
  mostExtremeBehavior: { id: string; name: string; emoji: string; weight: number } | null;
  extremeBehaviors: { id: string; name: string; emoji: string; weight: number; direction: "high" | "low" }[];
}

function analyzeBehaviorContext(input: BehaviorInput): BehaviorContext {
  const weights = {
    sleep: { weight: Math.min(Math.max((input.sleepHours - 4) / 4, -1), 1), name: "睡眠", emoji: "🌙", id: "sleep" },
    video: { weight: Math.min(Math.max(input.videoTime / 4, 0), 1), name: "刷视频", emoji: "📱", id: "video" },
    exercise: { weight: Math.min(Math.max(input.exerciseMinutes / 60, 0), 1), name: "运动", emoji: "🏃", id: "exercise" },
    study: { weight: Math.min(Math.max(input.studyHours / 4, 0), 1), name: "学习", emoji: "📚", id: "study" },
    social: { weight: Math.min(Math.max(input.socialHours / 4, 0), 1), name: "社交", emoji: "👥", id: "social" },
  };

  const extremeBehaviors: BehaviorContext["extremeBehaviors"] = [];
  Object.entries(weights).forEach(([_, w]) => {
    if (w.weight >= 0.6) {
      extremeBehaviors.push({ ...w, direction: "high" });
    } else if (w.weight <= -0.4) {
      extremeBehaviors.push({ ...w, direction: "low" });
    }
  });

  const sorted = Object.values(weights).sort(
    (a, b) => Math.abs(b.weight) - Math.abs(a.weight)
  );
  const mostExtreme = Math.abs(sorted[0].weight) >= 0.4 ? sorted[0] : null;

  return {
    mostExtremeBehavior: mostExtreme,
    extremeBehaviors,
  };
}

const EXPERIMENT_CONNECTIONS: Record<
  string,
  Record<
    string,
    { reason: (ctx: { behaviorName: string; emoji: string; stateName: string; activityPct: number; direction: "up" | "down" }) => string; type: "similar-state" | "contrast" | "deep-dive" }
  >
> = {
  "reward-circuit": {
    video: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 你今天${behaviorName}时间较长，多巴胺奖励系统可能处于过载状态。这个实验会让你亲自体验「即时满足 vs 长期收益」的神经战争，感受和你刷视频时一模一样的多巴胺劫持机制。`,
      type: "similar-state",
    },
    social: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 你今天有较多${behaviorName}互动。社交反馈（点赞、微笑、认同）是天然的多巴胺触发器，这个实验模拟了大脑如何评估不同类型的奖励。`,
      type: "deep-dive",
    },
    "dopamine-balance": {
      reason: ({ stateName, direction }) =>
        direction === "down"
          ? `你的${stateName}失衡（受体脱敏），这意味着日常事物可能让你觉得「不够刺激」。来这个实验看看大脑奖励系统是如何一步步被拉高阈值的。`
          : `你的${stateName}状态良好。通过实验理解多巴胺「想要 vs 喜欢」的区别，可以帮你更好地维护这份平衡。`,
      type: "deep-dive",
    },
  },
  "attention-blindspot": {
    study: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 你今天花了较多时间${behaviorName}，前额叶的注意力资源可能已被大量消耗。来体验「非注意盲视」——即使信息就在眼前，注意力耗尽的大脑也会视而不见。`,
      type: "similar-state",
    },
    video: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 长时间${behaviorName}让顶叶的注意力过滤系统持续在碎片化内容间切换。这个实验会让你体验：当注意力被刻意引导时，你会错过多少眼前的东西。`,
      type: "contrast",
    },
    "attention-reserve": {
      reason: ({ stateName, direction, activityPct }) =>
        direction === "down"
          ? `你的${stateName}消耗了约${activityPct}%，可能正处于「决策疲劳」状态。通过实验亲身体验：注意力枯竭时，大脑最容易犯哪些错误？`
          : `你的${stateName}充足。在最佳状态下挑战这个实验，感受一下专注的大脑能捕捉到多少信息。`,
      type: "similar-state",
    },
  },
  "dream-neuroscience": {
    sleep: {
      reason: ({ behaviorName, emoji, direction }) =>
        direction === "down"
          ? `${emoji} 你今天的${behaviorName}时间偏少。睡眠不足时，杏仁核过度活跃、记忆巩固受阻、情绪调节失控。来看看睡觉时，你的大脑本来应该在做什么。`
          : `${emoji} 你今天${behaviorName}充足，海马体的记忆回放和突触修剪应该进行得不错。通过实验，你会更加理解这几小时睡眠背后的神经工程。`,
      type: "deep-dive",
    },
    "memory-consolidation": {
      reason: ({ stateName, direction }) =>
        direction === "up"
          ? `你的${stateName}状态良好 — 海马体正在高效工作。实验会展示：这些被巩固的记忆，在梦境中是如何被「重新播放」的。`
          : `你的${stateName}可能受到影响。通过实验了解：睡眠中记忆是如何从海马体「转移」到大脑皮层的，以及为什么缺觉会让人「读完就忘」。`,
      type: "deep-dive",
    },
  },
  "memory-illusion": {
    sleep: {
      reason: ({ behaviorName, emoji, direction }) =>
        direction === "down"
          ? `${emoji} ${behaviorName}不足会直接损害海马体的记忆编码功能。这个实验会让你亲身体验：大脑是如何「编造」记忆来填补空白的。`
          : `${emoji} 充足的${behaviorName}让海马体状态良好。但即使如此，你的记忆也不是录像带。来测试一下大脑重构记忆时会出哪些「bug」。`,
      type: "contrast",
    },
    study: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 你今天进行了大量${behaviorName}。你以为记住的知识，有多少是大脑「补全」的？通过DRM范式，看看记忆的错觉有多真实。`,
      type: "deep-dive",
    },
    "memory-consolidation": {
      reason: ({ stateName }) =>
        `${stateName}的关键是「编码→巩固→提取」三步。这个实验聚焦于「编码」和「提取」环节的漏洞，帮你理解为什么有些学习内容留不住。`,
      type: "deep-dive",
    },
  },
  "time-illusion": {
    exercise: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} ${behaviorName}时内啡肽和多巴胺的释放会改变时间感知。你是否有过跑步时感觉「进入状态」后时间飞逝的体验？实验将揭示其中的神经计时原理。`,
      type: "similar-state",
    },
    video: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 刷短视频是最典型的「时间黑洞」体验。可变奖励+高度刺激=数小时感觉像几分钟。来测试：你的大脑现在的时间感有多准确？`,
      type: "similar-state",
    },
    "dmn-activation": {
      reason: ({ stateName, direction }) =>
        direction === "down"
          ? `你的默认模式网络（DMN）激活较少，大脑较少进入「离线」漫游状态。时间感知通常与DMN活动相关，实验会展示不同状态下时间感的差异。`
          : `你的DMN较为活跃，经常走神、思绪游离可能会让你感觉「时间飞逝」。通过实验探索大脑「离线」和「在线」状态下的时间感知差异。`,
      type: "deep-dive",
    },
  },
  "sensory-conflict": {
    social: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} ${behaviorName}是最复杂的多感官整合场景——表情、语气、眼神、肢体语言同步处理。来体验感官「打架」时，大脑会相信哪一个。`,
      type: "deep-dive",
    },
    "amygdala-arousal": {
      reason: ({ stateName, direction }) =>
        direction === "up"
          ? `你的${stateName}较高，情绪中枢处于激活状态。感官输入的细微变化可能会被情绪放大——这也是为什么焦虑时感觉一切都「不对劲」。`
          : `你的${stateName}处于平稳状态，大脑的多感官整合可能更客观。实验会展示平时你没注意到的感官处理bug。`,
      type: "deep-dive",
    },
  },
  "cognitive-bias": {
    study: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 深度${behaviorName}虽然激活前额叶，但长时间的认知消耗也会让系统2（理性）疲惫，系统1（直觉）更容易跳出来「接管」。看看你的大脑现在有多少认知漏洞。`,
      type: "similar-state",
    },
    video: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 短视频时代，信息被刻意压缩成「情绪+画面」的碎片格式，最容易触发认知捷径。来检测一下你是否已经被训练得更容易「被骗」。`,
      type: "contrast",
    },
    social: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 群体${behaviorName}容易激活从众心理和群体认同偏差。实验中包含专门的「群体认同」测试，看看你的独立思考能力。`,
      type: "similar-state",
    },
  },
  "brain-system-malfunction": {
    sleep: {
      reason: ({ behaviorName, emoji, direction }) =>
        direction === "down"
          ? `${emoji} ${behaviorName}不足相当于多个大脑系统同时出小故障：注意力过滤下降、时间感失真、记忆编码失败。在实验中体验「单一故障」，帮你理解现实中「缺觉综合征」。`
          : `${emoji} 你今天${behaviorName}充足，大脑系统运行良好。来试试「人为制造故障」会怎样，更能珍惜好状态。`,
      type: "deep-dive",
    },
    video: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} 长时间${behaviorName}本质上是在「模拟」奖励系统过载和注意力过滤失效。实验将这两种故障单独提取出来，让你以第三人称视角体验。`,
      type: "similar-state",
    },
    "attention-reserve": {
      reason: ({ stateName, direction }) =>
        direction === "down"
          ? `你的${stateName}较低，顶叶和前额叶已经接近「故障模式」。实验中的注意力过滤故障会让你感同身受：这不就是我下午开会时的状态吗？`
          : `你的${stateName}充足，大脑系统正常。通过实验体验「故障模式」，理解系统崩溃时是什么感觉。`,
      type: "similar-state",
    },
    "dopamine-balance": {
      reason: ({ stateName, direction }) =>
        direction === "down"
          ? `你的${stateName}失衡，实验中的「奖励敏感过强」故障会让你感觉似曾相识：这不就是我刷手机停不下来的神经机制吗？`
          : `你的${stateName}处于健康区间。通过实验体验多巴胺系统「过度运转」的感觉，可以更好地警惕和避免这种状态。`,
      type: "similar-state",
    },
  },
  "neuroscience-history": {
    "neuro-plasticity": {
      reason: ({ stateName, direction }) =>
        direction === "up"
          ? `你的${stateName}较高，大脑正在积极形成新连接。这正是神经科学史上最激动人心的发现之一——大脑不是固定的硬件，而是终身可塑的。`
          : `你的${stateName}可提升空间较大。通过百年经典实验，了解哪些行为可以真正改变大脑结构。`,
      type: "deep-dive",
    },
    study: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} ${behaviorName}的本质是通过主动学习塑造突触连接。从巴甫洛夫到现代神经科学，这个实验带你穿越百年，了解学习行为背后的经典发现。`,
      type: "deep-dive",
    },
    exercise: {
      reason: ({ behaviorName, emoji }) =>
        `${emoji} ${behaviorName}促进BDNF释放和神经发生，这是近年神经科学最振奋的研究成果之一。通过历史实验了解科学家如何一步步揭开大脑可塑性的秘密。`,
      type: "deep-dive",
    },
  },
};

export function getRecommendedExperiments(
  neuroStates: NeuroState[],
  regionStates: BrainRegionState[],
  input?: BehaviorInput
): RecommendedExperiment[] {
  const scores: Record<string, {
    score: number;
    reasons: { text: string; priority: number; type: "similar-state" | "contrast" | "deep-dive" }[];
  }> = {};

  const behaviorCtx = input ? analyzeBehaviorContext(input) : null;

  neuroStates.forEach((state) => {
    const connection = Object.entries(EXPERIMENT_CONNECTIONS).find(
      ([_expId, conn]) => conn[state.id]
    );
    if (connection) {
      const [expId, conn] = connection;
      const handler = conn[state.id];
      if (!scores[expId]) scores[expId] = { score: 0, reasons: [] };

      const impact = Math.abs(state.level);
      scores[expId].score += impact * 0.8;
      scores[expId].reasons.push({
        text: handler.reason({
          behaviorName: "",
          emoji: "",
          stateName: state.chineseName,
          activityPct: Math.round(impact * 100),
          direction: state.level >= 0 ? "up" : "down",
        }),
        priority: 2 + impact * 2,
        type: handler.type,
      });
    }
  });

  if (behaviorCtx) {
    behaviorCtx.extremeBehaviors.forEach((behavior) => {
      Object.entries(EXPERIMENT_CONNECTIONS).forEach(([expId, conn]) => {
        const handler = conn[behavior.id];
        if (handler) {
          if (!scores[expId]) scores[expId] = { score: 0, reasons: [] };
          const impact = Math.abs(behavior.weight);
          scores[expId].score += impact * 1.2;
          const isLow = behavior.direction === "low";
          const direction: "up" | "down" = behavior.direction === "high" ? "up" : "down";
          scores[expId].reasons.push({
            text: handler.reason({
              behaviorName: behavior.name,
              emoji: behavior.emoji,
              stateName: "",
              activityPct: Math.round(impact * 100),
              direction: isLow ? "down" : direction,
            }),
            priority: 4 + impact * 3,
            type: handler.type,
          });
        }
      });
    });
  }

  regionStates.forEach((region) => {
    const regionData = getBrainRegionById(region.id);
    if (!regionData) return;
    const impact = Math.abs(region.activity);
    if (impact < 0.3) return;

    regionData.relatedExperiments.forEach((expId: string) => {
      if (!scores[expId]) scores[expId] = { score: 0, reasons: [] };
      scores[expId].score += impact * 0.4;

      const regionReason = region.activity > 0
        ? `🧠 你的${region.chineseName}活跃增强（+${Math.round(impact * 100)}%），这个实验正聚焦于这个脑区的功能`
        : `🧠 你的${region.chineseName}活动减弱（${Math.round(impact * 100)}%），实验可以帮助理解它被抑制时的影响`;

      scores[expId].reasons.push({
        text: regionReason,
        priority: 1 + impact,
        type: "deep-dive",
      });
    });
  });

  const result: RecommendedExperiment[] = Object.entries(scores)
    .filter(([_, data]) => data.score > 0)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .map(([expId, data]) => {
      const sortedReasons = [...data.reasons].sort((a, b) => b.priority - a.priority);
      const topReason = sortedReasons[0];
      return {
        experimentId: expId,
        reason: topReason?.text || `基于你今天的神经状态，这个实验会让你产生强烈共鸣`,
        connectionType: topReason?.type || "deep-dive",
      };
    });

  return result;
}
