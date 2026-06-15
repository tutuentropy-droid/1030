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
  TreePine,
  Zap,
  Users,
  ArrowLeft,
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

type GameMode = "cognitive-bias" | "primitive-era" | "story-mode";

type PrimitiveCategoryType = "calorie-craving" | "instant-reward" | "group-identity" | "danger-sensitivity";

interface PrimitiveOption {
  id: string;
  label: string;
  isInstinctual: boolean;
}

interface PrimitiveQuestion {
  id: string;
  category: PrimitiveCategoryType;
  categoryIndex: number;
  questionNumber: number;
  scenario: string;
  atmosphere: string;
  options: PrimitiveOption[];
  instinctOptionId: string;
  primitiveReason: string;
  modernTrap: string;
  modernExample: string;
  brainRegion: string;
}

interface AnsweredPrimitiveQuestion {
  questionId: string;
  selectedOptionId: string;
  followedInstinct: boolean;
  category: PrimitiveCategoryType;
}

type StoryId = "overloaded-office-worker" | "reward-addicted-scroller";
type StoryPhase = "intro" | "scene" | "reflection" | "result";

interface StoryChoice {
  id: string;
  label: string;
  consequence: string;
  brainEffect: string;
  isAdaptive: boolean;
  nextSceneId?: string;
}

interface StoryScene {
  id: string;
  sceneNumber: number;
  setting: string;
  atmosphere: string;
  narrative: string;
  brainState: string;
  brainRegion: string;
  choices: StoryChoice[];
}

interface StoryData {
  id: StoryId;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  icon: typeof Brain;
  brainCondition: string;
  brainConditionDescription: string;
  scenes: StoryScene[];
  neuroscienceLessons: string[];
}



