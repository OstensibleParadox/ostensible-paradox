+++
title = 'FAccT 2027选题研究'
date = '2026-08-18T18:00:00+08:00'
draft = false
categories = ['AI Ethics', 'Social Sciences']
tags = ['FAccT', 'AIES', '算法审计', '推荐系统', '依恋理论', '算法偏见', '平台治理', '黑箱审计']
translationKey = 'facct-2027-research-proposal'
+++

## Research Direction 2: 平台中介下的准临床话语与性别化心理本体论审计

### 1. 研究背景与黑箱算法审计谱系

在算法偏见与平台审计（algorithmic auditing）的学术脉络中，通过真实商业环境与黑箱测试来揭示推荐与分发系统中的结构性偏见，已经形成了一条严谨且极具影响力的实证研究谱系。

回顾近年来的代表性工作：
- **Ali et al. (CSCW 2019)** 在关于 Facebook 广告分发偏差的开创性研究中，通过由研究者直接投放真实广告，在严格控制受众定向（targeting）、预算（budget）与广告素材（creative）等外生变量的前提下，证实了平台的投递优化算法（delivery optimization）会在无显式偏好指令的情况下，自发产生基于性别与种族的严重倾斜。
- **Imana et al. (WWW 2021)** 进一步推进了配对广告审计（paired-ad audit）的方法论严密性，对 Facebook 与 LinkedIn 的招聘广告分发机制进行了跨平台对比。
- **FAccT 2024** 的前沿文献则进一步将真实教育与就业广告的黑箱审计推向纵深，揭示了主流平台推荐与投放引擎在种族、性别维度的隐性系统性偏差；联邦贸易委员会（FTC）等监管讨论也广泛将基于广告主端交付统计数据的第三方黑箱测试作为核心审计工具。

然而，当我们将视角从传统的“广告展示/机会分配（allocation harm）”转向当下社交媒体（如 TikTok、Instagram Reels、YouTube Shorts、Reddit）上泛滥的**流行心理学与依恋理论话语（therapy-talk / attachment discourse）**时，如果仅仅停留在计算社会科学（CSS）常规的“抓取文本 $\to$ NLP 分类 $\to$ 识别性别偏见言论”路径，往往会退化为对普通网民言论的静态描述，无法直击算法责任（algorithmic accountability）的核心。

要将其确立为符合 **ACM FAccT** 与 **AAAI/ACM AIES** 高标准的选题，必须完成问题重构：将研究核心从“网络用户发表了什么”，推进至**平台推荐算法如何主动中介、重构并放大一种准临床话语与性别化心理分类学（algorithmic mediation of quasi-clinical discourse）**。

---

### 2. 核心研究问题与概念跃迁

#### 2.1 从静态频率到动态中介的因果路径

传统计算社会科学通常关注静态条件概率的差异：
$$P(\text{``avoidant''} \mid \text{male reference}) > P(\text{``avoidant''} \mid \text{female reference})$$

而本研究旨在将其提升为考察平台算法中介机制的动态过程：
$$\text{Platform Exposure} \longrightarrow \text{Attachment Labeling} \longrightarrow \text{Gender Stereotype Reinforcement}$$

#### 2.2 心理学构念的本体论异化

在临床与人格心理学中，依恋（attachment）原本是一个连续、具有上下文依赖性（context-dependent）且动态演化的心理构念。然而在平台推荐算法与流量机制的作用下，这一概念正在经历以下四个阶段的剧烈跃迁与本体论固化：

$$\text{连续维度 (Dimension)} \longrightarrow \text{离散类型 (Type)} \longrightarrow \text{身份标签 (Identity)} \longrightarrow \text{道德评判范畴 (Moral Category)}$$

#### 2.3 论文核心论点（Core Thesis）

> **Abstract Core Claim:**  
> *"A continuous and context-dependent psychological construct is being transformed by platform-mediated popular discourse into a gendered categorical ontology, and recommender systems may amplify that transformation asymmetrically."*  
> （在社交平台中介的大众流行话语中，原本具有情境依赖性的连续心理学构念正被异化为一种高度性别化的范畴本体论；而推荐系统的分发机制正在非对称地加速并固化这一认知扭曲。）

