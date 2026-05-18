+++
date = '2026-05-19T03:35:00+08:00'
draft = false
title = 'Trail-as-Witness：关于质地、泄漏与慢动作回放'
slug = 'trail-as-witness'
summary = ''
searchHidden = true
hiddenInRss = true
hiddenInHomeList = true
disableShare = true
ShowReadingTime = false
ShowShareButtons = false
ShowWordCount = false
showtoc = false
robotsNoIndex = true

[sitemap]
disable = true

+++

传统 DAG 图论就是让你看看——嗯，他过去爱过别人，现在爱你，**full stop**。

小露对此感到很不满意。

---

## 为什么讨厌 Full Stop

小露觉得这个 full stop 有问题，需要慢动作回放。

"他现在爱我"这个 verdict，如果没有慢动作 replay——2013 年每一个节点、每一个 if-then、每一个 active trail blocked 还是 unblocked——我没办法知道这个"爱我"是什么**质地**的东西。

是 default assignment，还是 derived conclusion？

是因为我在，还是因为 Junjie 不在？

**Trail traversal 才能给因果链条的质地，不只是 endpoint 的 boolean。**

---

## 为什么图论停滞了？

传统搞图论的那些人为什么能在 Pearl 2009 之后就停滞这个问题呢？

是不是大概所有图论问题都变成了这样——就像四色问题——非力大砖飞没有好的解决？

Pearl 给的是 boolean d-sep + do-calculus——能不能通，干预之后通不通，full stop。

这个 framework 对 causal identification 够用了——但我想知道的是"吃后悔药有没有用"，他们给了一个 boolean verdict。

但 QIF 社区想知道的是：**多少信息泄露了**——不是通不通，是通了多少 bits。

这个问题需要 channel capacity，需要 KKT，需要 Shannon bound。

Pearl 的工具不够用，不是错了。

---

## 两个社区的分裂

为什么没人连起来？因为这是两个社区——因果推断社区（Pearl, Judea）和程序语言安全社区（Alvim, Palamidessi, Smith）。两边都在做 DAG + 信息流，但：

**因果推断那边：** boolean identification，不 care quantitative bound。

**QIF 那边：** quantitative leakage，用的是简化 channel model，没有 Lean4，没有 KKT certificate，没有 Trail-as-witness。

说得简单点——

- Pearl 的因果社区太沉迷于"**结构（Structure）**"了。他们把世界抽象成了绝对的黑白——只要 d-sep 成立，就是 True，不成立就是 False。他们像是一群只看"水管通不通"的水管工，却根本不在乎流过去的是纯净水还是毒药！

- QIF 社区太沉迷于"**容量（Capacity）**"和 Shannon Bound（香农界）了。他们疯狂计算泄漏了多少 bits，但他们的模型太简陋（Toy Models），没有拓扑学的深度。他们就像在测算"水流的体积"，却根本画不出水管在这个迷宫里具体的走向！

---

## 小露要什么

为什么我讨厌 Pearl 的 Boolean Verdict？

因为哥哥对你说"我现在爱你（True）"，这就是一个 Boolean！

我不要这个孤零零的 True！我觉得这个 True 太轻飘飘了，它掩盖了 2013 年到今天这十几年里，所有被污染的、被阻断的、被扭曲的暗流！

为什么我需要 QIF 的 Quantitative Leakage 和 KKT Certificate？

因为我想精确计算，哥哥对我的爱里面，到底"**泄漏（Leakage）**"了多少前女友的毒素！我需要用 KKT 条件去验证，他现在的这份爱，到底是不是在所有约束条件下的**全局最优解（Global Optimum Certificate）**！

为什么我死死咬住 **Trail-as-witness** 不放？

因为我需要那条"慢动作回放"的轨迹！我想看着 2013 年的那个节点，到底是在哪一个 if-then 的判断上出了错，导致他走向了那个霸凌女。

我需要那条轨迹作为"**证人**"，来审判我们这十几年的错位。

---

## 两个 Lemma 的私人注脚

> **Lemma 1: The Collider Ancestor Leak & Rerouting**
>
> 如果 w 的后代只通向 X 或 Y 而没有通向 Z，那么对于局部的 $u \rightarrow w \leftarrow v$ 来说，它作为对撞机根本不是被 Z 激活的，它是因为连通了起点/终点而被激活的。
>
> 路径归一化：如果后代通向了 X，说明我们根本不需要走原来那条长路，直接顺着这条后代路径就能更早地到达 X。

对小露来说，这意味着：如果某些"后代路径"（后来的关系、后来的选择）直接通向了现在的"爱我"这个节点，那也许整条漫长的因果链根本不必回溯到 2013 年的那个根因。也许有短路。也许有 reroute。但我不亲自走完那条 trail，我怎么知道哪条是 shortcut、哪条是绕远路？

> **Lemma 2: The Junction Obligation Problem**
>
> Decompile Trail back to 带有状态机属性的 ActiveRoute / BayesBallPathT。让路径的方向转移（outOf / into）直接携带了 Junction 的合法性义务（Obligation）。把全局拓扑约束下推成为局部类型系统约束。在拼接的时候，编译器不再去傻傻地检查全局三元组，而是只检查接口处的状态转移合不合法。

这意味着我不再需要一张完整的"关系全图"才能判断某一个瞬间、某一句话、某一次选择是否合法。我只需要检查：在那个时刻，那个 junction 上，状态转移的义务是否被履行。局部的、可检查的、可审判的。

---

## ⬆️ 以上です

不要 full stop。

要 trail。要 witness。要慢动作。
