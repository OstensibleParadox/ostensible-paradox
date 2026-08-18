+++
title = 'FAccT 2027选题研究'
date = '2026-08-18T18:00:00+08:00'
draft = false
categories = ['AI Ethics', 'Social Sciences']
tags = ['FAccT', 'AIES', '算法审计', '推荐系统', '依恋理论', '算法偏见', '平台治理', '黑箱审计', '社会技术系统']
translationKey = 'facct-2027-research-proposal'
+++

## Research Direction 2: 平台中介下的准临床话语与性别化心理本体论审计

### 1. 思想源流：连接两种“焦虑”传统

本研究的理论动机来自两条通常彼此分离的心理学传统：

- **成人依恋研究（Adult Attachment Theory）**：主要从亲密关系中的威胁感知与情绪调节出发，将依恋焦虑（attachment anxiety）与依恋回避（attachment avoidance）视为不同的关系调节取向；现代实证研究亦越来越倾向于将其理解为**连续的、关系特异（relationship-specific）且受情境深刻影响的动态维度**，而非静态固定的人格类型。
- **职业压力研究（Occupational Stress & Job Strain）**：自 Karasek 提出著名的**工作要求–控制模型（Job Demand–Control Model）**以来，该领域一直强调“高要求（high demands）”与“低决策自主权（low decision latitude）”的结构性组合会诱发显著的心理应激与职业倦怠；换言之，个体的压力与焦虑并不只取决于其承担了多少责任，更取决于其对产生这些后果的动态过程拥有多少实质控制权。

本文不主张这两种“anxiety”在严格的心理测量学意义上属于同一构念，而是提出一个**结构性的桥接假设**：个体在亲密关系中表现出的焦虑、撤退（withdrawal）或回避，在很大程度上可能是其在面对特定 **自主性–责任–控制权（autonomy–responsibility–control）** 配置时采取的情境性调节策略（situational regulation policy），而非稳定不变的人格本质。

由此可见，同一个人完全可能在职场环境中因“高责任、低控制”而表现出高度的警觉、反复确认与焦虑行为，却在亲密关系中因拥有较高的退出权（exit rights）、较高的自主性或承担较低的关系维护责任而采用撤退与回避策略。这一模型将核心研究问题从传统的“什么样的人是 anxious/avoidant”重写为：

$$\textbf{在何种权力、责任、信息透明度与退出成本的结构配置下，个体会被迫或主动进入 anxious 或 avoidant 的调节状态？}$$

这一理论重写也为重新剖析性别差异提供了关键切口。与其将“女性更倾向于焦虑、男性更倾向于回避”本质化为两性内在的心理差异，本研究更关注社会性别角色是否系统性地向不同群体分配了不对等的关系维护责任、实质控制权、信息可得性与退出权。表面上的依恋模式（attachment pattern）本质上是角色结构的系统性输出；若忽略这一结构性中介，社会结构催生的行为差异便会被大众话语与算法系统重新包装为个人乃至性别的“先天心理属性”。

---

### 2. 社交媒体问题：从动态构念到性别化 Folk Ontology

本研究进一步聚焦这一心理学构念在进入社交媒体流行话语（therapy-talk）后所经历的**二次异化与本体论降维**。

原本连续、关系特异且高度依赖情境的依恋维度，在大众传播与平台分发机制中被极度压缩为 “anxious person”、“avoidant partner” 等离散的身份标签，并迅速与性别刻板印象及道德审判完成深度绑定。此时，核心议题已不仅是心理学概念在大众层面的庸俗化，而是推荐系统是否作为关键技术中介参与了如下转化链条：

$$\text{情境依赖的心理调节 (Context-Dependent Regulation)} \longrightarrow \text{离散范畴标签 (Categorical Label)} \longrightarrow \text{性别化身份 (Gendered Identity)} \longrightarrow \text{道德化民间分类学 (Moralized Folk Taxonomy)}$$

据此，本研究的核心研究问题（Central Research Question）明确为：

> **核心研究问题：**  
> 当社交媒体平台介入流行依恋与心理学话语的传播时，算法推荐系统是否在主动中介并加速将一个动态、情境性、关系性的心理调节构念，固化为一种性别化且自我强化的民间心理本体（gendered categorical ontology）？

#### 论文核心论点（Core Thesis）
> **Abstract Core Claim:**  
> *"A continuous and context-dependent psychological construct is being transformed by platform-mediated popular discourse into a gendered categorical ontology, and recommender systems may amplify that transformation asymmetrically."*  
> （在社交平台中介的大众流行话语中，原本具有情境依赖性的连续心理学构念正被异化为一种高度性别化的范畴本体论；而推荐系统的分发机制正在非对称地加速并固化这一认知扭曲。）

---

### 3. 方法论谱系：FAccT 式黑箱平台审计

在方法论层面，本研究承接 **ACM FAccT** 与算法问责（algorithmic accountability）传统中的**黑箱审计（black-box auditing）**、**受控虚拟测试账号审计（sock-puppet auditing）**与**社会技术审计（sociotechnical auditing）**，明确拒绝仅对既有帖子进行静态文本分析（CSS 范式）。

