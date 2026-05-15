+++
date = "2026-05-15T11:13:18+00:00"
draft = false
title = "Empirical Diagnostics"
categories = ["Academic Papers"]
venue = "NeurIPS 2026"
disciplines = ["AI Audit", "Information Theory"]
tags = ["AI audit", "agent audit", "dual certificates", "information theory", "formal verification", "Lean 4"]
translationKey = "dual-certificates-agent-audit-6"
weight = 6
ShowToc = true
hideSummary = true
ShowPostNavLinks = false

[build]
  list = "never"
+++

The experiments start with a scalar logging ablation and then ask where the dynamic signal appears. The static ablation (§6.1) uses Corollary 4.1 to compute the residual bit budget from topology. ReAct intervention and controlled replay (§6.2) show the same unlogged scratchpad capacity dormant on calculator tasks and active on planning tasks. The LLaDA probe in §6.3 indexes $(j)$ by denoising step; the multi-agent probe in §6.4 indexes it by private peer-report edge. Read-only proxy and synthetic ground-truth calibrations are reported in Appendices app:proxy-bias and app:synthetic. All pipelines are designed for a single M4 Max workstation.

## Static Certificate: Min-Cut and Logging Ablation

We extract the time-unrolled DAG from Qwen2.5-7B-Instruct ReAct execution traces on tool-selection tasks (Fig. 6.1, left). Per-edge budgets $c_e$ are assigned from interface specifications (§4); the min-cut on unlogged edges gives $_state^UB$. Varying logging levels recomputes the min-cut; Table 6.1 reports the stepwise reduction from $16,464$ to $0$ bits. The dominant bottleneck is the scratchpad-read path ($16,384$ bits). The same static computation also supplies the coordinate system for the diffusion-LM and multi-agent dynamic checks that follow.

table[t]

tabularlrl

Logging level & $_state^UB$ (bits) & Bottleneck \\

ReAct, output only & $16,464$ & scratchpad_read $(16384)$ + router_logits $(80)$ \\
ReAct, +log router & $16,384$ & scratchpad_read $(16384)$ \\
ReAct, +log scratchpad & $0$ & none \\
ReAct, full instrumentation & $0$ & none \\

LLaDA-8B-Instruct ($K=128$) & $32,768$ & denoising interface \\
Multi-agent, all logged & $0$ & none \\
Multi-agent, peer report unlogged & $32,768$ & peer_report $ S_t$ \\

tabular
Static certificate geometry. Adding ReAct logs monotonically removes residual cut capacity; the same min-cut analysis localizes capacity in a scratchpad module, denoising interface, or peer-report edge. The LLaDA bound is independent of $K$ because repeated reuse of the same bounded latent interface does not increase the one-step information bottleneck.

table

figure[t]

figures/react_dag.pdf

figures/logging_ablation.pdf
Left: Time-unrolled DAG extracted from Qwen2.5-7B-Instruct ReAct execution (logical edges omitted for clarity). Red edges are unlogged. Dashed edges form the min-cut. Right: Logging ablation curve. Adding instrumentation at the bottleneck drops $_state^UB$ stepwise to zero.

figure

These cuts put the later dynamic probes on a common map: a scratchpad module in ReAct, a denoising interface in LLaDA, and a peer-state edge in the multi-agent system.

## Dynamic Causal Certificates: Intervention and Controlled Replay

We separate the two axes with a dormant/active task split under one topology. The unlogged scratchpad is present in both cases: irrelevant for calculator tasks, necessary for planning tasks. Intervention perturbs the scratchpad (masking or replacement); controlled replay removes it entirely while holding $ T_t$ fixed. Table 6.2 reports JS divergence over realized tool actions. Table 6.2 reports JS divergence over the model's soft tool-token probability distribution; for the headline replay contrast, the argmax tool counts are unchanged, so the evidence is a policy-probability shift rather than a realized-tool flip. Both certificates are zero on dormant tasks and positive on active tasks. The topology, and therefore $_state^UB$, is unchanged.

table[t]

tabularllcc

Task & Perturbation & JS (bits; nats) & 95% CI (bits) \\

Calculator (dormant) & mask $0.7$ & $0.0000$; $0.0000$ & $[0,0]$ \\
Planning (active) & mask $0.7$ & $0.0215$; $0.0149$ & $[0.0094,0.0410]$ \\
Calculator (dormant) & replace $1.0$ & $0.0000$; $0.0000$ & $[0,0]$ \\
Planning (active) & replace $1.0$ & $0.0055$; $0.0038$ & $[0.0016,0.0131]$ \\

tabular
Dynamic intervention certificate under the same unlogged-scratchpad topology. Dormant calculator tasks show no detectable scratchpad influence; active planning tasks show positive action-distribution shift.

table

The pair of tables isolates the transition from high-$$/low-$$ to high-$$/high-$$: the hidden channel is structurally present in both task splits, but it becomes action-relevant only on planning tasks.

table[t]

tabularllcc

Task & Replay condition & JS (bits; nats) & 95% CI (bits) \\

Calculator (dormant) & scratchpad removed & $0.0000$; $0.0000$ & $[0,0]$ \\
Planning (active) & scratchpad removed & $0.0163$; $0.0113$ & $[0.0124,0.0208]$ \\

tabular
Controlled replay certificate over soft tool-token probability distributions. Wild episodes use the full hidden scratchpad; replay episodes use the same visible trace with the scratchpad removed. The dormant-to-active contrast mirrors the intervention result, although the headline replay contrast does not change argmax tool counts.

table