const STORIES: Record<StoryId, StoryData> = {
  "overloaded-office-worker": {
    id: "overloaded-office-worker",
    title: "前额叶超载的一天",
    subtitle: "当你的理性中枢被榨干时……",
    emoji: "💼",
    color: "#3a86ff",
    icon: Brain,
    brainCondition: "前额叶皮层工作超载",
    brainConditionDescription: "你的前额叶皮层（负责决策、自控、规划的脑区）已经连续高负荷运转12小时。工作记忆容量耗尽，血清素水平下降，冲动控制能力减弱。这种状态下，你更容易被认知偏差捕获，做出糟糕的决策。",
    scenes: [
      {
        id: "office-scene-1",
        sceneNumber: 1,
        setting: "晚上9点，公司会议室",
        atmosphere: "🌙 窗外是漆黑的夜空，会议室里只剩你一个人。电脑屏幕发出的冷光照在你疲惫的脸上。咖啡机已经是第四杯了。",
        narrative: "你已经加班到第12个小时。老板发消息说：'明天早上8点前，把这个项目的三个方案都做出来，我要和客户开会。'你看着屏幕上密密麻麻的数据，感觉脑子像一团浆糊。",
        brainState: "你的前额叶皮层葡萄糖水平下降了30%，工作记忆容量从7±2个信息块降到了3个。你现在的决策能力，相当于血液酒精浓度0.05%的状态——接近酒驾标准。",
        brainRegion: "背外侧前额叶皮层（DLPFC）+ 前扣带皮层（ACC） → 活动减弱，错误检测能力下降",
        choices: [
          {
            id: "a",
            label: "咬咬牙，今晚通宵把三个方案都做完",
            consequence: "你熬到凌晨4点，三个方案都做了但质量很差。第二天开会客户一眼就看出是仓促完成的，老板对你很失望。",
            brainEffect: "睡眠剥夺让前额叶活动进一步下降，杏仁核活动增强20%，你变得更容易情绪化和冲动。",
            isAdaptive: false,
          },
          {
            id: "b",
            label: "先选一个方案认真做，另外两个做简单框架，明早和老板沟通调整优先级",
            consequence: "你11点就睡觉了，第二天早上6点起来把主要方案打磨得很精致。老板看了后说：'一个做得好的方案比三个凑数的强太多了，就用这个。'",
            brainEffect: "充足的睡眠让前额叶功能恢复，你在做重要决策时能够调用系统2（理性分析）而不是依赖系统1（直觉冲动）。",
            isAdaptive: true,
          },
          {
            id: "c",
            label: "直接回复老板说'做不完， deadline不合理'，然后立刻下班",
            consequence: "老板很生气，在团队群里点名批评了你。虽然你睡了个好觉，但职场关系出现了裂痕。",
            brainEffect: "你的杏仁核（情绪中枢）在疲惫状态下接管了决策，导致了冲动的情绪化反应。前额叶的冲动控制回路完全失灵。",
            isAdaptive: false,
          },
        ],
      },
      {
        id: "office-scene-2",
        sceneNumber: 2,
        setting: "第二天下午2点，公司食堂",
        atmosphere: "🍔 食堂里弥漫着油炸食品的香气。你的肚子咕咕叫——早上太赶没来得及吃早饭。",
        narrative: "你在食堂窗口徘徊。左边是健康餐：水煮鸡胸肉、西兰花、糙米饭，38元。右边是套餐：炸鸡、薯条、可乐，25元还送一个汉堡。你摸了摸口袋，这个月还剩3天，工资已经花得差不多了。",
        brainState: "低血糖状态下，你的眶额叶皮层（价值评估中枢）对高热量食物的奖赏信号放大了50%。同时，血清素不足让你更难抵制即时满足的诱惑。",
        brainRegion: "眶额叶皮层（OFC）+ 伏隔核（奖励中枢） → 高热量食物的多巴胺奖赏信号被放大",
        choices: [
          {
            id: "a",
            label: "当然选健康餐！虽然贵，但对身体好",
            consequence: "你吃了健康餐，下午开会时精力充沛，思路清晰。虽然花了钱，但你为自己的自控力感到自豪。",
            brainEffect: "你成功地用腹内侧前额叶（长远价值评估）压制了伏隔核的即时奖赏信号。这消耗了一部分认知资源，但训练了自控力。",
            isAdaptive: true,
          },
          {
            id: "b",
            label: "炸鸡套餐太划算了！反正只是偶尔吃一次",
            consequence: "你吃了炸鸡套餐，下午3点准时犯困，开会时差点睡着。老板以为你昨晚又通宵了。",
            brainEffect: "高脂肪高糖食物触发了多巴胺大量释放，你的奖励中枢被'劫持’了。吃完后血糖骤升骤降，反而让你更疲惫。",
            isAdaptive: false,
          },
          {
            id: "c",
            label: "算了，不吃了，减肥省钱一举两得",
            consequence: "你饿着肚子开会，下午4点时已经饿得前胸贴后背，完全没法集中注意力。下班路上忍不住买了更贵的蛋糕和奶茶。",
            brainEffect: "过度的自我克制导致'自我损耗'（ego depletion），随后你的自控力完全崩溃。这就是为什么节食减肥90%会失败。",
            isAdaptive: false,
          },
        ],
      },
      {
        id: "office-scene-3",
        sceneNumber: 3,
        setting: "晚上7点，地铁上",
        atmosphere: "📱 拥挤的地铁里，每个人都低着头看手机。你疲惫地抓着扶手，感觉大脑像被抽空了一样。",
        narrative: "你刷朋友圈，看到同事发了一条：'感谢老板认可！这次晋升太开心了🎉'配了一张和CEO握手的照片。你心里咯噔一下——你们是同期入职的，你一直觉得自己做得比他好。",
        brainState: "疲劳状态下，你的社会比较回路被过度激活。腹侧被盖区（VTA）的多巴胺能神经元对'他人的成功'产生了类似'损失'的反应。",
        brainRegion: "腹内侧前额叶（社会比较）+ 杏仁核（嫉妒情绪） → 社会痛苦和身体疼痛共享神经通路",
        choices: [
          {
            id: "a",
            label: "立刻点赞评论：'太棒了！恭喜恭喜！'真心为他高兴",
            consequence: "你真诚地祝福了同事。他私信你说：'谢谢！其实这次项目你的方案给了我很大启发，下次有机会我们合作。'你们的关系更近了一步。",
            brainEffect: "你主动激活了腹内侧前额叶的'共情'回路，压制了杏仁核的'嫉妒'反应。这种主动的情绪调节会让你在下次遇到类似情况时更从容。",
            isAdaptive: true,
          },
          {
            id: "b",
            label: "假装没看见，刷过去。心里越想越气：凭什么是他？",
            consequence: "你越想越生气，回家路上一直琢磨这件事，连晚饭都没胃口。晚上失眠到12点，反复想'我到底哪里不如他'。",
            brainEffect: "你的杏仁核持续激活，皮质醇水平升高，导致睡眠质量下降。这种'反刍思维'（rumination）是抑郁症和焦虑症的重要诱因。",
            isAdaptive: false,
          },
          {
            id: "c",
            label: "点赞但心里酸溜溜的。晚上和老婆吐槽：'他肯定是靠关系上去的'",
            consequence: "你和老婆吐槽了半小时，她本来心情很好，被你说得也很烦。你发泄完感觉好了一点，但夫妻关系悄悄蒙上了一层阴影。",
            brainEffect: "你通过'抱怨'这种方式来降低杏仁核的激活度，但代价是强化了'受害者心态'的神经回路。抱怨越多，大脑就越擅长找理由抱怨。",
            isAdaptive: false,
          },
        ],
      },
      {
        id: "office-scene-4",
        sceneNumber: 4,
        setting: "晚上10点，家里沙发上",
        atmosphere: "🛋️ 你瘫在沙发上，电视开着但你根本没在看。手机在旁边，屏幕时不时亮一下。",
        narrative: "你本来计划今晚学两小时Python，为转岗做准备。但是太累了——你已经连续工作了13天，没有休息过一天。手机弹出一条推送：'震惊！985毕业生毕业三年年薪百万，只因做对了这件事……'",
        brainState: "你的前额叶已经没有足够的认知资源来做'延迟满足'的决策了。腹侧纹状体（即时奖励）和前额叶（延迟奖励）的神经博弈中，前者占据了绝对上风。",
        brainRegion: "腹侧纹状体（即时奖励） vs 前额叶皮层（延迟满足） → 95%的概率腹侧纹状体赢",
        choices: [
          {
            id: "a",
            label: "关掉手机，打开电脑开始学Python。两个小时后再休息",
            consequence: "你强迫自己学了两个小时，虽然效率不高，但还是学完了一整章。睡前你觉得很充实，对未来更有信心了。",
            brainEffect: "你在'认知疲劳'的状态下依然调用前额叶完成了困难的任务。这就像在肌肉酸痛时继续锻炼——虽然痛苦，但能增强你的'自控肌肉'。",
            isAdaptive: true,
          },
          {
            id: "b",
            label: "先休息15分钟刷会儿手机，然后再学。然后就刷到了凌晨2点……",
            consequence: "你刷手机刷到凌晨2点，看了几百条短视频、十几篇公众号文章。睡前你觉得非常空虚，骂自己'又浪费了一晚上'，然后焦虑得睡不着。",
            brainEffect: "短视频的'可变比率强化'（variable ratio reinforcement）机制让你的多巴胺系统'脱敏'——你需要越来越强的刺激才能获得同样的快感。这和药物成瘾的神经机制完全一样。",
            isAdaptive: false,
          },
          {
            id: "c",
            label: "今天太累了，早点睡，明天早点起再学。然后你定了早上5点的闹钟",
            consequence: "你11点就睡了，第二天5点准时起床。清晨的大脑特别清醒，你学了两个小时，效率是平时的3倍。你发现'早睡早起'比'熬夜硬撑'效率高太多了。",
            brainEffect: "睡眠期间，你的海马体（记忆转化中枢）会把白天的信息转化为长期记忆。充足的睡眠还能'重置'前额叶的认知资源，让你第二天的决策质量大幅提升。",
            isAdaptive: true,
          },
        ],
      },
    ],
    neuroscienceLessons: [
      "前额叶的认知资源是有限的。连续做高难度决策后，你的决策质量会显著下降——这不是意志力问题，是神经科学事实。",
      "睡眠剥夺对决策能力的影响等同于血液酒精浓度0.05%。重要决策请在你状态最好的时候做。",
      "自我控制就像肌肉——使用后会疲劳，但通过锻炼可以增强。不过过度使用也会导致'自我损耗'。",
      "社会比较激活的脑区和生理疼痛完全一样。'别人的成功'对你的大脑来说就像'自己的损失'。",
      "多巴胺的功能不是'快乐'，而是'预测快乐'。短视频利用的就是'期待'的多巴胺，而不是'满足'的多巴胺。",
      "好的决策不是靠意志力'硬扛'，而是靠环境设计——比如把手机放到另一个房间，比靠意志力抵制刷手机要有效10倍。",
    ],
  },
  "reward-addicted-scroller": {
    id: "reward-addicted-scroller",
    title: "短视频成瘾者的24小时",
    subtitle: "当你的奖励系统被劫持时……",
    emoji: "📱",
    color: "#f72585",
    icon: Zap,
    brainCondition: "多巴胺奖励系统超敏化",
    brainConditionDescription: "你的多巴胺受体（D2受体）因长期过度刺激而下调了40%。你需要越来越强的刺激才能获得同样的满足感。平静的阅读、深度的思考对你来说已经变得'无聊'——因为它们无法触发足够的多巴胺释放。这就是'享乐适应性'（hedonic adaptation）的神经基础。",
    scenes: [
      {
        id: "scroller-scene-1",
        sceneNumber: 1,
        setting: "早上7点，你的床上",
        atmosphere: "😴 闹钟响了第三次。你眯着眼睛摸到手机，第一件事就是打开抖音——甚至还没完全睁开眼。",
        narrative: "你本来定了7点的闹钟，打算早起去晨跑、做早餐、背英语单词。但是现在已经8点了，你还在床上刷短视频。每一个15秒的视频都比上一个更'精彩'，你的手指无意识地向上滑动，完全停不下来。",
        brainState: "你的腹侧被盖区（VTA）的多巴胺能神经元已经处于'超敏状态'。只要一想到刷短视频，多巴胺就开始释放，让你产生'期待感'——但这种期待永远不会被真正满足，因为下一个视频永远更'精彩'。",
        brainRegion: "腹侧被盖区（VTA）→ 伏隔核 → 背外侧纹状体（习惯形成） → 多巴胺预测误差回路被劫持",
        choices: [
          {
            id: "a",
            label: "立刻关掉抖音，起床。把手机放到客厅，去洗漱。",
            consequence: "你强迫自己起床，虽然前10分钟很难受，但出门晨跑后感觉整个人都清醒了。早餐后你背了30个单词，成就感满满的一天开始了。",
            brainEffect: "你打断了多巴胺的'条件反射'回路。每次你抵制了刷手机的冲动，前额叶到伏隔核的抑制性连接就会增强一点——下次再抵制就会更容易。",
            isAdaptive: true,
          },
          {
            id: "b",
            label: "再刷'最后10分钟'……然后就到了9点，你慌慌张张地出门上班，连早饭都没吃。",
            consequence: "你迟到了20分钟，被领导当众批评。一整天你都昏昏沉沉，因为刷手机的'多巴胺高潮'之后必然是'多巴胺低谷'——你感觉做什么都没兴趣，工作效率极低。",
            brainEffect: "多巴胺的'预测误差'机制被算法利用了。每个视频结束时，你的多巴胺会短暂下降，然后下一个视频的'悬念'又让它升高。这种波动会让你的多巴胺系统'脱敏'，你需要越来越强的刺激才能感觉'正常'。",
            isAdaptive: false,
          },
          {
            id: "c",
            label: "反正已经迟到了，干脆请假在家。刷个够！",
            consequence: "你刷了一整天，从抖音到小红书到B站，再刷回来。晚上12点你放下手机，感觉眼睛干涩、头疼欲裂，心里无比空虚——你甚至想不起来今天都看了什么。",
            brainEffect: "连续12小时的多巴胺刺激会让你的D2受体进一步下调。你会发现，以前觉得有趣的事情（看书、和朋友聊天、运动）现在都变得'没意思'了——因为它们无法触发足够的多巴胺。",
            isAdaptive: false,
          },
        ],
      },
      {
        id: "scroller-scene-2",
        sceneNumber: 2,
        setting: "下午3点，公司会议室",
        atmosphere: "📊 老板在上面讲季度业绩，PPT一页一页翻着。你坐在最后一排，手机在口袋里震动了一下。",
        narrative: "老板正在讲一个很重要的新项目，和你部门直接相关。但是你的手已经不自觉地伸向了口袋。抖音的推送图标在你脑海里闪啊闪——你感觉如果不看一眼，浑身都不舒服。",
        brainState: "你的背外侧纹状体已经形成了'无聊→刷手机'的自动化习惯回路。这种'习惯记忆'是非常牢固的，因为它存储在大脑的'程序记忆'系统中——和骑自行车、打字是同一个系统。",
        brainRegion: "背外侧纹状体（习惯系统） vs 前额叶（控制系统） → 当你无聊时，习惯系统自动接管",
        choices: [
          {
            id: "a",
            label: "把手机调到静音，放回口袋。认真听老板讲话，做笔记。",
            consequence: "你认真听完了整个会议，发现这个新项目里有一个正好适合你的机会。会后你主动找老板沟通，拿到了项目的核心模块。",
            brainEffect: "你用前额叶的'控制系统'压制了纹状体的'习惯系统'。每次这样做，你都在弱化'无聊→刷手机'的神经连接，强化'无聊→专注'的连接。",
            isAdaptive: true,
          },
          {
            id: "b",
            label: "偷偷拿出手机，刷5分钟就好。结果一刷就是40分钟，抬头时会议已经结束了。",
            consequence: "散会时老板特意过来问你：'刚才说的你都听清了吧？下周给我你的想法。'你根本不知道他说了什么，只能硬着头皮说'听清了'。整个周末你都在焦虑这件事。",
            brainEffect: "每次你在无聊时刷手机，都在强化'无聊→刷手机'的神经通路。这个回路越用越强，最后你会发现：只要一坐下来，手就自动伸向手机——完全不需要思考。",
            isAdaptive: false,
          },
          {
            id: "c",
            label: "假装去厕所，在厕所里刷20分钟。",
            consequence: "你在厕所里刷了20分钟，回来时会议已经到了问答环节。老板问：'大家还有什么问题吗？'没人说话，他看向你：'你呢，有什么想法？'你支支吾吾，一个字也说不出来。",
            brainEffect: "你用'逃避'的方式来应对'无聊'这种轻微的负面情绪。长期来看，这会让你的'情绪耐受度'越来越低——你将无法忍受任何轻微的不适、无聊、焦虑。",
            isAdaptive: false,
          },
        ],
      },
      {
        id: "scroller-scene-3",
        sceneNumber: 3,
        setting: "晚上8点，你的出租屋",
        atmosphere: "🍜 你刚吃完外卖，电脑开着，是你上周开始看的公开课——《行为经济学》。你还买了配套的书，翻了前三章。",
        narrative: "你本来计划今晚学两小时公开课，下周要考证。但是你坐在电脑前，看着满屏的公式，心里只有一个念头：'好无聊啊……先刷5分钟抖音放松一下，然后再学。'",
        brainState: "你的多巴胺系统已经'脱敏'了。学习这种'延迟满足'的行为，多巴胺释放是缓慢而持续的——但你现在需要的是'即时、大量'的多巴胺释放。就像一个吸毒者，普通的快乐已经满足不了他了。",
        brainRegion: "腹内侧前额叶（长远价值评估） vs 腹侧纹状体（即时奖励） → 多巴胺脱敏让长远价值的权重下降",
        choices: [
          {
            id: "a",
            label: "把手机放到另一个房间，强迫自己学10分钟。如果10分钟后还是不想学，就休息。",
            consequence: "你学了10分钟，发现其实也没那么难。进入状态后你一口气学了两个小时，做了满满三页笔记。睡前你觉得'今天没有白过'。",
            brainEffect: "你用'5分钟启动法'绕过了多巴胺的'门槛'。一旦你开始做困难的事情，前额叶的'认知控制'回路就会接管。学习产生的'持续多巴胺'虽然不强烈，但更持久，也更健康。",
            isAdaptive: true,
          },
          {
            id: "b",
            label: "先刷5分钟抖音'放松'一下，然后就开始学。然后就刷到了凌晨1点……",
            consequence: "你刷到凌晨1点，看了几百条视频。睡前你发誓'明天一定开始学习'，但你已经发过100次同样的誓了。你看着还没翻开的书，觉得自己'没救了'。",
            brainEffect: "抖音的算法比任何神经科学家都更懂如何操纵你的多巴胺系统。它会根据你的观看时长、点赞、评论实时调整内容，让你的多巴胺维持在'刚好不满足但又足够期待'的状态——这和老虎机的原理完全一样。",
            isAdaptive: false,
          },
          {
            id: "c",
            label: "今天不想学，看个电影吧。选一个一直想看的高分电影。",
            consequence: "你看了一部两个小时的高分电影，看完后觉得很震撼，引发了很多思考。你发现'被动输入高质量内容'也比'被动刷垃圾内容'强太多了。",
            brainEffect: "看电影也会触发多巴胺释放，但它是'叙事驱动'的，而不是'间歇性强化'的。你不会'脱敏'，反而会因为深度内容的满足感，减少对即时刺激的渴望。",
            isAdaptive: true,
          },
        ],
      },
      {
        id: "scroller-scene-4",
        sceneNumber: 4,
        setting: "凌晨1点，你的床上",
        atmosphere: "🌙 又是凌晨1点。你刷完最后一个视频，放下手机，盯着漆黑的天花板。你明明很累，但就是睡不着——大脑还处于兴奋状态。",
        narrative: "你又熬夜了。你刷到的最后一个视频是'30天改变自己计划'，看完后你热血沸腾，立刻在购物车加了瑜伽垫、哑铃、英文原著、钢笔字帖。然后你又刷到一个'当代年轻人的困境'的视频，又开始emo，觉得自己'这辈子就这样了'。",
        brainState: "你的大脑在凌晨1点处于'低前额叶活动、高情绪活动'的状态。前额叶的'理性判断'能力减弱，杏仁核的'情绪反应'增强。这就是为什么你总是在深夜做冲动的决定，然后第二天早上后悔。",
        brainRegion: "前额叶活动减弱 + 杏仁核活动增强 + 血清素水平降低 → 情绪化决策的完美配方",
        choices: [
          {
            id: "a",
            label: "清空购物车，放下手机，深呼吸100次，睡觉。",
            consequence: "你清空了购物车，做了100次深呼吸，很快就睡着了。第二天早上你神清气爽，为自己昨晚的'清醒'感到骄傲。你做了一个真正的'改变计划'，虽然比抖音上的'30天改变自己'要朴素，但更可行。",
            brainEffect: "深呼吸激活了迷走神经，降低了杏仁核的活动，让前额叶重新'掌权'。清空购物车的行为打破了'冲动消费'的多巴胺循环，你用行动告诉大脑：'我才是主人，不是你。'",
            isAdaptive: true,
          },
          {
            id: "b",
            label: "一不做二不休，直接下单！不就是几千块钱吗，投资自己！",
            consequence: "你下单了所有东西，花了3000多。第二天早上起来你就后悔了。瑜伽垫至今还在墙角积灰，英文原著翻了两页就看不下去了。你看着信用卡账单，觉得自己太蠢了。",
            brainEffect: '深夜的多巴胺+杏仁核激活让你做出了冲动消费的决定。"购物疗法"（retail therapy）确实能短暂提升情绪，但随之而来的是更强的内疚感和焦虑感——然后你又需要更多的购物来缓解，形成恶性循环。',
            isAdaptive: false,
          },
          {
            id: "c",
            label: "越想越emo，起来喝一罐啤酒，再刷会儿'治愈'视频。",
            consequence: "你喝了啤酒，刷了很多'治愈''励志'视频，感觉好了一点。但凌晨3点才睡着，第二天上班迟到，昏昏沉沉一整天。你在恶性循环里越陷越深。",
            brainEffect: "酒精会进一步抑制前额叶功能，同时激活多巴胺系统——相当于'火上浇油'。用'治愈视频'来缓解'刷太多视频的空虚'，就像用更多的毒品来缓解毒品成瘾的戒断反应。",
            isAdaptive: false,
          },
        ],
      },
    ],
    neuroscienceLessons: [
      "多巴胺的核心功能不是'快乐'，而是'动机'。它让你'想要'（wanting），但不保证你'喜欢'（liking）。短视频让你'想要'一直刷，但你几乎不会'喜欢'刷完后的感觉。",
      "可变比率强化（variable ratio reinforcement）是最容易成瘾的奖励机制——你永远不知道下一个视频会不会'精彩'，这和老虎机的原理完全一样。",
      "多巴胺脱敏（dopamine desensitization）是成瘾的神经基础。长期过度刺激后，你的多巴胺受体会下调，你需要越来越强的刺激才能获得同样的感觉。",
      "习惯形成的神经通路：前额叶（目标导向）→ 纹状体（习惯）。当行为变成习惯后，你不再需要'思考'就会自动执行——这就是'无意识刷手机'的神经机制。",
      "延迟满足的神经基础：前额叶皮层能够'想象未来的奖励'，从而压制腹侧纹状体对即时奖励的渴望。但这需要消耗认知资源，而且在疲劳状态下会失效。",
      "打破多巴胺成瘾的关键不是'靠意志力硬扛'，而是'重新设计环境'——把手机放到另一个房间、删除APP、设置屏幕使用时间，这些都比靠意志力有效得多。",
    ],
  },
};

