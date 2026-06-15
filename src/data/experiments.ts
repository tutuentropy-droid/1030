export interface SubExperiment {
  id: string;
  title: string;
  description: string;
  brainPathway: string[];
}

export interface Experiment {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  accentColor: string;
  glowColor: string;
  introduction: string;
  gameInstruction: string;
  phenomenon: string;
  neurosciencePrinciple: string;
  realLifeExamples: string[];
  subExperiments?: SubExperiment[];
  hasMultiPhase?: boolean;
}

export const experiments: Experiment[] = [
  {
    id: "color-illusion",
    title: "颜色错觉",
    shortDescription: "你的眼睛会欺骗你",
    icon: "Palette",
    accentColor: "#9d4edd",
    glowColor: "rgba(157, 78, 221, 0.4)",
    introduction:
      "你相信自己的眼睛吗？在这个实验中，你将发现大脑如何预测和解释视觉信息，以及为什么相同的颜色在不同环境中看起来完全不同。",
    gameInstruction:
      "仔细观察棋盘上的两个方块，判断它们的颜色是否相同。准备好了吗？开始挑战你的视觉系统！",
    phenomenon:
      "在棋盘阴影错觉中，标有A和B的两个方块实际上是完全相同的灰色，但由于周围环境和阴影的影响，我们的大脑会认为B方块比A方块亮得多。即使你已经知道了答案，这种错觉仍然存在——你的视觉系统不会因为你的知识而改变它的感知方式。",
    neurosciencePrinciple:
      "这种错觉揭示了大脑视觉处理的一个核心原则：我们看到的不是世界的真实样子，而是大脑对世界的预测和解释。视觉皮层V1、V2、V4区域不仅处理原始的光感信息，还会结合上下文、经验和预期来构建我们感知到的'现实'。大脑会自动'扣除'阴影的影响，假设阴影中的物体实际上更亮。这种机制在自然环境中非常有用，但也意味着我们的感知永远是主观的。",
    realLifeExamples: [
      "化妆师利用颜色对比原理，通过阴影和高光来改变面部轮廓的视觉效果",
      "室内设计师使用冷色让房间显得更大，暖色让空间更温馨",
      "服装设计中，竖条纹显瘦、横条纹显胖也是类似的视觉错觉应用",
      "画家们几个世纪以来一直在利用这些原理创造深度和立体感",
    ],
  },
  {
    id: "motion-illusion",
    title: "运动错觉",
    shortDescription: "静止的画面在动？",
    icon: "RotateCw",
    accentColor: "#00d4ff",
    glowColor: "rgba(0, 212, 255, 0.4)",
    introduction:
      "为什么静止的图片看起来在旋转？为什么盯着瀑布看久了，会觉得岩石在往上流？来体验运动感知的神奇世界吧。",
    gameInstruction:
      "盯着下方的旋转图案看30秒，然后将视线移到旁边的静止物体上，你会发现神奇的事情发生了！",
    phenomenon:
      "运动后效（Motion Aftereffect），也被称为瀑布错觉（Waterfall Illusion），是指当你长时间注视一个向某一方向运动的物体后，再看静止的物体，会感觉到这个静止的物体在向相反的方向运动。在旋转蛇图错觉中，完全静止的图案却让人产生持续旋转的感觉，这是因为图案中的颜色渐变触发了我们的运动检测神经元。",
    neurosciencePrinciple:
      "我们的大脑中有专门检测运动方向的神经元，位于视觉皮层的MT区（Middle Temporal area）。当我们长时间看某个方向的运动时，对应方向的神经元会逐渐适应和疲劳。当视线转移到静止物体上时，反方向的神经元相对更活跃，大脑就会产生'反向运动'的错觉。旋转蛇图则利用了不同亮度和颜色的边缘，异步地激活运动检测神经元，制造出虚假的运动感知。",
    realLifeExamples: [
      "长时间坐火车后，下车时会感觉地面还在移动",
      "电影和动画利用视觉暂留效应，让静态画面产生运动感",
      "电子游戏中的动态模糊效果，增强速度感和沉浸感",
      "VR/AR技术中，运动错觉被用来创造更真实的虚拟体验",
    ],
  },
  {
    id: "memory-illusion",
    title: "记忆错觉",
    shortDescription: "你的记忆有多可靠？",
    icon: "Brain",
    accentColor: "#ff006e",
    glowColor: "rgba(255, 0, 110, 0.4)",
    introduction:
      "你以为你记得，但可能都是大脑编的。记忆不是录像带，而是每次回忆时重新构建的故事。来测试一下你的记忆有多准确吧。",
    gameInstruction:
      "你会看到一系列词语，请努力记住它们。稍后我们会测试你记住了哪些，以及哪些是你'以为'自己记住了的。",
    phenomenon:
      "这就是著名的'错误记忆'（False Memory）现象，也常被称为DRM范式（Deese-Roediger-McDermott paradigm）。当人们学习一系列语义相关的词语（如：床、梦、枕头、毛毯……）后，往往会错误地'记得'一个从未出现过但与主题高度相关的关键词（如：睡眠）。这种虚假记忆的感觉和真实记忆几乎没有差别。",
    neurosciencePrinciple:
      "记忆不是对事件的精确复制，而是一个重构的过程。海马体（Hippocampus）负责将分散在大脑各处的记忆碎片拼接起来。每次回忆时，相关的神经通路会被重新激活，并根据当前的情境、期望和情绪进行'更新'。前额叶皮层（PFC）在监控记忆来源方面起着关键作用——当它的监控功能减弱时，我们更容易将想象和现实混淆。",
    realLifeExamples: [
      "目击证人的证词可能并不完全可靠，因为记忆会随着时间和暗示而改变",
      "童年记忆可能是根据家人的讲述和照片重新构建的",
      "为什么我们有时会'清楚地记得'做过某事，但实际上并没有做",
      "心理治疗中的'被压抑的记忆'可能是治疗过程中无意中植入的虚假记忆",
    ],
  },
  {
    id: "attention-blindspot",
    title: "注意力盲区",
    shortDescription: "你看到了大猩猩吗？",
    icon: "Eye",
    accentColor: "#ffbe0b",
    glowColor: "rgba(255, 190, 11, 0.4)",
    introduction:
      "当你专注于某件事时，会对眼前发生的其他事情视而不见。这不是你的错，而是大脑注意力系统的工作方式。",
    gameInstruction:
      "仔细观看下面的动画，数清楚穿白色衣服的人传了多少次球。准备好了吗？全神贯注地开始吧！",
    phenomenon:
      "这就是著名的'看不见的大猩猩'（Invisible Gorilla）实验。当人们专注于数传球次数时，大约有一半的人完全没有注意到一只大猩猩（或其他明显的意外事件）出现在画面中，甚至在画面中央停留了好几秒。这种现象被称为'非注意盲视'（Inattentional Blindness）——我们只看到我们注意的东西。",
    neurosciencePrinciple:
      "注意力就像大脑的聚光灯，它只能照亮有限的区域。顶叶皮层（Parietal Cortex）负责注意力的分配和转移，前额叶皮层则参与目标导向的注意控制。当我们的认知资源被某项任务占用时，大脑就没有多余的处理能力来检测其他意外刺激了。这不是缺陷，而是一种高效的设计——大脑必须选择性地处理信息，否则会被海量的感官输入淹没。",
    realLifeExamples: [
      "开车时打电话会显著增加事故风险，因为注意力被分散了",
      "魔术师利用注意力引导，让你看不到他们手上的小动作",
      "为什么你在找东西时，它明明就在眼前却看不到",
      "团队合作中，每个人专注自己的任务可能会错过重要的全局信息",
    ],
  },
  {
    id: "time-illusion",
    title: "时间感错觉",
    shortDescription: "时间过得有多快？",
    icon: "Clock",
    accentColor: "#06ffa5",
    glowColor: "rgba(6, 255, 165, 0.4)",
    introduction:
      "为什么快乐时时间飞逝，痛苦时度日如年？为什么年纪越大感觉时间过得越快？来探索大脑的时间感知机制吧。",
    gameInstruction:
      "点击开始，然后在你感觉过了10秒钟的时候点击停止。看看你的时间感有多准确？",
    phenomenon:
      "我们对时间的感知极其不稳定。恐惧、兴奋、无聊、年龄——许多因素都会影响我们的时间感。在危险情境中，人们常常报告说时间仿佛慢了下来，每一秒都像一个小时那么长。而在愉快地做某件事时，几个小时可能感觉就像几分钟。更神奇的是，随着年龄增长，我们会觉得时间过得越来越快。",
    neurosciencePrinciple:
      "大脑没有单一的'时间感知器官'，而是由多个脑区共同参与时间处理。小脑（Cerebellum）负责毫秒级的精确计时，基底神经节（Basal Ganglia）参与秒到分钟级的时间估计，前额叶皮层则处理更长的时间跨度。有理论认为，大脑通过神经脉冲的频率来'计算'时间——当我们高度集中注意力时，处理的信息量更大，神经活动更密集，大脑就会觉得时间更长。",
    realLifeExamples: [
      "为什么在游乐园排队时感觉时间特别漫长",
      "为什么年纪越大感觉时间过得越快——每一年在人生中的比例越来越小",
      "运动员在比赛中仿佛进入'子弹时间'，动作放慢、思维清晰",
      "冥想和正念练习可以改变时间感知，让人更专注于当下",
    ],
  },
  {
    id: "sensory-conflict",
    title: "感官打架实验",
    shortDescription: "当你的感官互相矛盾时...",
    icon: "Sparkles",
    accentColor: "#f72585",
    glowColor: "rgba(247, 37, 133, 0.4)",
    introduction:
      "你的眼睛、耳朵、皮肤和舌头真的意见一致吗？当不同感官传递矛盾的信息时，大脑会相信谁？在这个多阶段实验中，你将体验三种经典的感官冲突现象：McGurk效应（视听冲突）、橡胶手错觉（触觉与视觉冲突）、以及声音改变味觉感知。",
    gameInstruction:
      "按照指示依次完成三个子实验，每个实验都会让你的感官产生奇妙的冲突。准备好了吗？让我们看看大脑会如何裁决！",
    phenomenon:
      "感官冲突实验揭示了一个惊人的事实：我们的感知不是单一感官的简单叠加，而是大脑对多种感官信息进行动态整合和权衡的结果。当视觉和听觉信息矛盾时，大脑往往会'创造'出一种折中的感知（McGurk效应）；当视觉和触觉冲突时，大脑甚至会将橡胶手误认为自己的手（橡胶手错觉）；声音频率的变化还能改变我们对食物酥脆度的感知。这些错觉之所以存在，是因为大脑始终在试图构建一个最'合理'的外部世界模型。",
    neurosciencePrinciple:
      "多感官整合主要发生在大脑的颞上沟（STS）、顶叶皮层和岛叶皮层。颞上沟是视听整合的关键区域，它接收来自视觉皮层和听觉皮层的信息，并检测它们之间的时间和空间一致性。顶叶皮层负责将视觉信息与躯体感觉信息整合，构建身体表征（body representation）——橡胶手错觉正是因为顶叶被视觉信息'欺骗'，更新了身体模型。岛叶则参与味觉、触觉和内感受的整合，声音通过听觉皮层影响岛叶的味觉处理，从而改变味觉感知。前额叶皮层在整个过程中扮演'裁判'角色，评估各感官信息的可靠性，并最终决定采信哪个版本的'现实'。",
    realLifeExamples: [
      "电影配音和口型不一致时会让观众感觉非常违和，这正是McGurk效应的反向体现",
      "VR/AR设备必须精确协调视觉、听觉和触觉反馈，否则会产生晕动症",
      "为什么蒙上眼睛吃东西味道会变差——视觉提供了80%以上的'味觉'信息",
      "汽车制造商利用发动机声音设计来让你感觉汽车更有'力量感'，声音会影响你对性能的感知",
    ],
    subExperiments: [
      {
        id: "mcgurk",
        title: "McGurk 效应",
        description: "视觉和听觉不一致时，大脑会相信谁？",
        brainPathway: ["auditory-cortex", "visual-cortex", "superior-temporal-sulcus", "prefrontal-cortex"],
      },
      {
        id: "rubber-hand",
        title: "橡胶手错觉",
        description: "大脑会把假手当成自己的手吗？",
        brainPathway: ["visual-cortex", "somatosensory-cortex", "parietal-lobe", "prefrontal-cortex"],
      },
      {
        id: "sound-taste",
        title: "声音改变味觉",
        description: "声音频率会改变食物的酥脆感？",
        brainPathway: ["auditory-cortex", "gustatory-cortex", "insula", "prefrontal-cortex"],
      },
    ],
    hasMultiPhase: true,
  },
  {
    id: "reward-circuit",
    title: "奖励回路实验",
    shortDescription: "为什么大脑偏爱即时奖励？",
    icon: "Gift",
    accentColor: "#fb5607",
    glowColor: "rgba(251, 86, 7, 0.4)",
    introduction:
      "为什么明明知道应该学习，却忍不住刷视频？为什么减肥时总是抗拒不了甜点？为什么游戏和社交媒体让我们欲罢不能？在这个实验中，你将亲身体验大脑奖励系统如何工作——通过模拟短视频、糖分、游戏、社交点赞这四种最常见的'多巴胺劫持者'，你会看到自己的奖励敏感度如何变化，自控能力如何被消耗。",
    gameInstruction:
      "你将经历20轮选择。每一轮都会面临一个两难抉择：是选择即时的愉悦（刷视频、吃甜点、玩游戏、刷朋友圈），还是选择长期的收益（学习、工作、锻炼、健康饮食）。系统会实时追踪你的大脑状态——多巴胺水平（奖励敏感度）和前额叶活动（自控能力）。注意：每次选择即时奖励会让多巴胺暂时升高，但长期会降低敏感度，还会消耗自控力。看看你能坚持多少轮的'正确选择'，以及当自控力耗尽时会发生什么。",
    phenomenon:
      "这就是'延迟折扣'（Delay Discounting）和'自我损耗'（Ego Depletion）现象的结合。大脑的奖励系统（伏隔核+VTA）会大幅高估即时奖励的价值，而低估延迟奖励的价值。与此同时，前额叶皮层的自控能力是一种有限资源，每一次抵制诱惑都会消耗它，当它耗尽时，我们就会'失控'。这就是为什么经过一天辛苦工作后，晚上更容易放纵自己——因为你的自控力已经用完了。",
    neurosciencePrinciple:
      "奖励回路的核心是中脑边缘多巴胺通路：腹侧被盖区（VTA）释放多巴胺，投射到伏隔核（NAc）和前额叶皮层（PFC）。当我们获得即时奖励时，多巴胺会大量释放，产生愉悦感并强化该行为。但伏隔核有一个'时间折扣'机制——奖励越延迟，主观价值就越低，这是一个双曲线函数（不是线性的）。前额叶皮层负责抵制冲动、考虑长远后果，但它的功能会消耗葡萄糖等能量资源，持续使用后效率会下降。当伏隔核的多巴胺信号强于前额叶的调控信号时，我们就会选择即时满足。更糟糕的是，糖、短视频、游戏这些'超级刺激物'会导致多巴胺受体脱敏，需要越来越强的刺激才能达到同样的愉悦感，形成恶性循环。",
    realLifeExamples: [
      "短视频App利用无限滚动和算法推荐，让你永远不知道下一条是什么，这种不确定性会疯狂刺激多巴胺释放",
      "糖和高脂肪食物在伏隔核中的反应与毒品类似，这就是为什么减肥如此困难的神经学原因",
      "游戏中的'抽卡'和'升级'机制利用可变比率强化，创造类似赌博的成瘾性",
      "社交媒体的点赞、评论、小红点等社交反馈，通过激活奖励系统让我们不断刷新查看",
      "为什么年底/周一会制定很多计划，但执行几天就放弃——因为长期目标在伏隔核中的价值太低",
    ],
    subExperiments: [
      {
        id: "short-video",
        title: "短视频诱惑",
        description: "学习还是刷视频？多巴胺的战争",
        brainPathway: ["ventral-tegmental-area", "nucleus-accumbens", "prefrontal-cortex", "amygdala"],
      },
      {
        id: "sugar-craving",
        title: "糖分诱惑",
        description: "健康餐还是甜点？糖是合法的毒品",
        brainPathway: ["ventral-tegmental-area", "nucleus-accumbens", "prefrontal-cortex", "insula"],
      },
      {
        id: "game-addiction",
        title: "游戏诱惑",
        description: "工作还是打游戏？升级的快感",
        brainPathway: ["ventral-tegmental-area", "nucleus-accumbens", "prefrontal-cortex", "reward-system"],
      },
      {
        id: "social-likes",
        title: "社交点赞诱惑",
        description: "专注还是刷朋友圈？社交反馈的力量",
        brainPathway: ["ventral-tegmental-area", "nucleus-accumbens", "prefrontal-cortex", "amygdala"],
      },
    ],
    hasMultiPhase: true,
  },
  {
    id: "dream-neuroscience",
    title: "梦境神经学",
    shortDescription: "你的大脑在睡觉时在做什么？",
    icon: "Moon",
    accentColor: "#7209b7",
    glowColor: "rgba(114, 9, 183, 0.4)",
    introduction:
      "你有没有做过奇怪的梦？被人追逐、从高空坠落、在考试中大脑一片空白、或者在熟悉的地方迷了路？这些看似荒诞的梦境背后，是大脑在睡眠中进行着复杂的神经活动——情绪处理、记忆整合、突触修剪。本实验将从神经科学角度解读常见梦境主题，并通过快速眼动（REM）睡眠模拟器展示为什么梦境总是碎片化的。",
    gameInstruction:
      "第一步：选择或输入你最近做过的梦境关键词，系统将从神经科学角度解释该梦境可能对应的大脑活动。第二步：运行REM睡眠模拟器，观察睡眠各阶段的脑电波变化和神经元激活模式，理解为什么梦境总是跳跃、碎片化的。准备好了吗？让我们进入沉睡的大脑世界。",
    phenomenon:
      "梦境的三个核心神经现象：1）大多数生动的梦境发生在快速眼动（REM）睡眠阶段，此时大脑活动水平与清醒时几乎相同，但身体肌肉完全麻痹；2）梦境内容往往是碎片化、跳跃、不合逻辑的——场景可以瞬间切换、人物身份可以模糊、时间可以倒流；3）某些梦境主题具有跨文化的普遍性：被追逐（约70%的人做过）、坠落（约60%）、考试失败、迷路、牙齿脱落等，这些主题与基本情绪和生存压力高度相关。更有趣的是，我们在梦中几乎不会感到疼痛，也很少梦到阅读或计算——这些功能依赖的脑区在REM睡眠中处于抑制状态。",
    neurosciencePrinciple:
      "梦境的神经科学可以用'激活-合成理论'（Activation-Synthesis Hypothesis）和'情绪记忆整合'两个核心框架来解释。REM睡眠期间，脑干的脑桥（Pons）会随机发出神经冲动（PGO波），这些信号没有任何'意义'——它们只是神经元的随机放电。大脑皮层（特别是前额叶和顶叶）接收到这些混乱的信号后，会试图'合成'一个连贯的故事，这就是为什么梦境总是不合逻辑却让人感觉真实的原因。与此同时，杏仁核（恐惧中枢）在REM睡眠中高度活跃，而背外侧前额叶（理性中枢）被抑制，这解释了为什么梦境充满情绪、缺乏逻辑。在非REM（NREM）睡眠阶段，海马体将白天的短期记忆'回放'并转移到大脑皮层，形成长期记忆——这就是'睡前记忆效果好'的神经基础。睡眠不是大脑的休息，而是另一种工作状态：突触修剪（弱化无用连接）、记忆整合（巩固重要记忆）、情绪调节（处理未解决的情绪冲突）。",
    realLifeExamples: [
      "为什么考前容易梦到考试失败？因为杏仁核在处理你的焦虑情绪，海马体在回放与考试相关的记忆",
      "为什么醒来后记不住大多数梦？因为REM睡眠期间前额叶活动低下，无法将短期记忆编码为长期记忆",
      "为什么连续熬夜后会做更激烈、更奇怪的梦？因为'REM反弹'效应——睡眠不足时REM被压缩，补觉时REM强度会显著增加",
      "为什么睡前复习的知识记得更牢？因为NREM慢波睡眠中海马体的记忆回放机制，将临时记忆固化为长期记忆",
      "清醒梦（知道自己在做梦）的神经基础是背外侧前额叶部分被激活，使你在梦中保留了一定的元认知能力",
    ],
    subExperiments: [
      {
        id: "dream-keyword",
        title: "梦境关键词解析",
        description: "输入你的梦境主题，了解背后的神经机制",
        brainPathway: ["amygdala", "hippocampus", "prefrontal-cortex", "pons", "default-mode-network"],
      },
      {
        id: "rem-simulator",
        title: "REM睡眠模拟器",
        description: "观察睡眠周期中的脑电波和神经元活动",
        brainPathway: ["pons", "thalamus", "visual-cortex", "amygdala", "prefrontal-cortex"],
      },
    ],
    hasMultiPhase: true,
  },
  {
    id: "neuroscience-history",
    title: "神经科学历史实验",
    shortDescription: "穿越百年，体验经典实验",
    icon: "FlaskConical",
    accentColor: "#d4a574",
    glowColor: "rgba(212, 165, 116, 0.4)",
    introduction:
      "穿越时空，进入不同年代的神经科学实验室！从1902年巴甫洛夫的条件反射，到1962年斯佩里的裂脑实验，再到现代的注意力盲视和多巴胺预测误差——你将亲自体验这些改变人类认知的经典实验。在每个实验中，先猜结果，再看真相，还有「如果实验失败了会怎样」的分支体验。",
    gameInstruction:
      "选择一个年代进入实验室，按照指示完成互动实验。每个实验都会先让你猜测结果，然后展示真实的实验发现和背后的神经原理。完成全部四个年代的实验即可解锁。",
    phenomenon:
      "四个经典实验揭示了大脑运作的核心机制：1）巴甫洛夫的条件反射——中性刺激通过与重要事件反复配对获得意义，这是所有联想学习的基础；2）裂脑实验——切断胼胝体后，左右半球各自为政，左半球能说出右视野看到的东西，却对左视野的信息「视而不见」，揭示了大脑功能偏侧化；3）非注意盲视——当你专注数球时，50%的人会错过画面中央的大猩猩，证明注意力是有限资源；4）多巴胺预测误差——多巴胺编码的不是「快乐」而是「意外」，预期中的奖励不触发多巴胺，意外的奖励才让它飙升。",
    neurosciencePrinciple:
      "这些实验分别揭示了不同的神经原理：条件反射的基底是突触可塑性（赫布学习），反复共激活的神经元连接会被强化；裂脑实验证明大脑功能偏侧化——左半球主导语言和逻辑，右半球主导空间和整体感知，胼胝体是两半球的信息桥梁；非注意盲视说明注意力由顶叶和前额叶皮层调控，认知资源有限时信息在到达意识前就被过滤；多巴胺预测误差由腹侧被盖区（VTA）的神经元编码，实际奖励与预期奖励的差值驱动多巴胺释放，这是强化学习和成瘾的核心机制。",
    realLifeExamples: [
      "广告中反复将产品与愉悦画面配对，利用的就是巴甫洛夫条件反射",
      "裂脑患者的经历提醒我们：我们感知到的「统一意识」可能是大脑整合后的幻象",
      "开车打电话时你「看」到了路但大脑没处理——这就是非注意盲视在现实中的致命后果",
      "短视频App的无限滚动利用多巴胺预测误差——你永远不知道下一条是什么，这种不确定性疯狂刺激多巴胺释放",
      "恐惧症治疗后容易复发——旧的条件反射只是被压制（消退），而非根除（自发恢复）",
      "赌博比稳定收入更让人上瘾——不可预测的奖励产生最大的预测误差和多巴胺释放",
    ],
    subExperiments: [
      {
        id: "1900-conditioning",
        title: "条件反射实验",
        description: "铃声如何让狗流口水？巴甫洛夫的发现",
        brainPathway: ["amygdala", "brainstem", "hippocampus", "prefrontal-cortex"],
      },
      {
        id: "1960-split-brain",
        title: "裂脑实验",
        description: "切断大脑桥梁后的两个独立意识",
        brainPathway: ["prefrontal-cortex", "visual-cortex", "corpus-callosum", "prefrontal-cortex"],
      },
      {
        id: "modern-attention",
        title: "注意力实验",
        description: "看不见的大猩猩——非注意盲视",
        brainPathway: ["parietal-lobe", "prefrontal-cortex", "visual-cortex"],
      },
      {
        id: "modern-reward",
        title: "奖励预测实验",
        description: "多巴胺不是快乐分子——预测误差",
        brainPathway: ["ventral-tegmental-area", "nucleus-accumbens", "prefrontal-cortex"],
      },
    ],
    hasMultiPhase: true,
  },
  {
    id: "cognitive-bias",
    title: "认知漏洞检测",
    shortDescription: "你的大脑有多容易被骗？",
    icon: "Shield",
    accentColor: "#e63946",
    glowColor: "rgba(230, 57, 70, 0.4)",
    introduction:
      "你的大脑一直在用'捷径'帮你做决策——这些捷径在99%的情况下都很管用，但剩下的1%却会让你做出非常愚蠢的判断。骗子、广告商、政客们都深谙此道。在这个测试中，你将面对假新闻判断、视觉误导、概率错觉、风险判断等一系列精心设计的陷阱，系统会记录哪些神经偏差最容易影响你，最后生成一份专属的'认知漏洞热力图'。",
    gameInstruction:
      "你将经历4轮共16道题目，涵盖4种认知陷阱类型。请根据你的直觉快速回答——不要花太多时间思考，因为我们测试的正是大脑的'自动化偏差'。每题作答后，系统会告诉你是否被'骗'了，以及对应的是哪种认知偏差。准备好了吗？让我们看看你的大脑有多少漏洞！",
    phenomenon:
      "认知偏差（Cognitive Bias）是大脑为了快速决策而演化出来的'思维捷径'——它们不是bug，而是feature。但这些捷径在现代信息环境中却变成了漏洞：损失厌恶让我们为了避免小损失而承担大风险，确认偏误让我们只看自己想看的信息，锚定效应让我们被第一个数字牵着走，框架效应让同一个问题换个说法就做出完全相反的选择，可用性启发让我们高估飞机失事的概率（因为新闻报道太多），情感启发让我们因为一个故事而忽略统计数据……这就是为什么'聪明人也会做傻事'——因为偏差发生在意识层面之下。",
    neurosciencePrinciple:
      "认知偏差的神经基础是大脑的'双系统理论'（Dual Process Theory）：系统1（直觉系统）由杏仁核、腹内侧前额叶、基底神经节等区域驱动，快速、自动、情绪化、消耗能量少；系统2（理性系统）由背外侧前额叶、前扣带皮层等区域驱动，缓慢、深思、消耗能量多。95%的决策都是系统1做出的——这是大脑的节能策略。但系统1依赖的是进化上有用的启发式规则，在信息爆炸、逻辑复杂的现代环境中，这些规则经常失灵。例如：杏仁核（恐惧中枢）会高估恐惧事件的概率（可用性启发），伏隔核（奖励中枢）会低估延迟损失的严重性（双曲贴现），腹内侧前额叶会根据故事而非数据做决策（情感启发），确认偏误则与多巴胺奖励系统有关——当我们遇到符合预期的信息时，多巴胺会释放，产生愉悦感，于是我们主动'筛选'能让自己开心的信息。",
    realLifeExamples: [
      "90%的司机认为自己的驾驶水平高于平均——这就是'优于平均效应'，也叫乌比冈湖效应",
      "为什么股票下跌时人们死扛不卖，上涨时却急于落袋为安？因为'损失厌恶'——损失带来的痛苦是收益快乐的2.5倍",
      "为什么超市标价$9.99而不是$10？因为'左位效应'让我们觉得便宜了很多",
      "为什么你总是在头条上看到自己想看的？因为算法利用了你的确认偏误，制造'信息茧房'",
      "为什么会被'最后3个名额！'、'仅剩2件！'逼得匆忙下单？这就是'稀缺效应'激活了损失厌恶",
      "为什么'90%存活率'的手术比'10%死亡率'让人更容易接受？因为框架效应改变了同一个事实的呈现方式",
    ],
    subExperiments: [
      {
        id: "fake-news",
        title: "假新闻判断",
        description: "你能分辨真假新闻吗？",
        brainPathway: ["amygdala", "prefrontal-cortex", "hippocampus", "superior-temporal-sulcus"],
      },
      {
        id: "visual-mislead",
        title: "视觉误导",
        description: "你的眼睛会被统计图欺骗吗？",
        brainPathway: ["visual-cortex", "parietal-lobe", "prefrontal-cortex"],
      },
      {
        id: "probability-illusion",
        title: "概率错觉",
        description: "你的直觉概率判断有多准？",
        brainPathway: ["prefrontal-cortex", "amygdala", "insula", "parietal-lobe"],
      },
      {
        id: "risk-judgment",
        title: "风险判断",
        description: "你能理性评估风险吗？",
        brainPathway: ["amygdala", "prefrontal-cortex", "insula", "nucleus-accumbens"],
      },
      {
        id: "calorie-craving",
        title: "高热量偏好",
        description: "热量就是生命——原始时代的生存法则",
        brainPathway: ["ventral-tegmental-area", "nucleus-accumbens", "insula", "prefrontal-cortex"],
      },
      {
        id: "instant-reward",
        title: "即时奖励偏好",
        description: "现在到手才是真的——双曲贴现的进化根源",
        brainPathway: ["ventral-tegmental-area", "nucleus-accumbens", "prefrontal-cortex", "amygdala"],
      },
      {
        id: "group-identity",
        title: "群体认同偏好",
        description: "离开群体等于死亡——从众的神经基础",
        brainPathway: ["prefrontal-cortex", "amygdala", "anterior-cingulate-cortex", "ventromedial-prefrontal-cortex"],
      },
      {
        id: "danger-sensitivity",
        title: "危险信息敏感",
        description: "宁可信其有——烟雾报警器原则",
        brainPathway: ["amygdala", "hypothalamus", "hippocampus", "prefrontal-cortex"],
      },
    ],
    hasMultiPhase: true,
  },
];

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find((exp) => exp.id === id);
}
