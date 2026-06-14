import type { Chemist, Question, FunFact } from '../../shared/types';

export const chemists: Chemist[] = [
  {
    id: 'boyle',
    name: '罗伯特·波义耳',
    era: '1627-1691',
    description: '近代化学之父，提出化学元素概念，著有《怀疑的化学家》',
    avatar: '⚗️'
  },
  {
    id: 'lavoisier',
    name: '安托万·拉瓦锡',
    era: '1743-1794',
    description: '现代化学之父，确立质量守恒定律，推翻燃素说',
    avatar: '🔥'
  },
  {
    id: 'mendeleev',
    name: '德米特里·门捷列夫',
    era: '1834-1907',
    description: '元素周期表发明者，预言未知元素的存在',
    avatar: '📊'
  }
];

export const questions: Question[] = [
  {
    id: 'boyle-q1',
    chemistId: 'boyle',
    description: '波义耳在1661年出版的著作，标志着近代化学的开端，这本书是？',
    options: [
      '《怀疑的化学家》',
      '《化学原理》',
      '《元素论》',
      '《炼金指南》'
    ],
    correctIndex: 0,
    explanation: '《怀疑的化学家》是波义耳最著名的著作，书中批判了炼金术的元素学说。',
    historicalContext: '1661年，波义耳提出化学不是医学或炼金术的附属，而是一门独立的科学。'
  },
  {
    id: 'boyle-q2',
    chemistId: 'boyle',
    description: '波义耳提出的著名气体定律是关于气体哪两个性质之间的关系？',
    options: [
      '温度与体积',
      '压强与体积',
      '密度与压强',
      '温度与压强'
    ],
    correctIndex: 1,
    explanation: '波义耳定律指出：在恒温下，一定量气体的体积与压强成反比。',
    historicalContext: '这是人类历史上发现的第一个"定律"——用数学公式描述的自然规律。'
  },
  {
    id: 'boyle-q3',
    chemistId: 'boyle',
    description: '波义耳认为元素的正确定义是什么？',
    options: [
      '由火、水、土、气四元素组成',
      '不能再分解的简单物质',
      '由原子构成的物质',
      '具有固定熔点的物质'
    ],
    correctIndex: 1,
    explanation: '波义耳将元素定义为"不能再分解的简单物质"，推翻了古希腊四元素说。',
    historicalContext: '这一观点为后来的化学元素研究奠定了基础。'
  },
  {
    id: 'boyle-q4',
    chemistId: 'boyle',
    description: '波义耳无意中发现紫罗兰花瓣遇酸变红，由此发明了什么？',
    options: [
      'pH试纸',
      '石蕊试纸',
      '酚酞指示剂',
      '甲基橙'
    ],
    correctIndex: 1,
    explanation: '波义耳发现紫罗兰花瓣遇酸变红，由此发明了石蕊试纸，这是最早的酸碱指示剂。',
    historicalContext: '这个偶然发现开创了分析化学中酸碱滴定的重要方法。'
  },
  {
    id: 'lavoisier-q1',
    chemistId: 'lavoisier',
    description: '拉瓦锡通过加热氧化汞分解实验，发现了什么气体？',
    options: [
      '氮气',
      '氢气',
      '氧气',
      '二氧化碳'
    ],
    correctIndex: 2,
    explanation: '拉瓦锡发现氧化汞加热分解产生的气体能助燃，将其命名为"氧气"。',
    historicalContext: '这个实验推翻了统治化学界百年的"燃素说"，开创了现代化学。'
  },
  {
    id: 'lavoisier-q2',
    chemistId: 'lavoisier',
    description: '拉瓦锡提出的化学反应基本定律是？',
    options: [
      '定比定律',
      '质量守恒定律',
      '倍比定律',
      '气体反应体积定律'
    ],
    correctIndex: 1,
    explanation: '拉瓦锡通过精确的定量实验证明：化学反应前后总质量不变。',
    historicalContext: '他用定量实验方法将化学从定性研究推向定量研究。'
  },
  {
    id: 'lavoisier-q3',
    chemistId: 'lavoisier',
    description: '拉瓦锡将水通过灼热的铁管，发现水可以分解产生什么气体？',
    options: [
      '氧气',
      '氢气',
      '氮气',
      '一氧化碳'
    ],
    correctIndex: 1,
    explanation: '拉瓦锡发现水分解产生氢气，证明水不是元素而是化合物。',
    historicalContext: '这个实验彻底推翻了水是基本元素的古老观念。'
  },
  {
    id: 'lavoisier-q4',
    chemistId: 'lavoisier',
    description: '拉瓦锡在法国大革命中因何罪名被送上断头台？',
    options: [
      '叛国罪',
      '税务官身份',
      '学术造假',
      '反革命宣传'
    ],
    correctIndex: 1,
    explanation: '拉瓦锡因为曾担任包税官的职务，在法国大革命中被送上断头台。',
    historicalContext: '著名数学家拉格朗日惋惜道："砍下他的头只需要一瞬间，但再长出这样的头脑也许需要一百年。"'
  },
  {
    id: 'mendeleev-q1',
    chemistId: 'mendeleev',
    description: '门捷列夫是根据元素的什么性质来排列元素周期表的？',
    options: [
      '原子序数',
      '原子量',
      '质子数',
      '电子数'
    ],
    correctIndex: 1,
    explanation: '门捷列夫按照原子量递增的顺序排列元素，发现了元素性质的周期性。',
    historicalContext: '后来莫斯莱发现应该按原子序数排列，但门捷列夫的周期律依然正确。'
  },
  {
    id: 'mendeleev-q2',
    chemistId: 'mendeleev',
    description: '门捷列夫的周期表中预言了"类铝"元素，后来被发现的是？',
    options: [
      '锗',
      '镓',
      '钪',
      '铟'
    ],
    correctIndex: 1,
    explanation: '门捷列夫预言的"类铝"就是后来发现的镓，其性质与预言惊人吻合。',
    historicalContext: '镓是第一种被发现的、门捷列夫预言的元素，这使周期律获得广泛认可。'
  },
  {
    id: 'mendeleev-q3',
    chemistId: 'mendeleev',
    description: '门捷列夫编制元素周期表是在哪一年？',
    options: [
      '1859年',
      '1869年',
      '1879年',
      '1889年'
    ],
    correctIndex: 1,
    explanation: '1869年，门捷列夫正式发表了他的元素周期表。',
    historicalContext: '有趣的是，他是在玩"化学纸牌"游戏时获得灵感排列出元素周期表的。'
  },
  {
    id: 'mendeleev-q4',
    chemistId: 'mendeleev',
    description: '门捷列夫预言的"类硅"元素，后来被发现并命名为？',
    options: [
      '锗',
      '硒',
      '砷',
      '溴'
    ],
    correctIndex: 0,
    explanation: '门捷列夫预言的"类硅"就是锗，由德国化学家温克勒在1886年发现。',
    historicalContext: '锗的发现进一步证实了元素周期律的正确性，门捷列夫的预言几乎分毫不差。'
  }
];