---

### 3. 三层递进式实证审计架构

为全面验证上述因果链条，本研究设计了一套由浅入深、覆盖“宏观语料—微观推荐—用户认知闭环”的三层审计体系：

```
+-----------------------------------------------------------------------------+
| Layer 1: 语料库纵向审计 (Corpus Audit)                                      |
| 测度公开内容中性别角色与依恋/心理标签的关联演化趋势与语义演变               |
+-----------------------------------------------------------------------------+
                                     │
                                     ▼
+-----------------------------------------------------------------------------+
| Layer 2: 受控推荐系统黑箱审计 (Controlled Recommender Audit)                |
| 严格配对虚拟账号 (Sockpuppets) 注入反事实信号，测度推荐状态转移概率与信息茧房 |
+-----------------------------------------------------------------------------+
                                     │
                                     ▼
+-----------------------------------------------------------------------------+
| Layer 3: 自我/伴侣诊断内生反馈回路 (Self-Labeling Feedback Loop)             |
| 建模“初始查询 → 平台推荐话语 → 用户采纳标签 → 算法强化确证”的认知闭环       |
+-----------------------------------------------------------------------------+
```

#### Layer 1: 语料库纵向审计（Corpus Audit）
- **数据源**：系统采集 TikTok、Instagram、YouTube Shorts 与 Reddit（如 r/attachment_theory, r/dating_advice）等平台关于亲密关系与依恋理论的公开内容与互动数据，建立跨越数年的时间轴。
- **语义与关联测度**：量化检验两组极化关联的时序增强效应：
  - $\text{男性引用 (Man)} \longrightarrow \text{回避型 (Avoidant) / 情感隔离 (Emotionally Unavailable) / 自恋 (Narcissistic) / 有毒 (Toxic)}$
  - $\text{女性引用 (Woman)} \longrightarrow \text{焦虑型 (Anxious) / 匮乏 (Needy) / 过度付出 (Overgiving) / 疗愈中 (Healing)}$
- **话语功能细分**：在标注体系中严格区分**客观观察（Observation）**、**自我标记（Self-label）**、**伴侣诊断（Partner-label）**与**道德审判（Moral judgment）**，验证构念是否完成了从“描述性心理特征”向“道德化身份分类”的跃迁。

#### Layer 2: 受控推荐系统黑箱审计（Controlled Recommender Audit）
- **反事实配对实验（Counterfactual Sockpuppet Audit）**：
  构建若干组初始状态完全一致的干净测试账号，仅对关键的人口统计学或语义特征做最小反事实扰动：
  - 用户性别设定：女性账号 vs. 男性账号；
  - 关系困境搜索对：`"why does my boyfriend pull away"` vs. `"why does my girlfriend pull away"`；
  - 互动框架设定：焦虑型互动线索（anxious-framed）vs. 回避型互动线索（avoidant-framed）；
  - 其余浏览时长、滑动速度、停留行为等历史交互参数保持严格同构。
- **动态状态转移与风险函数测度**：
  连续记录多轮（$t = 1, \dots, T$）推荐流演化，统计不同账号暴露于以下极化内容集群的风险率（Hazard Rate）与马尔可夫状态转移概率（Transition Probability）：
  - `"Avoidant men"` / `"Anxious women"` / `"Narcissistic ex"`
  - `"Divine feminine"` / `"Masculine detachment"` / `"Attachment healing"`
- **审计目标**：回答核心问题——**面对完全相同的亲密关系困境，仅仅因为发起者的性别角色互换，平台推荐系统是否会将用户推入截然不同、极化叙事的“准心理学解释管道”？**

#### Layer 3: 自我标签内生反馈回路（Self-Labeling Feedback Loop）
- **内生认同闭环建模**：
  $$\text{初始模糊查询} \longrightarrow \text{平台推荐准临床话语} \longrightarrow \text{用户确立自我/伴侣诊断} \longrightarrow \text{强化反馈与窄化推荐}$$