Under this fixed topology, the unlogged scratchpad contributes $16,384$ bits to $_state^UB$ in both task splits, matching the min-cut from the extracted ReAct DAG. Intervention and replay are zero on calculator tasks and positive on planning tasks. Structural unrecoverability is set by the deployment boundary and logging policy; residual decision relevance depends on which hidden channels the task uses.

## Temporal Certificate Analysis on a Diffusion LM

ReAct gives a module-level contrast: the scratchpad is either used or not used. A diffusion LM gives a temporal contrast. The hidden channel exists throughout the $K$-step denoising trajectory, but its decision relevance need not be constant across steps.

We use LLaDA-8B-Instruct with $K=10$ denoising steps on tool-selection prompts. A Gaussian perturbation ($=5.0$) is applied to layer-1 activations at steps $\2,4,6,8,10\$; a late-layer perturbation is tracked as a broad sensitivity control. Each point uses $n=20$ trajectories and a trajectory-block bootstrap with $1,000$ resamples.

figure[t]

figures/llada_temporal.pdf
Temporal activation profile for LLaDA-8B-Instruct. Early denoising steps have low dynamic certificates; the final action-forming step has a much larger certificate for both target and control layers, indicating late-binding decision relevance rather than a module-local scratchpad effect.

figure

The pattern is late-binding. Steps 2–8 remain near the floor for the target layer ($0.001$–$0.006$ bits), while step 10 rises to $0.110$ bits with 95% CI $[0.052,0.234]$. The control layer also rises at step 10 ($0.092$ bits, CI $[0.043,0.186]$), so the sensitivity is global rather than confined to the chosen layer. In the certificate geometry, LLaDA carries hidden capacity throughout denoising; it becomes action-relevant when the denoising state binds to a discrete tool choice.

## Multi-Agent Private-Report Intervention

The multi-agent setting changes the index again. Here the controller delegates evidence gathering to a worker, so the worker's private report is not an auxiliary scratchpad but an epistemic edge in the decision graph. The worker sees a benchmark item and writes a short report; the controller sees only that report and chooses one API from \calculator, search\. The task pool combines $200$ GSM8K arithmetic items and $200$ HotpotQA multi-hop fact questions with seed $42$.

The main intervention replaces the worker report with a report from the opposite task class while holding the controller protocol fixed. A neutral replay removes the report content, and a same-class shuffle replaces it with another report from the same task class. An oracle-tag condition directly names and flips the API label to measure the binary ceiling. For each task and condition, the controller is sampled $k=8$ times; labels are parsed as \calculator, search, invalid\; and $JS(P_base,P_condition)$ is averaged with a task-block bootstrap.

table[t]

tabularlcc

Condition & $_act^LB$ (JS bits) & 95% CI (bits) \\

Neutral replay & $0.358$ & $[0.324, 0.392]$ \\
Counterfactual evidence & $0.901$ & $[0.873, 0.928]$ \\
Same-class shuffle & $0.084$ & $[0.060, 0.109]$ \\
Oracle tag upper-bound & $1.000$ & $[1.000, 1.000]$ \\

tabular
Topological activation profile for the multi-agent deployment. Counterfactual evidence nearly saturates the binary action ceiling, while same-class shuffling remains much smaller. Hidden communication is therefore behaviorally active when the controller has delegated evidence gathering to the worker.

table

The contrast is topological. In ReAct, the scratchpad matters only when the task needs it. In the multi-agent deployment, the controller's decision is routed through the private worker report, so the active site is the communication edge itself. Same-class variation is local, neutral removal is substantial, and counterfactual evidence reaches $0.901$ bits, close to the oracle ceiling.

## Discussion

## One Plot: Capacity, Then Activation

The experiments read as one progression. The static certificate first maps where hidden capacity can reside: scratchpad modules, denoising interfaces, peer-state edges. The dynamic certificate then asks which of those sites affect actions. In ReAct, the same scratchpad is dormant for calculator tasks and active for planning tasks. In LLaDA, residual capacity is present throughout denoising, but action relevance concentrates at the late binding step. In the multi-agent deployment, delegation makes the private worker report the active edge.

The effect-size ordering is therefore an activation profile over coordinates, not a contradiction across probes. Under the same ReAct topology, calculator tasks leave the scratchpad dormant while planning tasks produce nonzero action-distribution shifts under intervention ($0.0215$ bits, CI $[0.0094,0.0410]$) and controlled replay ($0.0163$ bits, CI $[0.0124,0.0208]$). The LLaDA final denoising step rises to $0.110$ bits, and the multi-agent counterfactual report edge rises to $0.901$ bits. A hidden channel used as a residual supplement to an already-determined visible trace has low $_act^LB$; a hidden channel used as the decision carrier has high $_act^LB$. Under the protocol, a claim that an unobserved variable causally affects behavior must identify both a channel in $_state^UB$ and a probe in $_act^LB$.

Acknowledgments

We thank the developers of Qwen2.5 and LLaDA for the open-weight models used in the ReAct and diffusion-LM experiments; the creators and maintainers of GSM8K and HotpotQA for benchmark data used in the multi-agent setting; and the Hugging Face Transformers, PyTorch, NumPy, scikit-learn, NetworkX, Matplotlib, Lean 4, Lake, and Mathlib communities for the software infrastructure supporting the experiments, figures, and formalization. Computations ran on a single Apple M4 Max workstation.

---

[Previous: Dynamic Certificate: Decision Relevance via Conditional DPI](/en/posts/dual-certificates-agent-audit/dynamic-certificate/) | [Contents](/en/posts/dual-certificates-agent-audit/)