export const funFacts: FunFact[] = [
  {
    id: 'fact-1',
    chemistId: 'boyle',
    title: '波义耳与指示剂',
    content: '波义耳是第一个发现酸碱指示剂的人！他无意中将紫罗兰花瓣掉入盐酸中，发现花瓣变红，由此发明了石蕊试纸。',
    year: 1645
  },
  {
    id: 'fact-2',
    chemistId: 'boyle',
    title: '不信炼金术的化学家',
    content: '波义耳出生在一个炼金术盛行的年代，但他却公开质疑炼金术的"点石成金"之说，认为必须通过实验来验证一切。',
    year: 1661
  },
  {
    id: 'fact-3',
    chemistId: 'boyle',
    title: '科学家与宗教',
    content: '波义耳是一位非常虔诚的基督徒，他用自己的财产设立了"波义耳讲座"，专门用于捍卫基督教信仰。',
    year: 1691
  },
  {
    id: 'fact-4',
    chemistId: 'lavoisier',
    title: '拉瓦锡的断头实验',
    content: '拉瓦锡在法国大革命中被送上断头台。传说他与刽子手约定，头被砍下后尽可能眨眼，以验证人死后是否还有意识。据说他眨了15次眼。',
    year: 1794
  },
  {
    id: 'fact-5',
    chemistId: 'lavoisier',
    title: '21岁的气象学家',
    content: '拉瓦锡从21岁开始，连续15年每天早上4点起床，晚上10点睡觉，坚持记录天气数据，一生中从未间断。',
    year: 1764
  },
  {
    id: 'fact-6',
    chemistId: 'lavoisier',
    title: '命名氧气的人',
    content: '"氧气"（Oxygen）这个名字是拉瓦锡起的，在希腊语中意为"酸的形成者"，因为他错误地认为所有酸都含有氧。',
    year: 1777
  },
  {
    id: 'fact-7',
    chemistId: 'mendeleev',
    title: '被拒绝的诺贝尔奖',
    content: '门捷列夫的元素周期表如此重要，但他却从未获得诺贝尔奖。因为1906年的评委会主席与他有私怨，以"周期表太老"为由否决了他。',
    year: 1906
  },
  {
    id: 'fact-8',
    chemistId: 'mendeleev',
    title: '全能的门捷列夫',
    content: '门捷列夫不仅是化学家，还研究过气象学、地质学、经济学，甚至参与过北极探险。他为俄罗斯的度量衡制度奠定了基础。',
    year: 1899
  },
  {
    id: 'fact-9',
    chemistId: 'mendeleev',
    title: '化学纸牌游戏',
    content: '门捷列夫发明元素周期表的灵感来自于他爱玩的"化学纸牌"游戏。他把每种元素写在卡片上，像玩扑克牌一样排列，终于发现了元素周期律。',
    year: 1869
  }
];

const usedQuestionIds: Set<string> = new Set();
const unlockedFactIds: Set<string> = new Set();

export function getQuestionsByChemist(chemistId: string): Question[] {
  return questions.filter(q => q.chemistId === chemistId);
}

export function getRandomQuestion(chemistId: string): Question | null {
  const chemistQuestions = getQuestionsByChemist(chemistId).filter(
    q => !usedQuestionIds.has(q.id)
  );
  
  if (chemistQuestions.length === 0) {
    usedQuestionIds.clear();
    return getRandomQuestion(chemistId);
  }
  
  const randomIndex = Math.floor(Math.random() * chemistQuestions.length);
  const selectedQuestion = chemistQuestions[randomIndex];
  usedQuestionIds.add(selectedQuestion.id);
  return selectedQuestion;
}

export function getRandomFact(chemistId?: string): FunFact | null {
  let availableFacts = chemistId 
    ? funFacts.filter(f => f.chemistId === chemistId && !unlockedFactIds.has(f.id))
    : funFacts.filter(f => !unlockedFactIds.has(f.id));
  
  if (availableFacts.length === 0) {
    unlockedFactIds.clear();
    availableFacts = chemistId 
      ? funFacts.filter(f => f.chemistId === chemistId)
      : funFacts;
  }
  
  const randomIndex = Math.floor(Math.random() * availableFacts.length);
  const selectedFact = availableFacts[randomIndex];
  unlockedFactIds.add(selectedFact.id);
  return selectedFact;
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

export function getChemistById(id: string): Chemist | undefined {
  return chemists.find(c => c.id === id);
}