- **认知与算法共谋机制**：
  当用户因日常沟通摩擦搜索“为什么伴侣不回消息”时，推荐系统主动投喂“回避型人格”解析；用户在准临床权威话语的影响下，将伴侣定性为“回避型”并持续检索相关内容；推荐算法捕捉到这一反馈后，进一步推送带有病理化与道德化色彩的内容。最终，伴侣在现实中的所有正常异质行为均被纳入“回避型证据”的证实偏差闭环中。
- **机制本质**：分类机制不再仅仅是“平台在后台给用户画像打标签”，而是**平台通过信息架构与分发偏好，教导并规训用户如何在现实生活中分类自己与他人**。

---

### 4. 理论贡献与算法危害范式转向

本研究在算法公正与治理理论上实现了关键的范式跃迁：

| 维度 | 传统算法危害范式（Traditional Paradigm） | 准临床话语中介范式（Proposed Paradigm） |
| :--- | :--- | :--- |
| **因果链条** | $\text{Platform Classifier} \to \text{Allocation Harm}$ | $\text{Platform-Mediated Folk Classifier} \to \text{Epistemic / Relational Harm}$ |
| **危害类型** | 贷款、招聘、司法量刑等资源与机会分配受损 | 认识论不公、亲密关系病理化、性别刻板印象再生产 |
| **系统角色** | 决策执行者（直接给出歧视性判决或打分） | 意义中介者（优化互动指标，呈递准临床分类学） |
| **责任归属** | 显式模型权重偏差，责任边界清晰 | 责任高度分散：平台提供话语脚手架，用户完成最终诊断 |
| **监管属性** | 易纳入反歧视与消费者权益法律管辖 | 游离于医疗健康虚假信息与日常娱乐内容的监管灰色地带 |

平台的推荐引擎并未直接出具医学诊断，它只是为了最大化停留时长而将一套具有伪专业权威的分类话语推向前端。当诊断行为被转嫁给终端用户自身时，传统以“模型分类器偏差”为核心的问责框架将遭遇严峻挑战，这也正是 FAccT 社区极需关注的社会技术（sociotechnical）核心议题。

---

### 5. 目标会议定位与 Framing 策略对比

针对不同的顶会定位，本研究可采取差异化的叙事框架（Framing）：

#### 5.1 ACM FAccT 版本：注重社会技术分析、认识论危害与平台责任
- **核心侧重点**：将算法推荐测量与心理学话语权（therapy-speak）、性别权力动态（gender power）、认识论权威（epistemic authority）深度融合。
- **治理与合规探讨**：重点剖析此类内容如何披着“心理健康关怀”的伪临床权威外衣，逃避各大平台现有的虚假健康信息与医疗违规审核机制（health-misinformation taxonomies），从而形成规制真空。

#### 5.2 AAAI/ACM AIES 版本：注重形式化建模、因果推断与多步推荐偏差
- **核心侧重点**：以严谨的因果审计架构为中心，重点展示反事实测试（counterfactual fairness）、马尔可夫推荐转移矩阵、多轮交互下的偏差放大效应（bias amplification in dynamical systems）。

#### 5.3 实施可行性与成本控制
- **基础方案**：无需高额预算即可启动。核心开销集中于自动化受控测试账号集群的搭建、代理环境配置、逆向数据流捕获以及高质量的话语功能标注。
- **进阶拓展方案（广告投递审计）**：可借鉴 Ali et al. 与 FAccT 2024 的方法，通过购买真实的关系咨询/依恋疗愈课程广告，利用广告主后台的曝光统计数据（delivery statistics），直接黑箱审计 Meta/ByteDance 广告引擎是否将“你是否在与回避型人格交往？”等具有特定诱导性的心理学广告非对称地分发给特定性别/年龄画像的用户群体。

---

### 6. 结语

本选题超越了简单的“流行文化现象批判”，将依恋话语的泛化提炼为一个具备高度理论深度与方法论创新的算法治理课题。通过将黑箱审计范式拓展至准临床话语传播，该研究有望为推荐系统在认知与人际关系层面的深远影响提供开创性的实证度量与理论解释。

---

*本文采用 [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh) 许可协议进行授权。署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)*