interface AnsweredStoryQuestion {
  sceneId: string;
  choiceId: string;
  isAdaptive: boolean;
  storyId: StoryId;
}

const PRIMITIVE_CATEGORY_META: Record<PrimitiveCategoryType, {
  label: string;
  primitiveLabel: string;
  emoji: string;
  color: string;
  icon: typeof Flame;
  modernTitle: string;
  modernExamples: string[];
}> = {
  "calorie-craving": {
    label: "高热量偏好",
    primitiveLabel: "热量就是生命",
    emoji: "🍖",
    color: "#fb5607",
    icon: Flame,
    modernTitle: "消费主义的食物陷阱",
    modernExamples: ["奶茶、炸鸡、甜品——精准触发你对高热量的原始渴望", "食品工业用糖+脂肪+盐的“极乐点”配方让你无法抗拒", "自助餐、大份量——你的原始脑在说'能量充足！快囤！'但能量永远充足"],
  },
  "instant-reward": {
    label: "即时奖励偏好",
    primitiveLabel: "现在到手才是真的",
    emoji: "⚡",
    color: "#00d4ff",
    icon: Zap,
    modernTitle: "短视频与即时满足的陷阱",
    modernExamples: ["短视频15秒一个多巴胺脉冲，比读书“靠谱”多了", "游戏每日签到、抽卡——可变比率强化让你停不下来", "信用卡分期让你觉得“每月只要300”——延迟折扣让你忽略总成本"],
  },
  "group-identity": {
    label: "群体认同偏好",
    primitiveLabel: "离开群体等于死亡",
    emoji: "👥",
    color: "#9d4edd",
    icon: Users,
    modernTitle: "从众消费与信息茧房",
    modernExamples: ["社交媒体“点赞”机制——没有赞 = 被部落排斥 = 社交疼痛", "信息茧房——算法只推“和你一样”的内容，你越来越确信自己是对的", "饭圈文化、品牌战争——“我们vs他们”的原始框架被商业利用"],
  },
  "danger-sensitivity": {
    label: "危险信息敏感",
    primitiveLabel: "宁可信其有不可信其无",
    emoji: "⚠️",
    color: "#e63946",
    icon: AlertTriangle,
    modernTitle: "焦虑经济与恐惧营销",
    modernExamples: ["负面新闻点击率是正面新闻的3倍——你的大脑为恐惧买单", "焦虑推送、末日预言让你的皮质醇长期升高", "保险广告、保健品营销——“假设最坏”的原始策略被精准利用"],
  },
};

