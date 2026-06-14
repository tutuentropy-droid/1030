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
];

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find((exp) => exp.id === id);
}
