+++
date = "2026-05-15T11:20:17+00:00"
draft = false
title = "智能体审计的双重证书：分离结构不可恢复性与决策相关性"
description = "对已部署的语言模型智能体进行审计，需要两个可分离的量：多少有效操作状态逃逸了记录轨迹，以及这些残差状态中有多少驱动了行为。本文提出一个双重证书协议（dual-certificate protocol）。静态证书 $\\varepsilon_{\\text{state}}^{\\text{UB}}$ 通过未追踪信道上的最小割对残差隐状态熵给出上界。动态证书 $\\delta_{\\text{act}}^{\\text{LB}}$..."
summary = "对已部署的语言模型智能体进行审计，需要两个可分离的量：多少有效操作状态逃逸了记录轨迹，以及这些残差状态中有多少驱动了行为。本文提出一个双重证书协议（dual-certificate protocol）。静态证书 $\\varepsilon_{\\text{state}}^{\\text{UB}}$ 通过未追踪信道上的最小割对残差隐状态熵给出上界。动态证书 $\\delta_{\\text{act}}^{\\text{LB}}$..."
categories = ["学术论文"]
venue = "NeurIPS 2026"
disciplines = ["人工智能审计", "信息论"]
tags = ["AI审计", "智能体审计", "双重证书", "信息论", "形式化验证", "Lean 4"]
translationKey = "dual-certificates-agent-audit"
ShowToc = true
ShowPostNavLinks = false
+++

## 摘要

对已部署的语言模型智能体进行审计，需要两个可分离的量：多少有效操作状态逃逸了记录轨迹，以及这些残差状态中有多少驱动了行为。本文提出一个双重证书协议（dual-certificate protocol）。静态证书 $\varepsilon_{\text{state}}^{\text{UB}}$ 通过未追踪信道上的最小割对残差隐状态熵给出上界。动态证书 $\delta_{\text{act}}^{\text{LB}}$ 通过一个在条件数据处理不等式（conditional DPI）框架下可容许的探针分类体系——重放（replay）、干预（intervention）、代理（proxy）——对残差决策相关性给出下界。这两个轴是独立的。在 ReAct 实验中，日志记录将静态边界从 $16{,}464$ 位逐步消减至 $0$ 位；受控重放将休眠计算器任务与活跃规划任务在相同拓扑下区分开来——软策略偏移为 $0.0163$ 位，95\% CI $[0.0124,0.0208]$——argmax 工具选择保持不变。将 $\delta_{\text{act}}^{\text{LB}}$ 索引化到隐信道坐标上，即得到一个激活剖面（activation profile）。在 LLaDA 去噪轨迹上，扰动在早期步骤中保持接近底线，并在最终绑定步骤升至 $0.110$ 位（95\% CI $[0.052,0.234]$）。在多智能体通信边上，交换一个 Worker 的私人报告给出 $0.901$ 位（95\% CI $[0.873,0.928]$）。一个 Lean 4 工件对自回归零割情形进行了机械化验证，并从 Mathlib 第一原理证明了条件 DPI 和链式法则归约，仅割集容量上界保留为外生结构前提。

## 关键词

智能体审计（agent audit）、双重证书（dual certificates）、结构不可恢复性（structural unrecoverability）、决策相关性（decision relevance）、条件数据处理不等式（conditional DPI）、割集上界（cut-set bound）、自回归零割（autoregressive zero-cut）、Lean 4 形式化

## 目录

- [一、引言](/zh/posts/dual-certificates-agent-audit/引言/)
- [二、相关工作](/zh/posts/dual-certificates-agent-audit/相关工作/)
- [三、设置与审计机制](/zh/posts/dual-certificates-agent-audit/设置与审计机制/)
- [四、静态证书：通过未追踪信道容量的结构上界](/zh/posts/dual-certificates-agent-audit/静态证书/)
- [五、动态证书：通过条件 DPI 的决策相关性](/zh/posts/dual-certificates-agent-audit/动态证书/)
- [六、经验诊断](/zh/posts/dual-certificates-agent-audit/经验与讨论/)
