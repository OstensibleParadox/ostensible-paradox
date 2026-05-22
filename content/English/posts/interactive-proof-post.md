+++
title = 'Erbar-Maas Singular Causal Interventions'
date = '2026-05-22T22:20:00+08:00'
draft = false
categories = ['Academic Papers']
tags = ['causal inference', 'markov chains', 'erbar-maas', 'wasserstein', 'singular perturbation']
summary = 'An interactive laboratory demonstrating singular limits on Continuous-Time Markov Chains.'
+++

How do we reconcile the physical, continuous dynamics of a thermodynamic system with the discontinuous, logical operations of causal graph surgery? 

In classical causal inference (Pearl, 2009), a causal intervention is modeled via the **do-operator**, which surgically severs incoming causal links to a target variable and forces it to a fixed value. While mathematically clean, this "graph surgery" is a discontinuous operation: it instantly zeroes out transition rates, defying physical processes which must obey continuous probability conservation and finite transmission speeds.

The **Erbar-Maas Singular Intervention Theorem** provides a rigorous mathematical bridge. By representing causal interventions as the infinite-rate singular limit of continuous-time restoration forces, we recover Pearl's discontinuous causal surgery exactly as a timescale separation limit on Continuous-Time Markov Chains (CTMCs).

Below is an interactive mathematical laboratory showcasing the convergence, Wasserstein geometry, and entropy gradient flows behind this theorem.

---

{{< interactive_proof >}}

---

## The Mathematical Framework

To understand the core details of this singular limit, we can outline the mathematical structures that govern the simulation above:

### 1. Continuous-Time Markov Chains (CTMCs)

Let our system be defined on a finite state graph with three states $\mathcal{S} = \{A, B, C\}$. The state distribution $p(t) = [p_A(t), p_B(t), p_C(t)]$ evolves according to the Kolmogorov forward equation:

$$\dot{p}(t) = p(t) Q$$

where $Q$ is the infinitesimal generator matrix satisfying:
- $Q_{ij} \geq 0$ for all $i \neq j$ (positive transition intensities).
- $\sum_{j} Q_{ij} = 0$ (probability conservation).

### 2. Detailed Balance and Gradient Flow

We assume the unperturbed chain is reversible with respect to a stationary distribution $\pi$, satisfying the detailed balance condition:

$$\pi_i Q_{ij} = \pi_j Q_{ji}$$

Under this symmetry, the linear Markovian evolution can be rewritten as the steepest descent (gradient flow) of the relative entropy:

$$\mathcal{H}(p \mid \pi) = \sum_{i \in \mathcal{S}} p_i \log \frac{p_i}{\pi_i}$$

under the discrete Riemannian metric introduced by Erbar and Maas. The metric tensor equips the probability simplex with a discrete Wasserstein geometry, where the mobility along edge $(i, j)$ is weighted by the **logarithmic mean** of their densities:

$$\Lambda(p_i, p_j) = \frac{p_i - p_j}{\log p_i - \log p_j}$$

### 3. Pearl's Graph Surgery vs. Singular Perturbation

A hard intervention forcing the system into state $C$ corresponds to severing incoming rates into $C$:

$$Q_{do} = \begin{pmatrix} 
- (Q_{AB} + 0) & Q_{AB} & 0 \\
Q_{BA} & - (Q_{BA} + 0) & 0 \\
Q_{CA} & Q_{CB} & - (Q_{CA} + Q_{CB})
\end{pmatrix}$$

Alternatively, we model this physically by adding a restorative term $\lambda R$ that forces mass into $C$ with rate parameter $\lambda$:

$$Q_\lambda = Q_{do} + \lambda R_C$$

As $\lambda \to \infty$, the system exhibits two distinct timescales:
1. **Fast transient phase ($O(1/\lambda)$):** Any arbitrary initial probability mass collapses onto the intervention face (State $C$) via a projection operator $\Pi_C$.
2. **Slow evolutionary phase:** The remaining probability mass evolves under the projected slow dynamics $\Pi_C Q_{do} \Pi_C$ constrained to the target subspace.

The equivalence is established via:

$$\lim_{\lambda \to \infty} e^{t Q_\lambda} = \Pi_C e^{t \Pi_C Q_{do} \Pi_C}$$

proving that causal graph surgery is the exact singular limit of physical restoration.
