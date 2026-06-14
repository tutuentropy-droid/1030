export interface BrainRegion {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  color: string;
  glowColor: string;
  relatedExperiments: string[];
  faqs: { question: string; answer: string }[];
  realLifeImpacts: string[];
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  emoji: string;
}

export const brainRegions: BrainRegion[] = [
  {
    id: "hippocampus",
    name: "Hippocampus",
    chineseName: "海马体",
    description:
      "海马体是大脑内侧颞叶的一个关键结构，形似海马，是记忆形成和空间导航的核心区域。它负责将短期记忆转化为长期记忆，并帮助我们在环境中定位自己。",
    color: "#ff006e",
    glowColor: "rgba(255, 0, 110, 0.5)",
    relatedExperiments: ["memory-illusion"],
    faqs: [
      {
        question: "海马体损伤会怎样？",
        answer:
          "海马体受损会导致顺行性遗忘症——无法形成新的长期记忆，但之前的长期记忆可能保留。著名的H.M.患者在切除海马体后，永远无法记住手术后发生的任何事情。",
      },
      {
        question: "海马体可以再生吗？",
        answer:
          "研究表明，成年人大脑海马体中确实存在神经发生（产生新神经元）的现象。有氧运动、学习新技能和充足睡眠都能促进海马体的神经可塑性。",
      },
      {
        question: "为什么空间记忆和海马体有关？",
        answer:
          "海马体中存在'位置细胞'（Place Cells），当动物处于环境中的特定位置时会被激活。这些细胞与内嗅皮层的'网格细胞'共同构成了大脑的GPS系统。",
      },
    ],
    realLifeImpacts: [
      "阿尔茨海默病最早影响的脑区之一就是海马体，这就是为什么患者首先出现近期记忆丧失的症状",
      "伦敦出租车司机的海马体后部比普通人大，因为他们需要记住复杂的城市路线",
      "创伤后应激障碍（PTSD）患者的海马体体积通常会缩小，影响记忆处理",
      "睡前复习知识能更好地记住，因为睡眠期间海马体会将短期记忆'转移'到大脑皮层",
    ],
    position: { x: 35, y: 45, width: 18, height: 14 },
    emoji: "🐚",
  },
  {
    id: "amygdala",
    name: "Amygdala",
    chineseName: "杏仁核",
    description:
      "杏仁核是位于大脑内侧颞叶的杏仁状结构，是情绪处理的核心，特别是恐惧和焦虑的检测与反应。它在形成情绪化记忆和触发战斗-逃跑反应中起着关键作用。",
    color: "#ff5c8a",
    glowColor: "rgba(255, 92, 138, 0.5)",
    relatedExperiments: ["time-illusion", "memory-illusion"],
    faqs: [
      {
        question: "为什么危险时刻感觉时间变慢？",
        answer:
          "当杏仁核检测到威胁时，它会启动应激反应，使大脑进入高唤醒状态。此时注意力高度集中，处理的信息量剧增，大脑会认为经历了更长的时间。",
      },
      {
        question: "杏仁核和海马体的关系？",
        answer:
          "两者紧密合作：杏仁核给情绪事件打上'重要'标签，指示海马体优先将这些记忆固化为长期记忆。这就是为什么情绪化事件更容易被记住的原因。",
      },
      {
        question: "杏仁核越活跃就越焦虑吗？",
        answer:
          "大体上是的。焦虑症患者通常表现出杏仁核过度活跃。认知行为疗法（CBT）和正念冥想可以降低杏仁核的基线活动水平，增强前额叶对它的调控能力。",
      },
    ],
    realLifeImpacts: [
      "恐怖片和过山车利用杏仁核对威胁的过度反应来制造刺激感",
      "童年创伤会导致杏仁核终身过度敏感，使成年后更容易焦虑和抑郁",
      "看到蛇或蜘蛛时的本能恐惧是杏仁核的快速反应，甚至在你意识到之前就已启动",
      "演讲前的紧张、社交焦虑都是杏仁核误将社交场景判断为威胁的结果",
    ],
    position: { x: 52, y: 48, width: 12, height: 10 },
    emoji: "🔴",
  },
  {
    id: "prefrontal-cortex",
    name: "Prefrontal Cortex",
    chineseName: "前额叶",
    description:
      "前额叶皮层位于大脑额叶的最前部，是人类大脑进化程度最高的区域。它负责执行功能：计划、决策、工作记忆、注意力控制、冲动抑制和社会行为的调节。",
    color: "#9d4edd",
    glowColor: "rgba(157, 78, 221, 0.5)",
    relatedExperiments: ["attention-blindspot", "memory-illusion", "time-illusion"],
    faqs: [
      {
        question: "为什么我会错过眼前的大猩猩？",
        answer:
          "当你的前额叶将认知资源全部投入到数传球任务时，它就没有多余的资源来检测其他意外刺激。这种注意力分配机制是高效的，但也会造成'非注意盲视'。",
      },
      {
        question: "为什么青少年容易冲动？",
        answer:
          "前额叶是大脑发育最慢的区域，直到25岁左右才完全成熟。青少年的杏仁核已经很活跃（情绪驱动），但前额叶的抑制控制能力还在发育中。",
      },
      {
        question: "多任务处理真的存在吗？",
        answer:
          "前额叶实际上无法同时处理两项需要注意力的任务。所谓的'多任务'只是在任务之间快速切换，而每次切换都有认知成本，导致效率下降和错误增加。",
      },
    ],
    realLifeImpacts: [
      "开车时打电话会显著降低驾驶表现，因为前额叶无法同时处理语言和驾驶任务",
      "拖延症的一个重要原因是前额叶对边缘系统（追求即时满足）的调控失败",
      "冥想可以增强前额叶的活动，提高专注力和情绪调节能力",
      "睡眠不足会直接损害前额叶功能，使人更容易冲动、易怒和做错误决策",
    ],
    position: { x: 40, y: 8, width: 25, height: 18 },
    emoji: "🧠",
  },
  {
    id: "visual-cortex",
    name: "Visual Cortex",
    chineseName: "视觉皮层",
    description:
      "视觉皮层位于大脑枕叶，是处理视觉信息的主要区域。它分为多个层级（V1到V5），从基本的边缘检测、颜色识别到复杂的形状、运动和场景理解层层递进。",
    color: "#00d4ff",
    glowColor: "rgba(0, 212, 255, 0.5)",
    relatedExperiments: ["color-illusion", "motion-illusion", "attention-blindspot"],
    faqs: [
      {
        question: "为什么我们会被视觉错觉欺骗？",
        answer:
          "视觉皮层不是被动地'录制'世界，而是主动地'构建'感知。它会根据上下文、经验和预期对输入的信息进行解读和预测。视觉错觉正是这些高效捷径偶尔失败的产物。",
      },
      {
        question: "不同视觉区域的功能是什么？",
        answer:
          "V1处理基本的朝向和空间频率；V2处理深度和纹理；V4专门处理颜色；MT（V5）处理运动；IT负责复杂物体和面孔识别。这就是为什么特定脑区损伤会导致特定类型的视觉障碍。",
      },
      {
        question: "先天盲人的视觉皮层会怎样？",
        answer:
          "先天盲人的视觉皮层不会闲置，而是会被其他感官征用，例如触觉和听觉。这就是为什么盲人的触觉和听觉通常比普通人更敏锐的神经基础。",
      },
    ],
    realLifeImpacts: [
      "电影和游戏利用视觉暂留和运动错觉让静态画面产生流畅的运动感",
      "色盲通常源于V4区的功能异常或视锥细胞色素基因的变异",
      "魔镜、3D电影、VR头显都是利用视觉皮层的处理原理创造沉浸式体验",
      "面孔失认症（脸盲症）是梭状回面孔区（FFA，位于视觉皮层的一部分）受损导致的",
    ],
    position: { x: 8, y: 38, width: 22, height: 25 },
    emoji: "👁️",
  },
  {
    id: "reward-system",
    name: "Reward System",
    chineseName: "奖励系统",
    description:
      "大脑奖励系统主要包括腹侧被盖区（VTA）、伏隔核（NAc）和前额叶皮层，通过多巴胺作为主要神经递质。它负责激励行为、编码愉悦感、强化学习和形成习惯。",
    color: "#06ffa5",
    glowColor: "rgba(6, 255, 165, 0.5)",
    relatedExperiments: ["time-illusion", "attention-blindspot"],
    faqs: [
      {
        question: "为什么快乐的时光总是短暂？",
        answer:
          "当我们从事愉悦的活动时，奖励系统释放多巴胺，大脑专注于正在享受的体验，前额叶的时间监测功能被削弱。没有对时间的主动编码，事后回忆起来就会觉得时间飞逝。",
      },
      {
        question: "多巴胺等于快乐吗？",
        answer:
          "不完全是。多巴胺更准确的功能是'动机'和'预测误差'——它让你想要某样东西，并告诉你的期待与现实是否有差距。真正的愉悦感更多与内啡肽和其他神经递质有关。",
      },
      {
        question: "为什么刷手机停不下来？",
        answer:
          "社交媒体和短视频利用了奖励系统的'可变比率强化'机制。每次刷新都是一次不确定的奖励预期，这种不确定性会疯狂刺激多巴胺的释放，让你欲罢不能。",
      },
    ],
    realLifeImpacts: [
      "所有成瘾性物质（毒品、酒精、尼古丁）最终都通过增加伏隔核的多巴胺浓度起作用",
      "赌博的快感机制与毒品非常相似，都是通过不确定性刺激多巴胺释放",
      "音乐可以触发奖励系统释放多巴胺，这就是为什么我们喜欢听歌的神经学解释",
      "运动后的'跑步者高潮'是内啡肽和多巴胺共同作用的结果",
    ],
    position: { x: 38, y: 30, width: 20, height: 12 },
    emoji: "🎁",
  },
];

export function getBrainRegionById(id: string): BrainRegion | undefined {
  return brainRegions.find((region) => region.id === id);
}

export function getBrainRegionsByExperiment(
  experimentId: string
): BrainRegion[] {
  return brainRegions.filter((region) =>
    region.relatedExperiments.includes(experimentId)
  );
}

export function getExperimentToBrainRegionMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  brainRegions.forEach((region) => {
    region.relatedExperiments.forEach((expId) => {
      if (!map[expId]) map[expId] = [];
      map[expId].push(region.id);
    });
  });
  return map;
}