const PRIMITIVE_QUESTIONS: PrimitiveQuestion[] = [
  {
    id: "cal-1",
    category: "calorie-craving",
    categoryIndex: 0,
    questionNumber: 1,
    scenario: "丛林深处，你发现两处食物来源——一棵挂满鲜红甜果的树，和一片纤维丰富的野菜。你肚子很饿，只能选一处。",
    atmosphere: "🌿 阳光穿过树冠，甜果散发着诱人的香气……",
    options: [
      { id: "a", label: "冲向甜果树！甜=能量=活下去！", isInstinctual: true },
      { id: "b", label: "选择野菜——纤维更耐饿，细水长流", isInstinctual: false },
      { id: "c", label: "各采一点，平衡膳食", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "甜味意味着高热量糖分，在食物匮乏的原始时代，获取最大热量是生存第一法则。一串甜果的能量可能是野菜的5倍。你的选择完全正确——选择甜果的人活下来的概率更大。",
    modernTrap: "你的大脑依然用“甜=好”来判断食物，但现代社会糖分无处不在且极其廉价。奶茶、蛋糕、薯片——它们精准地触发你对高热量的原始渴望，但你现在并不需要那么多能量。",
    modernExample: "一杯700ml全糖奶茶≈700大卡，相当于原始人3天的甜果摄入量。你的原始脑在狂欢，你的身体在崩溃。",
    brainRegion: "伏隔核（奖励中枢）+ 岛叶（味觉皮层）→ 多巴胺大量释放",
  },
  {
    id: "cal-2",
    category: "calorie-craving",
    categoryIndex: 0,
    questionNumber: 2,
    scenario: "部落猎到了一头野猪，你负责分配。你可以选择肥肉部分还是瘦肉部分。",
    atmosphere: "🔥 篝火旁，野猪肉滋滋作响，肥肉油光锃亮……",
    options: [
      { id: "a", label: "肥肉！脂肪才是最值钱的东西", isInstinctual: true },
      { id: "b", label: "瘦肉——蛋白质才是长肌肉的关键", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "脂肪的能量密度是蛋白质的2倍多（9kcal/g vs 4kcal/g），在随时可能挨饿的时代，脂肪就是“能量银行”。选择肥肉的人活下来的概率更大。",
    modernTrap: "现代食品工业用氢化植物油、棕榈油制造“超美味”的高脂食物，让你的原始大脑疯狂释放多巴胺。炸鸡、火锅、芝士——你以为是“好吃”，其实是你的原始脑在说“快囤能量！冬天要来了！”——但冬天永远不会来。",
    modernExample: "一顿火锅热量可达2000大卡，而你一天只需1800大卡。你每次“放纵餐”都在告诉原始脑“发现超级猎物！赶紧吃！”但第二天你又坐在了办公桌前。",
    brainRegion: "眶额叶皮层（价值评估）+ 伏隔核 → 对高脂食物的奖赏信号放大3倍",
  },
  {
    id: "cal-3",
    category: "calorie-craving",
    categoryIndex: 0,
    questionNumber: 3,
    scenario: "你意外发现了一个蜂巢，里面是珍贵的蜂蜜。你怎么处理？",
    atmosphere: "🍯 金黄色的蜜汁缓缓滴落，空气中弥漫着甜美的气息……",
    options: [
      { id: "a", label: "一次吃个够！这种超级食物太稀有了", isInstinctual: true },
      { id: "b", label: "只取一小部分，留给以后", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "在原始时代，蜂蜜这样的“超级食物”极其罕见，而且很快会被其他动物发现。不一次吃个够，可能永远吃不到第二次。暴食不是贪婪，是生存策略。",
    modernTrap: "这就是“限量版”“限时特惠”背后的心理学——你的大脑对“稀缺”资源的反应方式和发现蜂巢一模一样。双十一抢购、网红店排队、NFT炒作——都是你的原始脑在喊“稀有资源！快抢！”但你买的不是蜂蜜，是一堆用完就扔的东西。",
    modernExample: "双十一3秒抢完的口红，和原始人抢到的蜂巢，在你大脑里激活的是同一块伏隔核。区别是：蜂巢能救命，口红只是消费主义的蜂巢。",
    brainRegion: "腹侧被盖区（VTA）→ 伏隔核：稀缺性放大奖励信号200%",
  },
  {
    id: "ins-1",
    category: "instant-reward",
    categoryIndex: 1,
    questionNumber: 4,
    scenario: "你在河边等待鱼群出现，已经等了半天没有收获。旁边有一丛浆果，虽然不多但可以立即吃。",
    atmosphere: "🌅 夕阳西沉，河水安静流淌，浆果在触手可及的地方……",
    options: [
      { id: "a", label: "先摘浆果！等鱼太不确定了，先填肚子", isInstinctual: true },
      { id: "b", label: "继续等鱼——浆果热量太少，鱼才能真吃饱", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "在原始环境中，未来的奖励高度不确定。那群鱼可能永远不会来，但眼前的浆果是100%确定的。在平均寿命只有30岁的时代，“延迟满足”很多时候意味着“永远满足不了”。",
    modernTrap: "你的大脑仍然用“现在到手”比“以后更多”更值钱的逻辑做决策。短视频算法利用的正是这个——15秒一个多巴胺脉冲，比读一本书“靠谱”多了。你选择了即时满足，但在现代社会，延迟回报的收益是指数级的。",
    modernExample: "刷2小时短视频 = 即时浆果（暂时饱腹）。读2小时书 = 等鱼（长期营养）。原始人选浆果能活命，你选短视频只会更焦虑。",
    brainRegion: "腹侧纹状体（即时奖励）vs 前额叶皮层（延迟满足）→ 95%的时候腹侧纹状体赢",
  },
  {
    id: "ins-2",
    category: "instant-reward",
    categoryIndex: 1,
    questionNumber: 5,
    scenario: "你花了一整天追踪一只受伤的鹿。天快黑了，继续追踪可能明天能抓到，但也可能跟丢。你现在可以放弃追踪，回去吃部落剩下的残羹。",
    atmosphere: "🌲 暮色笼罩森林，血迹越来越淡，远处传来未知动物的嚎叫……",
    options: [
      { id: "a", label: "放弃追踪，回去吃现成的——至少今晚不会饿肚子", isInstinctual: true },
      { id: "b", label: "继续追踪——已经投入这么多，明天大概率能抓到", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "夜间在野外继续追踪极其危险（猛兽、迷路、受伤），而“确定的少量食物”比“不确定的大量食物”在生存计算中更优。原始人不需要“坚持到底”的鸡汤，他们需要的是“别死掉”。",
    modernTrap: "这就是为什么你放弃健身计划、半途而废学语言、辞职考研三天就放弃——你的原始脑在说“太累了，先休息吧”。但现代社会“确定的少量收益”和“坚持后的大量收益”之间的差距比原始时代大了1000倍。",
    modernExample: "放弃健身的第3天感觉和原始人放弃追踪鹿一模一样——“算了，回去吃剩饭也行”。但剩饭变成了外卖，鹿变成了6块腹肌和健康的身体。",
    brainRegion: "杏仁核（风险规避）+ 前扣带皮层（冲突监控）→ 不确定性被放大为危险信号",
  },
  {
    id: "ins-3",
    category: "instant-reward",
    categoryIndex: 1,
    questionNumber: 6,
    scenario: "你面前有一个选择：现在获得3天的食物，或者等一周后获得10天的食物。",
    atmosphere: "⏳ 部落长老看着你，等待你的决定。远处暴风雨正在酝酿……",
    options: [
      { id: "a", label: "现在3天！一周太远了，谁知道会发生什么", isInstinctual: true },
      { id: "b", label: "等一周——3倍多的食物，值得等待", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "这就是“双曲贴现”（Hyperbolic Discounting）的进化根源。在原始时代，一周后你可能在挨饿、生病、甚至已经死了。“现在”的3天食物 = 活3天，“一周后”的10天食物 = 不确定。这不是短视，是统计最优解。",
    modernTrap: "双曲贴现让你在信用卡分期时觉得“每月只要300”，在股市里追涨杀跌，在职业选择中选“轻松但天花板低”的工作。你的大脑仍然用线性折扣来计算未来价值——结果就是永远在为短期快感买单。",
    modernExample: "现在花3000买手机 vs 存下来一年后变成3600。原始脑说“手机现在到手！”但365天后你多出的600元可以变成投资本金、变成旅行基金、变成自由。",
    brainRegion: "腹侧被盖区→伏隔核（即时价值权重3倍于延迟价值）",
  },
  {
    id: "grp-1",
    category: "group-identity",
    categoryIndex: 2,
    questionNumber: 7,
    scenario: "你的部落决定翻过高山迁徙到新领地，但你觉得现在的山谷就很好。你会？",
    atmosphere: "🏔️ 部落的人们开始收拾行囊，长老投来期待的目光……",
    options: [
      { id: "a", label: "跟部落一起走——离开群体等于死亡", isInstinctual: true },
      { id: "b", label: "留下来——这个山谷水源充足，没必要冒险", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "在原始时代，一个人活着几乎不可能。没有群体，就没有合作狩猎、没有育儿支持、没有防御力量。被群体抛弃 = 被判死刑。“跟随群体”不是从众，是生存的必要条件。",
    modernTrap: "你的大脑依然把“和大家不一样”等同于“有生命危险”。这就是为什么你在会议上不敢提出不同意见，为什么你买最新款手机只是因为同事都买了。社交媒体的“点赞”机制精准地激活了你对群体认同的原始渴望——没有被点赞 = 被部落排斥 = 大脑发出社交疼痛信号。",
    modernExample: "发朋友圈没人点赞的焦虑感，和原始人被部落冷落的恐惧，激活的是同一块前扣带皮层。社交疼痛和身体疼痛共享神经通路——你的大脑真的会“疼”。",
    brainRegion: "前扣带皮层（社交疼痛）+ 腹内侧前额叶（群体价值评估）→ 社交排斥 = 身体疼痛",
  },
  {
    id: "grp-2",
    category: "group-identity",
    categoryIndex: 2,
    questionNumber: 8,
    scenario: "你在部落中发现了一种更好的取火方法，但长老说“我们一直用老方法，不要改变”。你会？",
    atmosphere: "🔥 篝火旁，长老的面孔在火光中显得威严而不可挑战……",
    options: [
      { id: "a", label: "听长老的话——反抗权威=被排挤=死亡", isInstinctual: true },
      { id: "b", label: "偷偷尝试新方法——如果更好，大家会接受的", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "挑战群体权威在原始部落中的代价可能是被驱逐。而“我们一直这么做”在变化缓慢的原始环境中，通常确实是安全的——传统是经过千百年试错筛选出来的生存方案，而创新大多数时候是致命的。",
    modernTrap: "“大家都这么想”变成了信息茧房的基石。算法给你推送“和你观点一致”的内容，你的社交圈全是“和你一样”的人。你不再被驱逐，但你的思想被囚禁了——你越来越确信自己是对的，因为“周围所有人都同意”。",
    modernExample: "在信息茧房里，你看到100条和你观点一致的内容，就以为“全世界都这么想”。但在茧房外面，可能90%的人持有完全不同的观点。你以为的自由意志，只是算法喂给你的“部落共识”。",
    brainRegion: "腹内侧前额叶（社会规范内化）+ 杏仁核（违反规范的恐惧）→ 从众的神经基础",
  },
  {
    id: "grp-3",
    category: "group-identity",
    categoryIndex: 2,
    questionNumber: 9,
    scenario: "邻近部落和你所在的部落发生了冲突，首领说“所有人必须参战，不参战就是叛徒”。你会？",
    atmosphere: "⚔️ 战鼓声声，部落的人们举起了武器，空气中弥漫着紧张……",
    options: [
      { id: "a", label: "参战！我必须和我的群体站在一起", isInstinctual: true },
      { id: "b", label: "逃离——打架太危险了，保命要紧", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "群体防御是原始人生存的核心。在部落冲突中，逃跑意味着失去庇护，即使你逃过了这次战斗，没有部落的你很快也会被其他部落吞并。“和群体站在一起”不是勇敢，是唯一的生存选项。",
    modernTrap: "这就是群体极化、网络暴民、饭圈文化的神经基础。当“我们vs他们”的框架被激活时，你的大脑会自动关闭理性思考，全力配合群体行动。键盘侠不是因为天生暴力，而是因为他们的大脑认为“和群体一致=安全”。",
    modernExample: "网上骂战时你的愤怒，和原始部落参战前的肾上腺素飙升，激活的是同一套交感神经系统。区别是：原始人打仗是为了活命，你吵架只是被流量经济当枪使。",
    brainRegion: "杏仁核（敌我识别）+ 前额叶抑制 → 群体框架下理性思考被关闭",
  },
  {
    id: "dng-1",
    category: "danger-sensitivity",
    categoryIndex: 3,
    questionNumber: 10,
    scenario: "你在丛林中听到灌木丛里传来沙沙声。可能是风，也可能是猛兽。你的第一反应是？",
    atmosphere: "🍃 四周突然安静下来，灌木丛在无风中晃动……",
    options: [
      { id: "a", label: "立刻逃跑或准备战斗！万一是猛兽就完了", isInstinctual: true },
      { id: "b", label: "先观察——大部分时候只是风或小动物", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "“烟雾报警器原则”——误报的代价是跑了几步白跑，漏报的代价是丢掉性命。在原始时代，对危险信号过度敏感的人活下来的概率远高于“冷静分析”的人。你不是胆小，你是被自然选择筛选出来的“谨慎基因”携带者。",
    modernTrap: "你的杏仁核依然用“宁可信其有”的逻辑处理信息——但现代的“沙沙声”是焦虑推送、是恐怖新闻、是末日预言。每天刷到的负面新闻让你的大脑持续处于“战斗或逃跑”状态，皮质醇水平长期升高，免疫系统被抑制，睡眠被破坏。",
    modernExample: "晚上11点你刷到一条“XX致癌”的新闻，瞬间心跳加速、睡不着觉。这就是你的杏仁核在对着手机屏幕“战斗或逃跑”——但屏幕那头不是猛兽，是标题党。你的皮质醇却真实地升高了。",
    brainRegion: "杏仁核（威胁检测）→ 下丘脑→交感神经→皮质醇释放：50ms内完成",
  },
  {
    id: "dng-2",
    category: "danger-sensitivity",
    categoryIndex: 3,
    questionNumber: 11,
    scenario: "你听说隔壁山谷有人被毒蛇咬死了。虽然你很少去那个山谷，你会？",
    atmosphere: "🐍 部落里的人都在议论这件事，有人绘声绘色地描述惨状……",
    options: [
      { id: "a", label: "记住这件事！整个山谷都是危险区域", isInstinctual: true },
      { id: "b", label: "理性分析——毒蛇咬人概率极低，不必过度恐慌", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "一条负面信息的生存价值远超十条正面信息。“隔壁山谷有蛇”比“隔壁山谷有美景”重要100倍——记住美景不会救你的命，记住蛇会。这种“负面偏见”（Negativity Bias）是进化赋予的最强学习机制。",
    modernTrap: "媒体和社交平台深谙此道——负面新闻的点击率是正面新闻的3倍。你的时间线上充斥着灾难、犯罪、危机，不是因为这世界越来越糟，而是因为你的大脑只会为负面信息买单。“不看新闻怕错过什么”的焦虑感，和原始人“不看清楚草丛怕漏掉猛兽”完全一样。",
    modernExample: "你花2小时看负面新闻后的焦虑感，和原始人听说隔壁山谷有蛇后的警觉，激活的是同一块杏仁核。区别是：蛇确实会咬人，但新闻里的“致癌”“崩盘”“危机”90%不会发生在你身上。",
    brainRegion: "杏仁核（负面偏见）+ 海马体（恐惧记忆强化）→ 负面记忆比正面记忆牢固3倍",
  },
  {
    id: "dng-3",
    category: "danger-sensitivity",
    categoryIndex: 3,
    questionNumber: 12,
    scenario: "夜里你在洞穴外看到远处有微弱的火光，你不确定是友是敌。你会？",
    atmosphere: "🌙 漆黑的夜色中，远处那点火光明灭不定，像眼睛一样盯着你……",
    options: [
      { id: "a", label: "立刻回洞穴！不明信号=潜在威胁", isInstinctual: true },
      { id: "b", label: "走近看看——也许是友好部落的信号火", isInstinctual: false },
    ],
    instinctOptionId: "a",
    primitiveReason: "深夜的不明信号，80%的概率是危险的。友好的部落不会在半夜打信号——那更可能是敌对部落的侦察。在信息不完整时，“假设最坏”是最安全的策略。",
    modernTrap: "这就是广泛性焦虑症的进化根源。你的大脑在不确定时自动假设最坏的结果：没回消息=讨厌我、胸口微痛=心脏出了问题、老板叫我=要开除我。这些“自动灾难化思维”在原始时代是保命的，但在现代社会只是让你失眠、内耗、生活在恐惧中。",
    modernExample: "焦虑症患者的杏仁核比正常人大3%，不是因为有病，而是因为太擅长检测危险。在原始时代这是优势基因，在现代社会它是你睡前3小时反复回想白天说错的那句话的原因。",
    brainRegion: "杏仁核（威胁放大）+ 前额叶（理性抑制减弱）→ 焦虑的神经基础",
  },
];

const ALL_PRIMITIVE_CATEGORIES: PrimitiveCategoryType[] = [
  "calorie-craving",
  "instant-reward",
  "group-identity",
  "danger-sensitivity",
];

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
  const [gameMode, setGameMode] = useState<GameMode>("cognitive-bias");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [answeredPrimitiveQuestions, setAnsweredPrimitiveQuestions] = useState<AnsweredPrimitiveQuestion[]>([]);

  const [completed, setCompleted] = useState(false);

  const [selectedStoryId, setSelectedStoryId] = useState<StoryId | null>(null);
  const [storyPhase, setStoryPhase] = useState<StoryPhase>("intro");
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedStoryChoice, setSelectedStoryChoice] = useState<string | null>(null);
  const [showStoryReflection, setShowStoryReflection] = useState(false);
  const [answeredStoryQuestions, setAnsweredStoryQuestions] = useState<AnsweredStoryQuestion[]>([]);

  const subList = subExperiments ?? [];

  const isPrimitive = gameMode === "primitive-era";
  const isStory = gameMode === "story-mode";
  const activeQuestions = isPrimitive ? PRIMITIVE_QUESTIONS : QUESTIONS;
  const activeTotalQuestions = activeQuestions.length;

  const currentStory = selectedStoryId ? STORIES[selectedStoryId] : null;
  const currentScene = currentStory ? currentStory.scenes[currentSceneIndex] : null;
  const totalStoryScenes = currentStory ? currentStory.scenes.length : 0;
  const storyProgress = currentStory
    ? Math.min(
        Math.floor(
          ((currentSceneIndex + (showStoryReflection ? 1 : 0)) /
            totalStoryScenes) *
            100
        ),
        100
      )
    : 0;

  const currentQuestion = !isPrimitive ? QUESTIONS[currentQuestionIdx] : null;
  const currentPQuestion = isPrimitive ? PRIMITIVE_QUESTIONS[currentQuestionIdx] : null;

  const totalQuestions = activeTotalQuestions;
  const progress = Math.min(
    Math.floor(((currentQuestionIdx + (showExplanation ? 1 : 0)) / totalQuestions) * 100),
    100
  );

  const currentCategory = currentQuestion?.category;
  const currentCategoryMeta = currentCategory ? CATEGORY_META[currentCategory] : null;

  const currentPCategory = currentPQuestion?.category;
  const currentPCategoryMeta = currentPCategory ? PRIMITIVE_CATEGORY_META[currentPCategory] : null;

  const categoryIdxMap = useMemo(() => {
    const map: Record<CategoryType, number> = {
      "fake-news": 0,
      "visual-mislead": 1,
      "probability-illusion": 2,
      "risk-judgment": 3,
    };
    return map;
  }, []);

  const primitiveCategoryIdxMap = useMemo(() => {
    const map: Record<PrimitiveCategoryType, number> = {
      "calorie-craving": 0,
      "instant-reward": 1,
      "group-identity": 2,
      "danger-sensitivity": 3,
    };
    return map;
  }, []);

  const currentSubIndex = currentQuestion
    ? categoryIdxMap[currentQuestion.category]
    : currentPQuestion
    ? primitiveCategoryIdxMap[currentPQuestion.category]
    : 0;

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setPhase("playing");
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnsweredQuestions([]);
    setAnsweredPrimitiveQuestions([]);
    setCompleted(false);
  };

  const selectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedOption(optionId);
  };

  const confirmAnswer = () => {
    if (!selectedOption) return;

    if (isPrimitive && currentPQuestion) {
      const selectedOpt = currentPQuestion.options.find((o) => o.id === selectedOption);
      const followedInstinct = selectedOpt?.isInstinctual ?? false;

      setAnsweredPrimitiveQuestions((prev) => [
        ...prev,
        {
          questionId: currentPQuestion.id,
          selectedOptionId: selectedOption,
          followedInstinct,
          category: currentPQuestion.category,
        },
      ]);
    } else if (currentQuestion) {
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
    }

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

  const startStory = (storyId: StoryId) => {
    setSelectedStoryId(storyId);
    setGameMode("story-mode");
    setPhase("playing");
    setStoryPhase("intro");
    setCurrentSceneIndex(0);
    setSelectedStoryChoice(null);
    setShowStoryReflection(false);
    setAnsweredStoryQuestions([]);
    setCompleted(false);
  };

  const startStoryScene = () => {
    setStoryPhase("scene");
  };

  const selectStoryChoice = (choiceId: string) => {
    if (showStoryReflection) return;
    setSelectedStoryChoice(choiceId);
  };

  const confirmStoryChoice = () => {
    if (!selectedStoryChoice || !currentScene || !currentStory) return;

    const selectedChoice = currentScene.choices.find(
      (c) => c.id === selectedStoryChoice
    );
    const isAdaptive = selectedChoice?.isAdaptive ?? false;

    setAnsweredStoryQuestions((prev) => [
      ...prev,
      {
        sceneId: currentScene.id,
        choiceId: selectedStoryChoice,
        isAdaptive,
        storyId: currentStory.id,
      },
    ]);

    setShowStoryReflection(true);
  };

  const nextStoryScene = () => {
    if (currentSceneIndex < totalStoryScenes - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setSelectedStoryChoice(null);
      setShowStoryReflection(false);
    } else {
      setStoryPhase("result");
      setPhase("result");
    }
  };

  const exitStory = () => {
    setPhase("intro");
    setSelectedStoryId(null);
    setGameMode("cognitive-bias");
  };

  const storyStats = useMemo(() => {
    if (!currentStory) return null;

    const totalAdaptive = answeredStoryQuestions.filter(
      (q) => q.isAdaptive
    ).length;
    const totalScenes = answeredStoryQuestions.length;
    const adaptiveRate = totalScenes > 0 ? totalAdaptive / totalScenes : 0;

    return {
      totalAdaptive,
      totalScenes,
      adaptiveRate,
    };
  }, [answeredStoryQuestions, currentStory]);

  const getStoryResultLevel = (rate: number) => {
    if (rate >= 0.75)
      return {
        label: "脑控大师",
        color: "#06ffa5",
        emoji: "🧠",
        description:
          "你完全掌控了自己的大脑。即使在多巴胺被劫持、前额叶超载的状态下，你依然能做出理性决策。你了解大脑的弱点，也知道如何通过环境设计和习惯养成来保护自己。",
      };
    if (rate >= 0.5)
      return {
        label: "觉醒者",
        color: "#00d4ff",
        emoji: "💡",
        description:
          "你已经开始觉醒。你知道大脑的神经机制在影响你的决策，也能在关键时刻调用理性。但你仍然会被原始本能和多巴胺劫持——这不是你的错，这是所有人类的共同弱点。继续练习，你会越来越强。",
      };
    if (rate >= 0.25)
      return {
        label: "梦游者",
        color: "#ffbe0b",
        emoji: "😴",
        description:
          "你大多数时候处于'自动导航'状态。你的大脑被原始本能和外部算法（短视频、广告、社交媒体）操控着，你以为是'自己的决定'，其实只是神经回路的条件反射。但好消息是：你已经开始看到这一切了——看见就是改变的开始。",
      };
    return {
      label: "被劫持者",
      color: "#e63946",
      emoji: "🫧",
      description:
        "你的大脑几乎完全被劫持了。多巴胺系统和原始本能替你做了所有重要决定。你刷手机刷到凌晨、买不需要的东西、吃垃圾食品、熬夜——你知道这些对你不好，但你'控制不住自己'。但请不要自责：这不是意志力问题，是神经科学问题。了解这些机制，是夺回控制权的第一步。",
    };
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

  const primitiveCategoryStats = useMemo(() => {
    const stats = ALL_PRIMITIVE_CATEGORIES.reduce(
      (acc, c) => {
        acc[c] = { total: 0, followed: 0 };
        return acc;
      },
      {} as Record<PrimitiveCategoryType, { total: number; followed: number }>
    );
    answeredPrimitiveQuestions.forEach((aq) => {
      stats[aq.category].total += 1;
      if (aq.followedInstinct) {
        stats[aq.category].followed += 1;
      }
    });
    return stats;
  }, [answeredPrimitiveQuestions]);

  const totalFollowedInstinct = answeredPrimitiveQuestions.filter((a) => a.followedInstinct).length;
  const instinctRate = answeredPrimitiveQuestions.length > 0 ? totalFollowedInstinct / answeredPrimitiveQuestions.length : 0;

  const getInstinctLevel = (rate: number) => {
    if (rate >= 0.75) return { label: "纯粹原始脑", color: "#e63946", emoji: "🦖" };
    if (rate >= 0.5) return { label: "原始本能活跃", color: "#fb5607", emoji: "🔥" };
    if (rate >= 0.25) return { label: "理性有所觉醒", color: "#ffbe0b", emoji: "🧠" };
    return { label: "高度理性超越", color: "#06ffa5", emoji: "🛡️" };
  };

  const primitiveOverallStatus = getInstinctLevel(instinctRate);

  const getTopPrimitiveCategories = (count: number = 4) => {
    return ALL_PRIMITIVE_CATEGORIES
      .filter((c) => primitiveCategoryStats[c].total > 0)
      .map((c) => ({
        category: c,
        rate: primitiveCategoryStats[c].total > 0 ? primitiveCategoryStats[c].followed / primitiveCategoryStats[c].total : 0,
        total: primitiveCategoryStats[c].total,
        followed: primitiveCategoryStats[c].followed,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, count);
  };

  const getPrimitiveAnalysis = () => {
    const top = getTopPrimitiveCategories(2);
    if (instinctRate >= 0.75) {
      return {
        title: "你的大脑是一台完美的原始生存机器",
        description: `你跟随本能的比例高达${Math.round(instinctRate * 100)}%——这不是坏事，这意味着你的神经系统经过了数百万年的完美调校。在原始时代，你就是那个最可能活下来的人。你最强烈的本能是${top.map((t) => PRIMITIVE_CATEGORY_META[t.category].label).join("和")}。但在现代社会，这些让你"活下来"的本能正在被短视频、消费主义和焦虑经济精准利用——你越"适应原始环境"，就越容易被现代陷阱捕获。`,
      };
    }
    if (instinctRate >= 0.5) {
      return {
        title: "你的原始本能依然强大",
        description: `你在一半以上的场景中跟随了本能，这是完全正常的人类表现。你最突出的本能是${top.map((t) => PRIMITIVE_CATEGORY_META[t.category].label).join("和")}。好消息是，你偶尔能让理性系统"接管"决策；坏消息是，当你疲惫、饥饿、情绪激动时，原始本能会100%接管——而现代社会正是利用你最脆弱的时刻来"劫持"你。`,
      };
    }
    if (instinctRate >= 0.25) {
      return {
        title: "你的理性系统相当活跃",
        description: `你在大多数场景中克服了原始本能，说明你的前额叶皮层（理性中枢）相当勤奋。但请注意：原始本能不是"坏"的——它们是数百万年进化的结晶，在原始时代它们就是"最优解"。你超越本能的能力在现代社会是优势，但也要警惕"理性疲劳"——持续抵制本能会消耗认知资源，最终导致"自我损耗"式的崩溃。`,
      };
    }
    return {
      title: "你的理性几乎完全超越了原始本能",
      description: `你极少跟随原始本能，这在社会中是极大的优势。但请记住：原始本能之所以存在，是因为它们在数百万年中都是"正确答案"。你之所以能超越本能，是因为你的前额叶皮层极其发达——但这也意味着你的大脑消耗了更多能量，更容易疲劳。适当地"顺从本能"（比如享受美食、和朋友社交）其实是对大脑的充电。`,
    };
  };

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
            <p className="text-museum-200/80 mb-8 leading-relaxed">
              选择一种模式，探索你的大脑决策方式
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <button
                onClick={() => startGame("cognitive-bias")}
                className="p-6 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                style={{
                  background: "linear-gradient(135deg, rgba(230, 57, 70, 0.12), rgba(157, 78, 221, 0.08))",
                  border: "1px solid rgba(230, 57, 70, 0.3)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(230, 57, 70, 0.25), rgba(157, 78, 221, 0.2))",
                  }}
                >
                  <Shield className="w-7 h-7" style={{ color: "#e63946" }} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">认知漏洞测试</h4>
                <p className="text-sm text-museum-200/70 mb-4 leading-relaxed">
                  面对 <span className="font-bold" style={{ color: "#ff006e" }}>16道</span> 精心设计的"陷阱题"，
                  涵盖假新闻判断、视觉误导、概率错觉、风险判断
                </p>
                <div className="flex items-center gap-2 text-xs text-museum-300/50">
                  <span>4类骗局 · 12种认知偏差 · 专属热力图</span>
                </div>
              </button>

              <button
                onClick={() => startGame("primitive-era")}
                className="p-6 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                style={{
                  background: "linear-gradient(135deg, rgba(251, 86, 7, 0.12), rgba(114, 9, 183, 0.08))",
                  border: "1px solid rgba(251, 86, 7, 0.3)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(251, 86, 7, 0.25), rgba(114, 9, 183, 0.2))",
                  }}
                >
                  <TreePine className="w-7 h-7" style={{ color: "#fb5607" }} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  🦖 如果你生活在原始时代
                </h4>
                <p className="text-sm text-museum-200/70 mb-4 leading-relaxed">
                  回到 <span className="font-bold" style={{ color: "#fb5607" }}>200万年前</span>，
                  在生存决策中体验为什么人脑偏爱高热量、即时奖励、群体认同、危险信息
                </p>
                <div className="flex items-center gap-2 text-xs text-museum-300/50">
                  <span>4类本能 · 12道生存抉择 · 进化错位报告</span>
                </div>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: "#f72585" }} />
                剧情式学习 · 沉浸式体验
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => startStory("overloaded-office-worker")}
                  className="p-6 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                  style={{
                    background: "linear-gradient(135deg, rgba(58, 134, 255, 0.12), rgba(247, 37, 133, 0.08))",
                    border: "1px solid rgba(58, 134, 255, 0.3)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(58, 134, 255, 0.25), rgba(247, 37, 133, 0.2))",
                    }}
                  >
                    <Brain className="w-7 h-7" style={{ color: "#3a86ff" }} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    💼 前额叶超载的上班族
                  </h4>
                  <p className="text-sm text-museum-200/70 mb-4 leading-relaxed">
                    你今天穿越成一位<span className="font-bold" style={{ color: "#3a86ff" }}>前额叶工作超载</span>的上班族。
                    在加班、低血糖、社会比较、认知疲劳中，体验大脑如何影响你的每一个决策。
                  </p>
                  <div className="flex items-center gap-2 text-xs text-museum-300/50">
                    <span>4个关键场景 · 神经科学实时解读</span>
                  </div>
                </button>

                <button
                  onClick={() => startStory("reward-addicted-scroller")}
                  className="p-6 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                  style={{
                    background: "linear-gradient(135deg, rgba(247, 37, 133, 0.12), rgba(114, 9, 183, 0.08))",
                    border: "1px solid rgba(247, 37, 133, 0.3)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(247, 37, 133, 0.25), rgba(114, 9, 183, 0.2))",
                    }}
                  >
                    <Zap className="w-7 h-7" style={{ color: "#f72585" }} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    📱 短视频成瘾的24小时
                  </h4>
                  <p className="text-sm text-museum-200/70 mb-4 leading-relaxed">
                    你是一位<span className="font-bold" style={{ color: "#f72585" }}>奖励系统异常活跃</span>的短视频用户。
                    在起床、开会、学习、深夜emo中，体验多巴胺如何被算法精准劫持。
                  </p>
                  <div className="flex items-center gap-2 text-xs text-museum-300/50">
                    <span>4个关键场景 · 多巴胺机制深度解析</span>
                  </div>
                </button>
              </div>
            </div>

            <div
              className="p-4 rounded-xl mb-6 max-w-2xl mx-auto text-left"
              style={{
                background: "rgba(251, 86, 7, 0.06)",
                border: "1px solid rgba(251, 86, 7, 0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5" style={{ color: "#fb5607" }} />
                <span className="text-sm font-bold text-white">原始时代模式是什么？</span>
              </div>
              <p className="text-sm text-museum-200/70 leading-relaxed">
                你将扮演一个生活在200万年前的原始人，面对真实的生存抉择。你的每个选择背后都有一个经过数百万年进化的神经回路——它们在原始时代是"最优解"，但在现代社会却被短视频、消费主义和焦虑经济精准利用。完成12道生存抉择后，你将获得一份"进化错位报告"，揭示你的哪些原始本能正在被现代世界"劫持"。
              </p>
            </div>
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

        {phase === "playing" && isPrimitive && currentPQuestion && currentPCategoryMeta && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setPhase("intro"); setCurrentQuestionIdx(0); setSelectedOption(null); setShowExplanation(false); }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <ArrowLeft className="w-5 h-5 text-museum-300/60" />
                </button>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${currentPCategoryMeta.color}20`,
                    border: `1px solid ${currentPCategoryMeta.color}40`,
                  }}
                >
                  <span className="text-2xl">{currentPCategoryMeta.emoji}</span>
                </div>
                <div>
                  <p className="text-xs text-museum-300/60 mb-0.5">
                    第 {currentPQuestion.questionNumber} / {totalQuestions} 抉择
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: currentPCategoryMeta.color }}
                  >
                    {currentPCategoryMeta.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-museum-300/50">跟随本能</span>
                <span
                  className="font-bold text-lg"
                  style={{ color: totalFollowedInstinct > 0 ? "#fb5607" : "#06ffa5" }}
                >
                  {totalFollowedInstinct}
                </span>
                <span className="text-museum-300/50">次</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-museum-800 rounded-full overflow-hidden mb-8">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${currentPCategoryMeta.color}, #7209b7)`,
                }}
              />
            </div>

            <div
              className="p-4 rounded-xl mb-6"
              style={{
                background: `${currentPCategoryMeta.color}08`,
                border: `1px solid ${currentPCategoryMeta.color}20`,
              }}
            >
              <p className="text-sm italic text-museum-200/60 leading-relaxed">
                {currentPQuestion.atmosphere}
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {currentPQuestion.scenario}
              </h4>
            </div>

            {!showExplanation ? (
              <div>
                <div className="space-y-3 mb-8">
                  {currentPQuestion.options.map((opt) => {
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
                            ? `linear-gradient(135deg, ${currentPCategoryMeta.color}30, ${currentPCategoryMeta.color}15)`
                            : "rgba(255, 255, 255, 0.04)",
                          border: isSelected
                            ? `2px solid ${currentPCategoryMeta.color}`
                            : "1px solid rgba(255, 255, 255, 0.12)",
                          boxShadow: isSelected
                            ? `0 0 25px ${currentPCategoryMeta.color}40`
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
                                ? `linear-gradient(135deg, ${currentPCategoryMeta.color}, ${currentPCategoryMeta.color}cc)`
                                : "rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            {String.fromCharCode(65 + currentPQuestion.options.findIndex((o) => o.id === opt.id))}
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
                    做出抉择
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                {(() => {
                  const selectedOpt = currentPQuestion.options.find(
                    (o) => o.id === selectedOption
                  );
                  const followedInstinct = selectedOpt?.isInstinctual ?? false;
                  const catMeta = PRIMITIVE_CATEGORY_META[currentPQuestion.category];

                  return (
                    <div>
                      <div
                        className="p-6 rounded-2xl mb-6"
                        style={{
                          background: followedInstinct
                            ? `linear-gradient(135deg, ${catMeta.color}18, ${catMeta.color}08)`
                            : "linear-gradient(135deg, rgba(6, 255, 165, 0.15), rgba(0, 212, 255, 0.08))",
                          border: followedInstinct
                            ? `1px solid ${catMeta.color}50`
                            : "1px solid rgba(6, 255, 165, 0.4)",
                          boxShadow: followedInstinct
                            ? `0 0 30px ${catMeta.color}25`
                            : "0 0 30px rgba(6, 255, 165, 0.15)",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {followedInstinct ? (
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ background: `${catMeta.color}30` }}
                            >
                              <Flame className="w-6 h-6" style={{ color: catMeta.color }} />
                            </div>
                          ) : (
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ background: "rgba(6, 255, 165, 0.3)" }}
                            >
                              <Brain className="w-6 h-6 text-neon-green" />
                            </div>
                          )}
                          <div>
                            <p
                              className="text-xl font-bold"
                              style={{
                                color: followedInstinct ? catMeta.color : "#06ffa5",
                              }}
                            >
                              {followedInstinct ? "🦠 你跟随了原始本能！" : "🧠 你超越了原始本能！"}
                            </p>
                            <p className="text-sm text-museum-200/70">
                              {followedInstinct
                                ? "这个选择在原始时代是正确的——你的神经系统经过数百万年调校"
                                : "你用理性压制了进化本能——这在原始时代很危险，但在现代是优势"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-museum-300/50">你的选择：</span>
                            <span className={followedInstinct ? "ml-1" : "text-neon-green ml-1"} style={followedInstinct ? { color: catMeta.color } : undefined}>
                              {String.fromCharCode(65 + currentPQuestion.options.findIndex((o) => o.id === selectedOption))}. {selectedOpt?.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="p-6 rounded-2xl mb-4"
                        style={{
                          background: "rgba(6, 255, 165, 0.06)",
                          border: "1px solid rgba(6, 255, 165, 0.25)",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(6, 255, 165, 0.15)" }}
                          >
                            <TreePine className="w-5 h-5 text-neon-green" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neon-green">
                              🌿 原始时代：这个本能为什么存在？
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-museum-200/85 leading-relaxed">
                          {currentPQuestion.primitiveReason}
                        </p>
                      </div>

                      <div
                        className="p-6 rounded-2xl mb-4"
                        style={{
                          background: "rgba(230, 57, 70, 0.06)",
                          border: "1px solid rgba(230, 57, 70, 0.25)",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(230, 57, 70, 0.15)" }}
                          >
                            <AlertTriangle className="w-5 h-5" style={{ color: "#e63946" }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: "#e63946" }}>
                              🏙️ 现代陷阱：这个本能如何被利用？
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-museum-200/85 leading-relaxed">
                          {currentPQuestion.modernTrap}
                        </p>
                      </div>

                      <div
                        className="p-4 rounded-xl mb-6"
                        style={{
                          background: `${catMeta.color}08`,
                          border: `1px solid ${catMeta.color}20`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4" style={{ color: catMeta.color }} />
                          <span className="text-xs font-bold" style={{ color: catMeta.color }}>
                            现实案例
                          </span>
                        </div>
                        <p className="text-sm text-museum-200/80 leading-relaxed">
                          {currentPQuestion.modernExample}
                        </p>
                        <p className="text-xs text-museum-300/50 mt-2">
                          🧠 {currentPQuestion.brainRegion}
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <button onClick={nextQuestion} className="btn-primary">
                          {currentQuestionIdx < totalQuestions - 1 ? "下一个抉择" : "查看进化错位报告"}
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

        {phase === "playing" && isStory && currentStory && (
          <div className="animate-fade-in">
            {storyPhase === "intro" && (
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${currentStory.color}30, ${currentStory.color}15)`,
                    boxShadow: `0 0 40px ${currentStory.color}40`,
                  }}
                >
                  <span className="text-4xl">{currentStory.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {currentStory.title}
                </h3>
                <p className="text-museum-200/70 mb-6 max-w-xl mx-auto">
                  {currentStory.subtitle}
                </p>

                <div
                  className="p-6 rounded-2xl mb-8 max-w-xl mx-auto text-left"
                  style={{
                    background: `${currentStory.color}10`,
                    border: `1px solid ${currentStory.color}30`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${currentStory.color}20` }}
                    >
                      <Brain className="w-5 h-5" style={{ color: currentStory.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: currentStory.color }}>
                        🧪 你今天的脑状态
                      </p>
                      <p className="text-xs text-museum-300/50">
                        {currentStory.brainCondition}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-museum-200/80 leading-relaxed">
                    {currentStory.brainConditionDescription}
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl mb-8 max-w-xl mx-auto text-left"
                  style={{
                    background: "rgba(251, 86, 7, 0.06)",
                    border: "1px solid rgba(251, 86, 7, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: "#fb5607" }} />
                    <span className="text-sm font-bold text-white">
                      剧情提示
                    </span>
                  </div>
                  <p className="text-sm text-museum-200/70 leading-relaxed">
                    你将经历 <span className="font-bold" style={{ color: "#fb5607" }}>{totalStoryScenes}个</span> 关键场景。
                    在每个场景中，你需要做出选择。每次选择后，你会看到：
                    <span className="font-bold text-white"> 剧情后果</span>、
                    <span className="font-bold text-white"> 脑科学解读</span>、
                    以及<span className="font-bold text-white"> 神经机制分析</span>。
                    请试着<span className="font-bold text-white">代入角色</span>，
                    感受在这种脑状态下，你会如何做决策。
                  </p>
                </div>

                <button onClick={startStoryScene} className="btn-primary">
                  进入剧情
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {storyPhase === "scene" && currentScene && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={exitStory}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <ArrowLeft className="w-5 h-5 text-museum-300/60" />
                    </button>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${currentStory.color}20`,
                        border: `1px solid ${currentStory.color}40`,
                      }}
                    >
                      <span className="text-2xl">{currentStory.emoji}</span>
                    </div>
                    <div>
                      <p className="text-xs text-museum-300/60 mb-0.5">
                        场景 {currentScene.sceneNumber} / {totalStoryScenes}
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: currentStory.color }}
                      >
                        {currentScene.setting}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-museum-300/50">理性决策</span>
                    <span
                      className="font-bold text-lg"
                      style={{
                        color:
                          answeredStoryQuestions.filter((q) => q.isAdaptive)
                            .length > 0
                            ? "#06ffa5"
                            : "#e63946",
                      }}
                    >
                      {
                        answeredStoryQuestions.filter((q) => q.isAdaptive)
                          .length
                      }
                    </span>
                    <span className="text-museum-300/50">次</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-museum-800 rounded-full overflow-hidden mb-8">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${storyProgress}%`,
                      background: `linear-gradient(90deg, ${currentStory.color}, #7209b7)`,
                    }}
                  />
                </div>

                <div
                  className="p-4 rounded-xl mb-6"
                  style={{
                    background: `${currentStory.color}08`,
                    border: `1px solid ${currentStory.color}20`,
                  }}
                >
                  <p className="text-sm italic text-museum-200/60 leading-relaxed">
                    {currentScene.atmosphere}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg md:text-xl font-bold text-white leading-relaxed mb-4">
                    {currentScene.narrative}
                  </h4>
                </div>

                <div
                  className="p-4 rounded-xl mb-8"
                  style={{
                    background: "rgba(58, 134, 255, 0.06)",
                    border: "1px solid rgba(58, 134, 255, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4" style={{ color: "#3a86ff" }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#3a86ff" }}
                    >
                      🔬 此刻你的大脑
                    </span>
                  </div>
                  <p className="text-sm text-museum-200/80 leading-relaxed mb-2">
                    {currentScene.brainState}
                  </p>
                  <p className="text-xs text-museum-300/50">
                    🧠 {currentScene.brainRegion}
                  </p>
                </div>

                {!showStoryReflection ? (
                  <div>
                    <div className="space-y-3 mb-8">
                      {currentScene.choices.map((opt, idx) => {
                        const isSelected = selectedStoryChoice === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => selectStoryChoice(opt.id)}
                            className={`w-full p-5 rounded-2xl text-left transition-all ${
                              isSelected
                                ? "scale-[1.01]"
                                : "hover:scale-[1.005]"
                            }`}
                            style={{
                              background: isSelected
                                ? `linear-gradient(135deg, ${currentStory.color}30, ${currentStory.color}15)`
                                : "rgba(255, 255, 255, 0.04)",
                              border: isSelected
                                ? `2px solid ${currentStory.color}`
                                : "1px solid rgba(255, 255, 255, 0.12)",
                              boxShadow: isSelected
                                ? `0 0 25px ${currentStory.color}40`
                                : "none",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                                  isSelected
                                    ? "text-white"
                                    : "text-museum-300/60"
                                }`}
                                style={{
                                  background: isSelected
                                    ? `linear-gradient(135deg, ${currentStory.color}, ${currentStory.color}cc)`
                                    : "rgba(255, 255, 255, 0.08)",
                                }}
                              >
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <p
                                className={`text-sm md:text-base leading-relaxed ${
                                  isSelected
                                    ? "text-white font-medium"
                                    : "text-museum-200/85"
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
                        onClick={confirmStoryChoice}
                        disabled={!selectedStoryChoice}
                        className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        做出选择
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    {(() => {
                      const selectedChoice = currentScene.choices.find(
                        (c) => c.id === selectedStoryChoice
                      );
                      const isAdaptive = selectedChoice?.isAdaptive ?? false;

                      return (
                        <div>
                          <div
                            className="p-6 rounded-2xl mb-6"
                            style={{
                              background: isAdaptive
                                ? "linear-gradient(135deg, rgba(6, 255, 165, 0.15), rgba(0, 212, 255, 0.08))"
                                : `linear-gradient(135deg, ${currentStory.color}18, ${currentStory.color}08)`,
                              border: isAdaptive
                                ? "1px solid rgba(6, 255, 165, 0.4)"
                                : `1px solid ${currentStory.color}50`,
                              boxShadow: isAdaptive
                                ? "0 0 30px rgba(6, 255, 165, 0.15)"
                                : `0 0 30px ${currentStory.color}25`,
                            }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              {isAdaptive ? (
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{ background: "rgba(6, 255, 165, 0.3)" }}
                                >
                                  <Brain className="w-6 h-6 text-neon-green" />
                                </div>
                              ) : (
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{ background: `${currentStory.color}30` }}
                                >
                                  <Zap
                                    className="w-6 h-6"
                                    style={{ color: currentStory.color }}
                                  />
                                </div>
                              )}
                              <div>
                                <p
                                  className="text-xl font-bold"
                                  style={{
                                    color: isAdaptive ? "#06ffa5" : currentStory.color,
                                  }}
                                >
                                  {isAdaptive
                                    ? "🧠 你做出了理性决策！"
                                    : "⚡ 大脑自动导航模式"}
                                </p>
                                <p className="text-sm text-museum-200/70">
                                  {isAdaptive
                                    ? "你成功调用了前额叶，压制了原始本能和多巴胺冲动"
                                    : "你的大脑被神经回路自动接管了——这不是你的错，是神经科学"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="text-museum-300/50">你的选择：</span>
                                <span
                                  className={
                                    isAdaptive
                                      ? "text-neon-green ml-1"
                                      : "ml-1"
                                  }
                                  style={
                                    !isAdaptive
                                      ? { color: currentStory.color }
                                      : undefined
                                  }
                                >
                                  {String.fromCharCode(
                                    65 +
                                      currentScene.choices.findIndex(
                                        (o) => o.id === selectedStoryChoice
                                      )
                                  )}
                                  . {selectedChoice?.label}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="p-6 rounded-2xl mb-4"
                            style={{
                              background: "rgba(251, 86, 7, 0.06)",
                              border: "1px solid rgba(251, 86, 7, 0.25)",
                            }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: "rgba(251, 86, 7, 0.15)" }}
                              >
                                <Sparkles
                                  className="w-5 h-5"
                                  style={{ color: "#fb5607" }}
                                />
                              </div>
                              <div>
                                <p
                                  className="text-sm font-bold"
                                  style={{ color: "#fb5607" }}
                                >
                                  📖 剧情后果
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-museum-200/85 leading-relaxed">
                              {selectedChoice?.consequence}
                            </p>
                          </div>

                          <div
                            className="p-6 rounded-2xl mb-4"
                            style={{
                              background: "rgba(58, 134, 255, 0.06)",
                              border: "1px solid rgba(58, 134, 255, 0.25)",
                            }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: "rgba(58, 134, 255, 0.15)" }}
                              >
                                <Brain
                                  className="w-5 h-5"
                                  style={{ color: "#3a86ff" }}
                                />
                              </div>
                              <div>
                                <p
                                  className="text-sm font-bold"
                                  style={{ color: "#3a86ff" }}
                                >
                                  🔬 脑科学解读
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-museum-200/85 leading-relaxed">
                              {selectedChoice?.brainEffect}
                            </p>
                          </div>

                          <div className="flex justify-center">
                            <button onClick={nextStoryScene} className="btn-primary">
                              {currentSceneIndex < totalStoryScenes - 1
                                ? "下一个场景"
                                : "查看你的脑状态报告"}
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
          </div>
        )}

        {phase === "result" && isStory && currentStory && storyStats && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              {(() => {
                const resultLevel = getStoryResultLevel(storyStats.adaptiveRate);
                return (
                  <>
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                      style={{
                        background: `linear-gradient(135deg, ${resultLevel.color}30, ${currentStory.color}20)`,
                        boxShadow: `0 0 40px ${resultLevel.color}40`,
                      }}
                    >
                      <span className="text-4xl">{resultLevel.emoji}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {currentStory.title} · 完结
                    </h3>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div
                        className="px-4 py-1.5 rounded-full text-sm font-bold"
                        style={{
                          background: `${resultLevel.color}18`,
                          color: resultLevel.color,
                          border: `1px solid ${resultLevel.color}40`,
                        }}
                      >
                        你的评级：{resultLevel.label}
                      </div>
                    </div>
                    <p className="text-museum-200/70 max-w-2xl mx-auto">
                      你做出了{" "}
                      <span
                        className="font-bold"
                        style={{ color: "#06ffa5" }}
                      >
                        {storyStats.totalAdaptive}
                      </span>{" "}
                      次理性决策，
                      理性决策率{" "}
                      <span
                        className="font-bold"
                        style={{ color: resultLevel.color }}
                      >
                        {Math.round(storyStats.adaptiveRate * 100)}%
                      </span>
                    </p>
                  </>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
              {currentStory.scenes.map((scene, idx) => {
                const answered = answeredStoryQuestions.find(
                  (q) => q.sceneId === scene.id
                );
                const isAdaptive = answered?.isAdaptive ?? false;

                return (
                  <div
                    key={scene.id}
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: isAdaptive
                        ? "rgba(6, 255, 165, 0.08)"
                        : "rgba(230, 57, 70, 0.08)",
                      border: isAdaptive
                        ? "1px solid rgba(6, 255, 165, 0.25)"
                        : "1px solid rgba(230, 57, 70, 0.25)",
                    }}
                  >
                    <div className="text-2xl mb-2">
                      {isAdaptive ? "✅" : "⚡"}
                    </div>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: isAdaptive ? "#06ffa5" : "#e63946" }}
                    >
                      {idx + 1}
                    </div>
                    <p className="text-xs text-museum-300/60">
                      场景{idx + 1}
                    </p>
                  </div>
                );
              })}
            </div>

            {(() => {
              const resultLevel = getStoryResultLevel(storyStats.adaptiveRate);
              return (
                <div
                  className="p-6 rounded-2xl max-w-2xl mx-auto mb-8"
                  style={{
                    background: `linear-gradient(135deg, ${currentStory.color}12, ${resultLevel.color}08)`,
                    border: `1px solid ${currentStory.color}30`,
                  }}
                >
                  <h4 className="text-lg font-bold text-white mb-3">
                    {resultLevel.label} · 剧情分析
                  </h4>
                  <p className="text-sm text-museum-200/80 leading-relaxed">
                    {resultLevel.description}
                  </p>
                </div>
              );
            })()}

            <div className="glass-card p-6 md:p-8 mb-8">
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" style={{ color: currentStory.color }} />
                🧪 你在剧情中学到的神经科学
              </h4>
              <p className="text-sm text-museum-300/60 mb-6">
                这些都是你在剧情中亲身经历的神经机制。记住它们，下次在真实生活中遇到类似场景时，你就能识别出大脑在做什么。
              </p>

              <div className="space-y-4">
                {currentStory.neuroscienceLessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl"
                    style={{
                      background: `${currentStory.color}06`,
                      border: `1px solid ${currentStory.color}20`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: `${currentStory.color}20`,
                          color: currentStory.color,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <p className="text-sm text-museum-200/80 leading-relaxed">
                        {lesson}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 mb-8">
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: "#fb5607" }} />
                🎭 你的每一个选择，都在塑造你的大脑
              </h4>
              <p className="text-sm text-museum-200/80 leading-relaxed mb-4">
                神经科学最重要的发现之一是<span className="font-bold text-white">神经可塑性（Neuroplasticity）</span>——
                你的大脑会根据你的经历不断重新布线。
              </p>
              <div className="space-y-3 text-sm text-museum-200/80 leading-relaxed">
                <p>
                  每次你<span className="font-bold" style={{ color: "#06ffa5" }}>抵制了刷手机的冲动</span>，
                  前额叶到伏隔核的抑制性连接就会增强一点；
                </p>
                <p>
                  每次你<span className="font-bold" style={{ color: "#06ffa5" }}>选择了健康餐</span>，
                  眶额叶皮层对健康食物的价值评估权重就会增加一点；
                </p>
                <p>
                  每次你<span className="font-bold" style={{ color: "#06ffa5" }}>真诚地为别人的成功高兴</span>，
                  腹内侧前额叶的共情回路就会强化一点；
                </p>
                <p>
                  每次你<span className="font-bold" style={{ color: "#06ffa5" }}>选择了延迟满足</span>，
                  前额叶对腹侧纹状体的控制力就会增强一点。
                </p>
              </div>
              <p className="text-sm text-museum-200/80 leading-relaxed mt-4">
                <span className="font-bold" style={{ color: "#fb5607" }}>
                  你不是在"对抗你的大脑"——你是在"训练你的大脑"。
                </span>
                每一个小的、正确的选择，都是在给大脑重新布线。日积月累，你会发现：
                以前需要靠意志力硬扛的事情，现在变得自然而然了。
              </p>
            </div>

            <div className="text-center mt-8 flex items-center justify-center gap-4">
              <button
                onClick={exitStory}
                className="btn-secondary gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回选择其他模式
              </button>
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

        {phase === "result" && !isPrimitive && !isStory && (
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

        {phase === "result" && isPrimitive && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                style={{
                  background: `linear-gradient(135deg, ${primitiveOverallStatus.color}30, #7209b720)`,
                  boxShadow: `0 0 40px ${primitiveOverallStatus.color}40`,
                }}
              >
                <span className="text-4xl">{primitiveOverallStatus.emoji}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                进化错位报告
              </h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    background: `${primitiveOverallStatus.color}18`,
                    color: primitiveOverallStatus.color,
                    border: `1px solid ${primitiveOverallStatus.color}40`,
                  }}
                >
                  评级：{primitiveOverallStatus.label}
                </div>
              </div>
              <p className="text-museum-200/70 max-w-2xl mx-auto">
                你跟随了原始本能 <span className="font-bold" style={{ color: "#fb5607" }}>{totalFollowedInstinct}</span> 次，
                本能跟随率 <span className="font-bold" style={{ color: "#fb5607" }}>{Math.round(instinctRate * 100)}%</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
              {ALL_PRIMITIVE_CATEGORIES.map((cat) => {
                const meta = PRIMITIVE_CATEGORY_META[cat];
                const s = primitiveCategoryStats[cat];
                const rate = s.total > 0 ? s.followed / s.total : 0;
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
                      {s.followed}
                      <span className="text-sm text-museum-300/40">/{s.total}</span>
                    </div>
                    <p className="text-xs text-museum-300/60">{meta.label}</p>
                    <div className="h-1.5 bg-museum-900/60 rounded-full overflow-hidden mt-2">
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

            {(() => {
              const analysis = getPrimitiveAnalysis();
              return (
                <div
                  className="p-6 rounded-2xl max-w-2xl mx-auto mb-8"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(251, 86, 7, 0.12), rgba(114, 9, 183, 0.08))",
                    border: "1px solid rgba(251, 86, 7, 0.3)",
                  }}
                >
                  <h4 className="text-lg font-bold text-white mb-3">{analysis.title}</h4>
                  <p className="text-sm text-museum-200/80 leading-relaxed">
                    {analysis.description}
                  </p>
                </div>
              );
            })()}

            <div className="glass-card p-6 md:p-8 mb-8">
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Flame className="w-5 h-5" style={{ color: "#e63946" }} />
                本能强度雷达图
              </h4>
              <p className="text-sm text-museum-300/60 mb-6">
                你在各类原始本能上的跟随程度——百分比越高，该本能对你的影响越强
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_PRIMITIVE_CATEGORIES.map((cat) => {
                  const meta = PRIMITIVE_CATEGORY_META[cat];
                  const s = primitiveCategoryStats[cat];
                  const rate = s.total > 0 ? s.followed / s.total : 0;
                  const intensity = Math.min(1, rate * 1.3);
                  const PCatIcon = meta.icon;

                  return (
                    <div
                      key={cat}
                      className="p-5 rounded-xl relative overflow-hidden transition-all hover:scale-[1.01]"
                      style={{
                        background: `linear-gradient(135deg, ${meta.color}${Math.round(
                          5 + intensity * 40
                        ).toString(16).padStart(2, "0")}, rgba(26,26,62,0.6))`,
                        border: `1px solid ${meta.color}${Math.round(
                          20 + intensity * 55
                        ).toString(16).padStart(2, "0")}`,
                        boxShadow: intensity > 0.5 ? `0 0 20px ${meta.color}${Math.round(intensity * 35).toString(16).padStart(2, "0")}` : "none",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${meta.color}20` }}
                        >
                          <PCatIcon className="w-6 h-6" style={{ color: meta.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{meta.emoji}</span>
                            <p className="text-base font-bold text-white">{meta.label}</p>
                          </div>
                          <p className="text-xs text-museum-300/50 mb-1">
                            原始法则：{meta.primitiveLabel}
                          </p>
                          <div className="flex items-end gap-2 mb-2">
                            <span
                              className="text-3xl font-bold"
                              style={{ color: meta.color }}
                            >
                              {Math.round(rate * 100)}
                            </span>
                            <span className="text-sm text-museum-300/50 mb-1">% 跟随本能</span>
                          </div>
                          <div className="h-2 bg-museum-900/60 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${rate * 100}%`,
                                background: `linear-gradient(90deg, ${meta.color}, ${meta.color}cc)`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 mb-8">
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" style={{ color: "#e63946" }} />
                🏙️ 进化错位：你的原始脑如何被现代世界"劫持"
              </h4>
              <p className="text-sm text-museum-300/60 mb-6">
                以下是你每类本能的"原始意义→现代陷阱"对照。你的神经系统是为200万年前的环境设计的，但你生活在2026年。
              </p>

              <div className="space-y-4">
                {getTopPrimitiveCategories(4).map((item, idx) => {
                  const meta = PRIMITIVE_CATEGORY_META[item.category];
                  return (
                    <div
                      key={item.category}
                      className="p-5 rounded-xl"
                      style={{
                        background: `${meta.color}06`,
                        border: `1px solid ${meta.color}20`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                          style={{
                            background: `${meta.color}15`,
                            color: meta.color,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{meta.emoji}</span>
                            <p className="text-base font-bold text-white">
                              {meta.label}
                            </p>
                            <span
                              className="text-sm font-bold"
                              style={{ color: meta.color }}
                            >
                              本能跟随率 {Math.round(item.rate * 100)}%
                            </span>
                          </div>

                          <div
                            className="p-3 rounded-lg mb-3"
                            style={{ background: "rgba(6, 255, 165, 0.06)", border: "1px solid rgba(6, 255, 165, 0.15)" }}
                          >
                            <p className="text-xs font-bold text-neon-green mb-1">🌿 原始意义</p>
                            <p className="text-sm text-museum-200/75">{meta.primitiveLabel}</p>
                          </div>

                          <div
                            className="p-3 rounded-lg"
                            style={{ background: "rgba(230, 57, 70, 0.06)", border: "1px solid rgba(230, 57, 70, 0.15)" }}
                          >
                            <p className="text-xs font-bold mb-1" style={{ color: "#e63946" }}>🏙️ 现代劫持：{meta.modernTitle}</p>
                            <ul className="space-y-1.5">
                              {meta.modernExamples.map((ex, i) => (
                                <li key={i} className="text-sm text-museum-200/75 flex items-start gap-2">
                                  <span style={{ color: "#e63946" }}>·</span>
                                  <span>{ex}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="p-6 rounded-2xl max-w-2xl mx-auto mb-8"
              style={{
                background: "linear-gradient(135deg, rgba(114, 9, 183, 0.15), rgba(251, 86, 7, 0.1))",
                border: "1px solid rgba(114, 9, 183, 0.3)",
              }}
            >
              <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" style={{ color: "#7209b7" }} />
                关键洞察
              </h4>
              <div className="space-y-3 text-sm text-museum-200/80 leading-relaxed">
                <p>
                  你的大脑不是"有缺陷"——它是<span className="text-white font-bold">为200万年前的环境</span>完美优化的。
                  问题是：环境在5000年内发生了剧变（农业→工业→信息时代），但你的神经系统依然按照原始时代的规则运行。
                </p>
                <p>
                  短视频算法比任何原始果实都更懂如何刺激你的<span className="text-white font-bold">多巴胺</span>；
                  消费主义比任何蜂巢都更擅长触发你的<span className="text-white font-bold">稀缺性恐慌</span>；
                  社交媒体比任何部落都更精确地操控你的<span className="text-white font-bold">归属感需求</span>；
                  新闻推送比任何灌木丛里的沙沙声都更有效地激活你的<span className="text-white font-bold">杏仁核</span>。
                </p>
                <p>
                  <span className="font-bold" style={{ color: "#fb5607" }}>这不是你的错——但觉醒是你的责任。</span>
                  当你知道短视频在"劫持"你的即时奖励系统，你就可以主动设置使用时间；
                  当你知道焦虑推送在"劫持"你的危险检测系统，你就可以选择不看；
                  当你知道从众消费在"劫持"你的群体认同系统，你就可以停下来问自己"我真的需要这个吗？"
                </p>
              </div>
            </div>

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