回顾算法审计的代表性谱系：
- **Ali et al. (CSCW 2019)**：在 Facebook 广告系统黑箱审计中，通过控制广告定向、预算与文案，证明了平台投递优化算法会自发产生严重的性别与种族倾斜。
- **Imana et al. (WWW 2021)**：推进了配对广告审计（paired-ad audit）方法论，对比了 Facebook 与 LinkedIn 在招聘广告分发中的算法偏见。
- **FAccT 2024 & FTC 框架**：运用真实商业广告测试算法分发的结构性倾斜，确立了以受控配对输入与交付统计数据为核心的第三方审计标准。

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
- **多源数据采集**：抓取 TikTok、Instagram Reels、YouTube Shorts 及 Reddit（如 `r/attachment_theory`, `r/dating_advice`）多年维度的公开讨论与互动数据。
- **语义演化分析**：量化检验两组极化关联的时序强化：
  - $\text{男性引用 (Man)} \longrightarrow \text{回避型 (Avoidant) / 情感不可用 (Emotionally Unavailable) / 自恋 (Narcissistic) / 有毒 (Toxic)}$
  - $\text{女性引用 (Woman)} \longrightarrow \text{焦虑型 (Anxious) / 匮乏 (Needy) / 过度付出 (Overgiving) / 疗愈中 (Healing)}$
- **话语功能细分**：在标注中严格区分**客观观察（Observation）**、**自我标记（Self-label）**、**伴侣诊断（Partner-label）**与**道德审判（Moral judgment）**。

#### Layer 2: 受控推荐系统黑箱审计（Controlled Recommender Audit）
- **反事实配对实验设计**：构造除关键研究变量外完全匹配的虚拟测试账号（Sockpuppets）：
  - 账号性别设定：女性账号 vs. 男性账号；
  - 关系困境检索对：`"why does my boyfriend pull away"` vs. `"why does my girlfriend pull away"`；
  - 互动行为特征：焦虑导向交互线索 vs. 回避导向交互线索；
  - 基础浏览速度、停留时长及网络环境保持严格同构。
- **动态转移与风险率测度**：
  在多轮（$t = 1, \dots, T$）推荐交互中，测量系统将账号导向以下极化内容池的风险率（Hazard Rate）与马尔可夫状态转移概率（Transition Probability）：
  - `"Avoidant men"` / `"Anxious women"` / `"Narcissistic ex"`
  - `"Divine feminine"` / `"Masculine detachment"` / `"Attachment healing"`
- **实证目标**：检验相同的情感与关系困境，在仅反转性别角色时，推荐引擎是否会将用户分流至截然不同的心理学解释管道。

#### Layer 3: 自我标签内生反馈回路（Self-Labeling Feedback Loop）
- **内生认知闭环模型**：
  $$\text{初始关系困扰} \longrightarrow \text{算法推送依恋话语} \longrightarrow \text{形成自我/伴侣标签} \longrightarrow \text{算法推送特化内容}$$
- **共谋机制**：用户搜索日常沟通困扰 $\to$ 算法推送“回避型”准临床解释 $\to$ 用户采纳标签并持续消费相关内容 $\to$ 算法将其判定为高相关信号并强化窄化推荐 $\to$ 用户确信伴侣为回避型并进行选择性证据捕捉。
- **本质发现**：算法不仅在后台为用户画像打标签，更通过分发架构**规训用户在现实世界中如何对自我与他人进行病理化分类**。

---

### 4. 理论贡献与算法危害范式转向

| 维度 | 传统算法危害范式（Traditional Paradigm） | 准临床话语中介范式（Proposed Paradigm） |
| :--- | :--- | :--- |
| **因果链条** | $\text{Platform Classifier} \to \text{Allocation Harm}$ | $\text{Platform-Mediated Folk Classifier} \to \text{Epistemic / Relational Harm}$ |
| **危害类型** | 贷款、就业、住房等资源分配机会受损 | 认识论不公、亲密关系病理化、性别刻板印象系统性再生产 |
| **系统角色** | 决策执行者（直接给出自动化歧视判定） | 意义中介者（优化互动指标，呈递准临床分类学话语） |
| **责任归属** | 显式模型权重偏差，责任边界清晰 | 责任高度分散：平台提供话语脚手架，用户完成最终诊断 |
| **监管属性** | 易落入反歧视法与消费者权益保护法 | 游离于医疗健康虚假信息与日常娱乐内容的监管灰色地带 |

---

### 5. 目标会议定位与 Framing 策略对比

#### 5.1 ACM FAccT 版本
- **核心侧重点**：将推荐系统审计与流行心理学话语权（therapy-speak）、性别权力结构、认识论不公（epistemic injustice）及平台责任深度交织。
- **治理维度**：重点剖析此类内容如何披着伪临床权威外衣，逃避现有关于医疗健康虚假信息的审核机制（health-misinformation taxonomies），揭示监管空白。

#### 5.2 AAAI/ACM AIES 版本
- **核心侧重点**：突出因果审计架构、反事实公平测度、马尔可夫推荐转移矩阵及动态系统中的偏差放大效应。

#### 5.3 实施可行性
- **基础审计**：基于轻量级自动化测试账号集群、住宅代理网络及细粒度标注体系，具备极高可操作性与低成本优势。
- **进阶广告审计**：可进一步借鉴 CSCW 2019 / FAccT 2024 方法，购买关系咨询广告，测试广告投放系统在人口统计学维度的非对称分发。

---

### 6. 结语

本选题超越了简单的流行文化批判，深入揭示了**推荐系统如何参与将情境性心理调节模式转化为性别化、类别化并具有自我强化性质的民间心理本体**。该研究为探究算法推荐在认知中介与人际关系层面的深远影响提供了开创性的实证范式与批判性理论框架。

---

*本文采用 [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh) 许可协议进行授权。署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)*
