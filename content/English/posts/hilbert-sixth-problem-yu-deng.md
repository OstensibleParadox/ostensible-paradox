+++
title = "The Hilbert Sixth Problem — Yu Deng"
date = '2026-11-09T16:50:00-08:00'
draft = false
categories = ['Maths']
tags = ['Hilbert Sixth Problem', 'Boltzmann Equation', 'Wave Turbulence', 'Wave Kinetic Equation', 'Kinetic Theory', 'PDE', 'Yu Deng']
translationKey = 'hilbert-sixth-problem-yu-deng'
math = true
+++

> *Lecture transcript of Yu Deng (University of Chicago / USC), delivered on December 6, 2024.*

## 1. Introduction & Hilbert's Sixth Problem

### 1.1 Overview of the Two Main Results

In this talk, I will present two recent results. The first is joint work with Zaher Hani from the University of Michigan, and the second is joint work with Zaher Hani and Xiao Ma, also from the University of Michigan. The first result concerns the rigorous derivation of the wave kinetic equation in wave turbulence, while the second concerns the derivation of the Boltzmann equation in kinetic theory. Although these two results originate from different fields, they are closely related and both fall under the umbrella of Hilbert's sixth problem. I will therefore begin by briefly introducing what is known as Hilbert's sixth problem.

### 1.2 Hilbert's 1900 Lecture: Mathematical Treatment of the Axioms of Physics

Hilbert's sixth problem was one of the twenty-three problems that David Hilbert posed in his address at the 1900 International Congress of Mathematicians (ICM) in Paris, under the title *"Mathematical Treatment of the Axioms of Physics."*

At first glance, this title is extremely broad. However, in an accompanying expository elaboration, Hilbert singled out two specific questions under this heading. The first was the axiomatic foundation of the theory of probability, which was famously resolved by Kolmogorov in the 1930s. The second question—which forms the first main topic of this lecture—is the rigorous mathematical justification of the derivation of continuum fluid equations from microscopic atomic processes.

Macroscopically, we model fluids as continuous media, yet microscopically they are composed of vast numbers of discrete particles—atoms and molecules—obeying their own microscopic dynamics: travelling in straight lines, interacting through potentials, or undergoing collisions. The goal is to analyze the collective behavior of these microscopic constituents and derive from it the macroscopic equations of fluid mechanics, such as the Euler and Navier–Stokes equations governing the evolution of velocity fields. In Hilbert's own words, the problem is *"to develop mathematically the limiting processes ... which lead from the atomistic view to the laws of motion of continua."*

### 1.3 The Two-Stage Limiting Process: Kinetic and Hydrodynamic Limits

More than 120 years later, Hilbert's program has still not been resolved in full generality, though the twentieth and early twenty-first centuries witnessed tremendous progress. Here I will outline the major strategy that is currently best understood—though it is by no means the only conceivable route. In this framework, the passage from microscopic particle systems to macroscopic fluid equations is decomposed into a **two-stage limiting process**:

1. **The Kinetic Limit (Microscopic $\to$ Mesoscopic)**: We start from an $N$-particle dynamical system and pass to the limit as the number of degrees of freedom (the particle number $N$) tends to infinity while the particle diameter $\varepsilon$ tends to zero. In this limit, we derive a mesoscopic kinetic equation—the **Boltzmann equation**—satisfied by the one-particle phase-space density $f(t, x, v)$, which describes the statistical distribution of particles across spatial positions $x$ and velocities $v$.
2. **The Hydrodynamic Limit (Mesoscopic $\to$ Macroscopic)**: Once we have the Boltzmann equation governing the density $f(t, x, v)$, we pass to the fluid equations by letting the collision rate tend to infinity—or equivalently, letting the **mean free path** tend to zero. In this regime, collisions drive the velocity distribution at each spatial point $x$ toward a local Maxwellian (a Gaussian profile in $v$ centered at a bulk velocity $u(t, x)$). Tracking the evolution of these local parameters yields the macroscopic fluid equations—such as the compressible or incompressible Euler or Navier–Stokes equations, depending on the scaling regime.

The second stage—the hydrodynamic limit from the Boltzmann equation to fluid equations—has been extensively studied and is by now comparatively well understood, thanks to the foundational contributions of Caflisch and of De Masi, Esposito, and Lebowitz in the 1980s, and more recently the landmark works of Golse and Saint-Raymond as well as Gallagher and Tristani. For the purpose of linking the two limits, the first stage has long remained the principal bottleneck. In the first half of this talk, I will therefore focus on the kinetic limit.

---

## 2. Part I: Derivation of the Boltzmann Equation in Kinetic Theory

### 2.1 Microscopic Model: The Hard-Sphere Particle System

Let us now describe the microscopic particle system used to derive the Boltzmann equation. Consider $N$ identical particles moving in a fixed three-dimensional domain $\Omega$ (which we may take to be the whole space $\mathbb{R}^3$ or a periodic box $\mathbb{T}^3$). Each particle is modeled as a hard ball of diameter $\varepsilon > 0$; in the kinetic limit, $N \to \infty$ and $\varepsilon \to 0$.

In reality, interparticle forces can be quite intricate, but here we focus on the simplest and most classical interaction: **elastic hard-sphere collisions**, where particles travel rectilinearly at constant velocity until two spheres touch at distance $\varepsilon$ and undergo an instantaneous elastic collision. (One can also consider particles interacting via short-range potentials; conceptually the picture is the same, and I will comment on general potentials later.)

### 2.2 Collision Rate, Mean Free Path, and the Boltzmann–Grad Scaling

To obtain a nontrivial kinetic limit as $N \to \infty$ and $\varepsilon \to 0$, we must impose a scaling relation between $N$ and $\varepsilon$. In three dimensions ($d = 3$), a test particle of diameter $\varepsilon$ travelling over unit time sweeps out a collision cylinder of cross-sectional area proportional to $\varepsilon^2$ (in general dimension $d$, proportional to $\varepsilon^{d-1}$). With $N$ particles present, the expected number of collisions experienced by a given particle per unit time—the **collision rate**—scales like $N\varepsilon^2$ (or $N\varepsilon^{d-1}$ in dimension $d$). Its reciprocal is the **mean free path**, the average distance or time a particle travels between consecutive collisions.

In deriving the Boltzmann equation, we adopt the **Boltzmann–Grad scaling** (introduced by Grad in the late 1940s), which holds the collision rate—and hence the mean free path—fixed of order $O(1)$ independently of $N$ and $\varepsilon$:
$$N \varepsilon^{d-1} = 1 \qquad (\text{or } N\varepsilon^2 = 1 \text{ in } d = 3).$$
(In the subsequent hydrodynamic limit, this collision rate will be sent to infinity, but for now we fix it as a constant.)

### 2.3 Elastic Collision Law and Time Reversibility

When two hard spheres centered at $x$ and $x'$ with velocities $v$ and $v'$ collide at distance $|x - x'| = \varepsilon$, let $\omega = \frac{x' - x}{|x' - x|} \in \mathbb{S}^{d-1}$ denote the unit vector along the line of centers. The post-collisional velocities $(v^*, v'^*)$ are given by the elementary elastic reflection law:
$$\begin{cases}
v^* = v - \big((v - v') \cdot \omega\big)\,\omega, \\
v'^* = v' + \big((v - v') \cdot \omega\big)\,\omega.
\end{cases}$$
That is, the velocity components along the collision axis $\omega$ are exchanged (just as in a one-dimensional elastic collision), while the components orthogonal to $\omega$ remain unchanged. Notice that this microscopic hard-sphere dynamics is **time-reversible** and preserves phase-space volume (Liouville's theorem)—in stark contrast to the macroscopic **time-irreversibility** (the $H$-theorem) of the Boltzmann equation that emerges in the limit.

### 2.4 Correlation Functions ($s$-Particle Densities) and Initial Factorization

Rather than tracking individual trajectories, we study the statistical evolution of the system through its **$s$-particle correlation functions** (or marginal densities) $f_s(t, z_1, \dots, z_s)$, where $z_j = (x_j, v_j) \in \mathbb{R}^d \times \mathbb{R}^d$ denotes the position and velocity of the $j$-th particle. The function $f_s(t, z_1, \dots, z_s)$ gives the joint probability density of finding $s$ distinct particles at phase-space locations $z_1, \dots, z_s$ at time $t$. Together, the hierarchy of densities $\{f_s\}_{1 \le s \le N}$ completely encodes the statistical state of the $N$-particle system, and its exact evolution is governed by the Liouville equation (and the resulting BBGKY hierarchy).

At the initial time $t = 0$, we assume that particles are statistically independent (up to the hard-sphere exclusion condition), so that the $s$-particle densities **factorize** into tensor products of a common one-particle initial profile $f_0(x, v)$:
$$f_s(0, z_1, \dots, z_s) \approx \prod_{j=1}^s f_0(x_j, v_j).$$
The central problem of the kinetic limit is to determine how $f_s(t, z_1, \dots, z_s)$ evolves for $t > 0$ as $N \to \infty$ under the Boltzmann–Grad scaling.

### 2.5 Statistical Independence and Propagation of Chaos

Let us examine the role of statistical independence more closely. The factorization of the initial $s$-particle density reflects the physical postulate—going back to Boltzmann in the nineteenth century (`Stosszahlansatz`, or molecular chaos)—that the states of distinct particles are statistically independent, and that this independence persists at positive times $t > 0$ in the limit $N \to \infty$:
$$\lim_{N \to \infty} f_s(t, z_1, \dots, z_s) = \prod_{j=1}^s f(t, x_j, v_j).$$

At first sight, this property is quite subtle and provoked famous controversies in the early days of kinetic theory. Once two particles collide with each other, their post-collisional states are manifestly correlated and can no longer be strictly independent. However, in the Boltzmann–Grad limit $N \to \infty$, the probability that any two *specific* tagged particles have collided directly or indirectly remains vanishingly small. Thus, with overwhelming probability (in the sense of marginals of any fixed order $s$), any finite tuple of particles remains asymptotically independent at positive times. This asymptotic preservation of factorization is known as **propagation of chaos**; justifying it rigorously over long times is a formidable mathematical challenge.

### 2.6 Structure of the Boltzmann Equation

Once propagation of chaos holds, the multi-particle marginals $f_s(t)$ factorize into products of the one-particle density $f(t, x, v)$, whose evolution is governed by the **Boltzmann equation**:
$$\partial_t f + v \cdot \nabla_x f = \mathcal{Q}(f, f) = \int_{\mathbb{R}^d} \int_{\mathbb{S}^{d-1}} \big[(v - v') \cdot \omega\big]_+ \Big(f(t, x, v^*)\,f(t, x, v'^*) - f(t, x, v)\,f(t, x, v')\Big)\,d\omega\,dv',$$
where $(v^*, v'^*)$ are the pre-/post-collisional velocities preserving momentum ($v^* + v'^* = v + v'$) and kinetic energy ($|v^*|^2 + |v'^*|^2 = |v|^2 + |v'|^2$).

- The **left-hand side** $\partial_t f + v \cdot \nabla_x f$ is the free transport operator: in the absence of collisions, particles travel along straight lines and the density evolves by linear transport.
- The **right-hand side** $\mathcal{Q}(f, f)$ is the quadratic **collision operator**, which splits into a positive **gain term** (accounting for pairs of particles with velocities $(v^*, v'^*)$ at position $x$ that collide to produce a particle with velocity $v$) and a negative **loss term** (accounting for particles at $(x, v)$ that collide with another particle of velocity $v'$ and are scattered out of velocity $v$).

Our mathematical goal in Part I is thus clear: in the Boltzmann–Grad limit $N \to \infty$, we seek to prove propagation of chaos and establish that the one-particle density $f_1(t, x, v)$ converges to the solution $f(t, x, v)$ of the Boltzmann equation.

### 2.7 Historical Review: From Maxwell and Boltzmann to Lanford's Theorem

Let us briefly review the history of this problem:
- **Maxwell and Boltzmann (19th century)** first derived the equation heuristically under the molecular chaos hypothesis.
- **Grad (1949) and Cercignani (1960s–70s)** formulated the problem as a precise mathematical scaling limit (the Boltzmann–Grad limit) and framed it via the **BBGKY hierarchy**.
- **Lanford (1975)** (with subsequent contributions by King) achieved the first landmark rigorous breakthrough, proving convergence of the hard-sphere system to the Boltzmann equation on a **sufficiently short time interval** $[0, t_0]$, where $t_0 > 0$ is a small constant depending on the initial data.
- **Illner and Pulvirenti (1980s)** extended Lanford's theorem to global-in-time validity in a rarefied cloud in $\mathbb{R}^d$, provided the initial density (and hence the collision rate) is sufficiently small—equivalently, when the mean free path is very large.
- **Gallagher, Saint-Raymond, and Texier (2013)** completed and sharpened Lanford's proof, resolving subtle measure-zero recollision issues, establishing explicit convergence rates, and extending the derivation to short-range potentials (see also Pulvirenti, Saffirio, and Simonella).
- **Bodineau, Gallagher, Saint-Raymond, and Simonella (2010s–2020s)** developed a powerful theory for linear kinetic limits and fluctuations around equilibrium (such as the linearized Boltzmann, Ornstein–Uhlenbeck, and fluctuating Boltzmann equations), including long-time results near global Maxwellian equilibrium.

Crucially, however, all prior nonlinear results were restricted either to **short times** (a fraction of the mean free time) or to **small-data / perturbative regimes** near vacuum or global equilibrium.

### 2.8 Short-Time vs. Long-Time Regimes and Non-Perturbative Goals

What is the physical meaning of "short time" in Lanford's theorem? Mathematically, Lanford's time $t_0$ is the radius of convergence of a direct Duhamel power-series expansion in time, which is roughly a small fraction (e.g., one-fifth) of the mean free time between collisions. Physically, this means the derivation breaks down before a typical particle has even experienced its first collision on average.

By contrast, a **long-time (non-perturbative)** derivation must allow particles to undergo ten, a hundred, or any arbitrarily large finite number of collisions—and must hold for arbitrarily large collision rates (arbitrarily small mean free paths) once time is rescaled. In the context of Hilbert's sixth problem, bridging the kinetic limit to the hydrodynamic limit requires precisely such a non-perturbative long-time theorem, because the hydrodynamic limit takes place only after infinitely many collisions have occurred.

This leads to our central question for Part I:
> **Question**: *Can we rigorously derive the Boltzmann equation from microscopic hard-sphere dynamics on any arbitrarily long time interval $[0, T]$—and for arbitrarily large collision rates—for as long as a smooth solution to the Boltzmann equation exists?*

Our second main theorem answers this question in the affirmative. Before stating it, however, let us introduce the parallel problem in wave turbulence.

---

## 3. Part II: Derivation of the Wave Kinetic Equation in Wave Turbulence

### 3.1 Quantum/Wave Analog of Hilbert's Sixth Problem and History of Wave Turbulence

In 1900, when Hilbert delivered his Paris address, quantum mechanics did not yet exist. Over the twentieth century, the rise of quantum physics and nonlinear wave theory naturally led to the wave counterpart of Hilbert's sixth problem: deriving macroscopic kinetic equations from the microscopic dynamics of interacting waves—most notably, from nonlinear dispersive equations such as the **nonlinear Schrödinger (NLS) equation**. This is the mathematical foundation of **wave turbulence** (or weak turbulence) theory.

In wave turbulence, the role of the classical Boltzmann equation is played by the **wave kinetic equation (WKE)**. Early precursors go back to Peierls (1929) on phonon transport in anharmonic crystals and Nordheim (1928) on the quantum Boltzmann equation. The modern theory of wave turbulence flourished in the 1960s through the seminal works of **Hasselmann** (on ocean surface gravity waves) and **Zakharov**, who discovered exact power-law stationary solutions of the wave kinetic equation carrying constant energy or wave-action flux across scales—now known as **Kolmogorov–Zakharov (KZ) spectra**. Wave turbulence has wide-ranging applications across oceanography, plasma physics, Bose–Einstein condensates, and nonlinear optics.

### 3.2 Setup: Large-Box Limit and the Cubic Nonlinear Schrödinger Equation (NLS)

Let us formulate the mathematical model in parallel with the hard-sphere system. Instead of classical particles, the fundamental interacting degrees of freedom in a spatially homogeneous setting are **Fourier modes** $k \in \mathbb{Z}_L^d = (\mathbb{Z}/L)^d$ on a large periodic box $\mathbb{T}_L^d = [0, L]^d$ of side length $L \gg 1$ in dimension $d \ge 3$ (so the number of active modes in a unit frequency band scales like $L^d \to \infty$).

As our canonical microscopic wave model, we consider the **cubic nonlinear Schrödinger (NLS) equation** on $\mathbb{T}_L^d$:
$$i \partial_t u + \Delta u = \alpha |u|^2 u, \qquad x \in \mathbb{T}_L^d,$$
where $0 < \alpha \ll 1$ measures the strength of the nonlinear wave interaction. We study the simultaneous limit $L \to \infty$ (the large-box limit) and $\alpha \to 0$ (the weak-nonlinearity limit), linked by a scaling law of the form
$$\alpha L^\gamma = 1,$$
where $\gamma \in (0, 1]$ is a scaling parameter. (In the spatially inhomogeneous setting using wave packets, the natural scaling is $\gamma = \frac{1}{2}$, i.e., $\alpha L^{1/2} = 1$, which is the direct wave analog of the Boltzmann–Grad scaling; in the homogeneous periodic setting, there is a full range of admissible exponents $\gamma$.)

### 3.3 Random Initial Data and Multi-Point Correlations

Writing $u(t, x) = L^{-d/2} \sum_{k \in \mathbb{Z}_L^d} \widehat{u}_k(t)\,e^{2\pi i k \cdot x}$, the cubic nonlinearity couples quartets of Fourier modes $(k, k_1, k_2, k_3)$ satisfying $k + k_1 = k_2 + k_3$ (a four-wave interaction, in contrast to the binary collisions of the Boltzmann equation).

At time $t = 0$, we prescribe **random initial data** with independent Fourier modes:
$$\widehat{u}_k(0) = \sqrt{n_{\mathrm{in}}(k)}\,\eta_k(\omega),$$
where $n_{\mathrm{in}} : \mathbb{R}^d \to [0, \infty)$ is a smooth, rapidly decaying deterministic initial wave-action profile, and $\{\eta_k\}$ are independent, identically distributed (i.i.d.) standard complex Gaussian (or random-phase) random variables with $\mathbb{E}|\eta_k|^2 = 1$.

Notice a key dictionary translation between particles and waves: the wave field $u$ itself is complex-valued, and physical energy/mass density is quadratic in $u$ (proportional to $|u|^2$). Consequently:
- The **one-particle density** $f_1$ in kinetic theory corresponds to the **two-point correlation** (expected energy spectrum) $\mathbb{E}|\widehat{u}_k(t)|^2$ in wave turbulence;
- The **$s$-particle correlation functions** $f_s$ correspond to **$2s$-point correlations** of the Fourier modes $\widehat{u}_k(t)$.

### 3.4 Kinetic Timescale and Propagation of Chaos for Fourier Modes

In this weak-nonlinearity regime, nontrivial energy exchange among resonant Fourier modes occurs on the **kinetic (Van Hove) timescale**:
$$T_{\mathrm{kin}} \sim \alpha^{-2} \qquad (\text{up to } L\text{-dependent normalization factors}).$$
When $\alpha \sim L^{-1/2}$ and the group velocity is $O(1)$, we have $T_{\mathrm{kin}} \sim L$, meaning that a wave packet travels a distance comparable to the box size $L$ before undergoing its first effective nonlinear interaction—precisely mirroring the mean free path in the Boltzmann–Grad scaling.

Rescaling macroscopic time by $\tau = t / T_{\mathrm{kin}}$, the wave analog of **propagation of chaos** asserts that as $L \to \infty$ and $\alpha \to 0$, distinct Fourier modes $\widehat{u}_{k_1}(\tau T_{\mathrm{kin}}), \dots, \widehat{u}_{k_r}(\tau T_{\mathrm{kin}})$ remain asymptotically independent (and asymptotically Gaussian), so that the full statistical state of the wave field is governed by the evolution of its second moments $\mathbb{E}|\widehat{u}_k(\tau T_{\mathrm{kin}})|^2$ (with fourth, sixth, and higher-order moments obeying Wick's rule plus explicit lower-order cumulant corrections, as predicted in the physics literature by Nazarenko and collaborators).

### 3.5 The Wave Kinetic Equation and Connection to the Quantum Boltzmann Equation

In the kinetic limit $L \to \infty$, the rescaled energy spectrum $\mathbb{E}|\widehat{u}_k(\tau T_{\mathrm{kin}})|^2$ converges to a function $n(\tau, k)$ solving the **wave kinetic equation (WKE)**:
$$\partial_\tau n(\tau, k) = \mathcal{K}(n)(\tau, k) = \int_{(\mathbb{R}^d)^3} \delta(k + k_1 - k_2 - k_3)\,\delta\big(|k|^2 + |k_1|^2 - |k_2|^2 - |k_3|^2\big)\,n\,n_1\,n_2\,n_3 \left(\frac{1}{n} + \frac{1}{n_1} - \frac{1}{n_2} - \frac{1}{n_3}\right) dk_1\,dk_2\,dk_3,$$
where $n_j = n(\tau, k_j)$. Compare this structure with the classical Boltzmann equation:
1. The Dirac delta factors enforce **conservation of momentum (wavenumber)** $k + k_1 = k_2 + k_3$ and **conservation of energy (four-wave resonance)** $|k|^2 + |k_1|^2 = |k_2|^2 + |k_3|^2$.
2. Because we are in the spatially homogeneous setting, there is no spatial transport term $v \cdot \nabla_x$ on the left-hand side.
3. Because the microscopic NLS interaction is cubic (four-wave) rather than quadratic (binary collision), the collision integral $\mathcal{K}(n)$ is **cubic** in $n$:
   $$n\,n_1\,n_2\,n_3\left(\frac{1}{n} + \frac{1}{n_1} - \frac{1}{n_2} - \frac{1}{n_3}\right) = n_2 n_3 (n + n_1) - n n_1 (n_2 + n_3).$$

Remarkably, the **quantum Boltzmann (Boltzmann–Nordheim / Uehling–Uhlenbeck) equation** written down in the 1920s–30s features a collision integrand of the form
$$n_2 n_3 (1 \pm n)(1 \pm n_1) - n n_1 (1 \pm n_2)(1 \pm n_3),$$
whose quadratic part is precisely the classical Boltzmann collision operator and whose cubic part is precisely the wave kinetic collision operator $\mathcal{K}(n)$! Thus, the classical Boltzmann equation and the wave kinetic equation are the two fundamental building blocks of the quantum Boltzmann equation.

### 3.6 Remarks on the Solution Theory of the Wave Kinetic Equation

While our primary focus here is the rigorous microscopic derivation of the Boltzmann and wave kinetic equations rather than their PDE solution theory, it is worth noting that the global analytical behavior of both equations remains rich with open problems. For the wave kinetic equation, local well-posedness holds for smooth data, and finite-time blow-up results in certain regimes were established by Escobedo and Velázquez, while the rigorous dynamical emergence of Kolmogorov–Zakharov spectra and Bose–Einstein condensate singularities remains a major frontier.

### 3.7 Review of Previous Rigorous Results in Wave Turbulence

Let us briefly survey the mathematical milestones leading up to our work:
- **Spohn (1977)** initiated the rigorous kinetic program for the linear Schrödinger equation with a random potential, which was brought to completion by **Erdős and Yau (2000)** and **Erdős, Salmhofer, and Yau (2007–2008)** at and beyond the kinetic timescale (deriving linear Boltzmann and quantum diffusion equations).
- **Lukkarinen and Spohn (2011)** obtained the first rigorous kinetic result for the nonlinear Schrödinger equation, specifically for stationary Gibbs equilibrium fluctuations.
- **Buckmaster, Germain, Hani, and Shatah (2021)** initiated the modern nonlinear, out-of-equilibrium program, proving validity of the leading kinetic approximation on sub-kinetic timescales $t \ll T_{\mathrm{kin}}$.
- **Deng and Hani (2021)** and independently **Collot and Germain (2019–2020)** reached arbitrarily close to the kinetic timescale ($T_{\mathrm{kin}}^{1-\varepsilon}$).
- **Deng and Hani (2021–2023)** achieved the first full derivation of the wave kinetic equation from the cubic NLS on the **exact kinetic timescale** $\tau \in [0, \tau_0]$ for a **sufficiently small** kinetic time $\tau_0 \ll 1$—the direct wave-turbulence counterpart of Lanford's short-time theorem! (Around the same time, **Staffilani and Tran** obtained a short-kinetic-time derivation for a higher-dimensional KdV-type equation in the presence of stochastic forcing.)

Thus, up until 2023, both the classical Boltzmann theory and the nonlinear wave turbulence theory stood at the same threshold: rigorous derivations existed on short kinetic timescales ($\tau_0 \ll 1$), while the long-time, non-perturbative regime remained open.

---

## 4. Main Theorems and Remarks

### 4.1 Theorem 1: Long-Time Derivation of the Wave Kinetic Equation (Deng–Hani)

**Theorem 1 (Deng–Hani, 2023).** *Let $d \ge 3$, and let $n_{\mathrm{in}}$ be a smooth, rapidly decaying initial spectrum. Suppose the wave kinetic equation (WKE) with initial data $n(0, k) = n_{\mathrm{in}}(k)$ admits a smooth solution $n(\tau, k)$ on an arbitrarily large fixed time interval $[0, \tau_*]$ (with no smallness assumption on $\tau_*$ or $n_{\mathrm{in}}$). Then, under suitable scaling laws $(L \to \infty, \alpha \to 0)$, the cubic NLS equation on $\mathbb{T}_L^d$ is long-time well-posed with probability $1 - O(L^{-A})$ on $[0, \tau_* T_{\mathrm{kin}}]$, and for all $\tau \in [0, \tau_*]$:*
$$\mathbb{E}\big|\widehat{u}_k(\tau T_{\mathrm{kin}})\big|^2 = n(\tau, k) + O(L^{-\delta})$$
*uniformly in $\tau \in [0, \tau_*]$ and $k$, for an explicit exponent $\delta > 0$. Moreover, propagation of chaos (asymptotic independence and Gaussianity of distinct Fourier modes) holds across the entire interval $[0, \tau_*]$.*

In short, the wave kinetic approximation holds **for as long as a smooth solution to the wave kinetic equation exists**. One cannot hope for a stronger unconditional statement on $[0, \tau_*]$, since once the solution of the target kinetic equation ceases to exist or develops a singularity, the kinetic description itself must be modified.

### 4.2 Theorem 2: Long-Time Derivation of the Boltzmann Equation (Deng–Hani–Ma)

**Theorem 2 (Deng–Hani–Ma, 2024).** *Let $d \ge 2$, and let $f_0(x, v)$ be a smooth, rapidly decaying initial density on $\mathbb{R}^d \times \mathbb{R}^d$. Suppose the Boltzmann equation with initial data $f(0) = f_0$ admits a smooth, nonnegative solution $f(t, x, v)$ on an arbitrarily large time interval $[0, T_*]$ (with no smallness restriction on $T_*$, the initial data $f_0$, or the collision rate). Then, in the Boltzmann–Grad limit ($N \to \infty$, $\varepsilon \to 0$ with $N\varepsilon^{d-1} = 1$), for every $s \ge 1$ and every $t \in [0, T_*]$, the $s$-particle correlation function $f_s(t)$ of the hard-sphere system satisfies*
$$\big\| f_s(t, z_1, \dots, z_s) - f(t, z_1)^{\otimes s} \big\|_{L^1((\mathbb{R}^d \times \mathbb{R}^d)^s)} \le C_s\,\varepsilon^\delta$$
*for an explicit exponent $\delta > 0$.*

This theorem resolves the long-standing problem of extending Lanford's 1975 theorem from short times to arbitrary macroscopic times $[0, T_*]$, completing the rigorous justification of the first stage of Hilbert's sixth problem for hard spheres.

### 4.3 Remarks: Global Solutions, Periodic Domains, and General Interactions

1. **Global Existence and Diverging Time Horizons ($T_* \to \infty$)**: Whenever the Boltzmann equation or the wave kinetic equation admits a **global-in-time** smooth solution (for instance, near a global Maxwellian equilibrium on the torus $\mathbb{T}^d$, or in dispersive/dissipative regimes), our theorems allow the time horizon $T_* = T_*(N)$ (or $\tau_* = \tau_*(L)$) to grow to infinity as $N, L \to \infty$. This is critical for connecting the kinetic limit directly to the hydrodynamic limit, where the collision rate (or rescaled time horizon) diverges.
2. **Periodic Domains ($\mathbb{T}^d$)**: While Theorem 2 is stated on the whole space $\mathbb{R}^d$, the proof extends to the periodic torus $\mathbb{T}^d$ with minor modifications, which is the natural setting for hydrodynamic limits around global Maxwellians.
3. **More General Microscopic Models**: The same overarching proof strategy applies to spatially inhomogeneous wave turbulence, Schrödinger equations with Hartree interactions (incorporating suitable phase renormalizations), and particle systems interacting via short-range smooth potentials (requiring multi-cluster expansions).

---

## 5. Future Directions and Open Problems

### 5.1 Derivation of the Quantum Boltzmann Equation

A natural next target is the rigorous long-time derivation of the **quantum Boltzmann (Boltzmann–Nordheim) equation**, which combines the quadratic Boltzmann collision operator and the cubic wave kinetic operator. Here one must carefully compare two microscopic starting points—the $N$-body quantum Schrödinger equation versus the second-quantized Fock-space dynamics—and overcome the analytical challenges posed by operator noncommutativity (which precludes naive pointwise or $L^\infty$ bounds).

### 5.2 Energy Cascades, Kolmogorov–Zakharov (KZ) Spectra, and Condensate Singularities

In wave turbulence, two of the deepest physical questions are:
1. **Dynamic emergence of Kolmogorov–Zakharov (KZ) spectra**: Recent work of Collot, Dietert, and Germain established stability properties around KZ spectra for the WKE, but proving that forced-dissipative WKE solutions dynamically converge to KZ cascades—and lifting this behavior back to the microscopic NLS equation—remains wide open because KZ spectra are singular stationary states outside the smooth regime of Theorem 1.
2. **Bose–Einstein condensation and $\delta$-singularities**: If a solution to the WKE forms a finite-time singularity (such as a Dirac mass $\delta(k)$ at $k = 0$ representing a condensate), how does the microscopic NLS solution behave as it approaches and crosses the blow-up time?

### 5.3 General Dispersive Models, 1D Turbulence, and Locally Ill-Posed Kinetic Equations

1. **Quasilinear and 1D Dispersive Models**: Extending the theory from the semilinear cubic NLS in $d \ge 3$ to quasilinear dispersive equations (such as water waves) and low-dimensional models (such as 1D MMT or FPUT chains, or 2D surface water waves with 1D boundary) introduces severe resonance and quasilinear difficulties. In fact, explicit calculations in 1D models often reveal anomalous kinetic corrections.
2. **Locally Ill-Posed Wave Kinetic Equations**: Recent work of Ampatzoglou and Léger showed that the wave kinetic equation associated with the MMT model can be strongly locally ill-posed in certain parameter regimes. When the formal kinetic equation itself is ill-posed, what governs the statistical long-time behavior of the underlying dispersive PDE?

### 5.4 Connecting Kinetic and Hydrodynamic Limits & The Landau Equation

In kinetic theory, combining Theorem 2 with existing hydrodynamic-limit theorems allows one to rigorously pass directly from hard-sphere particle dynamics to the Euler and Navier–Stokes equations in suitable scaling regimes of $(N, \varepsilon)$. Extending this beyond the Boltzmann–Grad regime—for example, toward grazing-collision regimes where a particle undergoes infinitely many weak collisions per unit time, leading to the **Landau equation** via a central-limit-type diffusion in velocity space—remains a major open challenge.

---

## 6. Overview of the Proof Strategy

### 6.1 Time Layering and the Cumulant Expansion Formula

How do we overcome the barrier that restricted Lanford's theorem (and our earlier WKE derivation) to short times? If one expands the microscopic solution directly from $t = 0$ to a large time $T_*$, the number of possible collision/interaction trees grows factorially ($n!$), causing the naive series to diverge as soon as $t > t_0$.

Our proof rests on two pillars:
1. **Time Layering**: We partition the long time interval $[0, T_*]$ into $K = T_* / \tau$ short time layers $[t_m, t_{m+1}]$ of length $\tau \ll 1$, where $\tau$ is small enough that a local-in-time expansion converges on each single step.
2. **Cumulant Expansion Across Layers**: The fundamental obstacle to iterating Lanford's argument step by step is that while the $s$-particle density is *exactly factorized* at $t = 0$, it is **no longer strictly factorized** at the end of the first time step $t = \tau$. Any naive bound on the factorization error gets amplified exponentially by $O(\varepsilon^{-d})$ at the next step, destroying the iteration immediately.

To resolve this, we do not discard the correlations generated during previous time steps; instead, we track them explicitly via a **cumulant expansion**:
$$f_s(t_m, z_1, \dots, z_s) = \sum_{\text{partitions}} \prod f_1(t_m) \, E_H(t_m),$$
where the leading term is the completely factorized product $f_1(t_m)^{\otimes s}$, and the cumulants $E_H(t_m)$ (with $E_\emptyset = 1$) encode the exact $r$-body recollision correlations accumulated across earlier time layers $[0, t_m]$. Crucially, while $E_H$ is small (in $L^1$ for Boltzmann, and pointwise in Fourier space for WKE), we represent $E_H$ explicitly as a sum over **layered interaction history diagrams**, which we call **molecules**.

### 6.2 Controlling Interaction History Diagrams ("Molecules"): Analytical and Combinatorial Estimates

Each cumulant term is expressed as a high-dimensional oscillatory or geometric integral indexed by a **molecule** (an interaction history graph recording all binary collisions or four-wave interactions across time layers). Controlling the sum over all molecules requires two complementary components:

1. **The Analytical Component (Integral Bounds for a Fixed Molecule)**: Given a molecule with a known topological structure (specifically, bounding the number of independent cycles / recollisions), we bound the associated multi-time integral.
   - In the **hard-sphere Boltzmann case**, this step relies on geometric volume estimates for collision constraints and is comparatively direct.
   - In the **wave turbulence (NLS) case**, this step requires delicate oscillatory integral bounds and lattice-point counting estimates from analytic number theory.
2. **The Combinatorial Component (The Cutting Algorithm)**: To prevent factorial divergence when summing over diagrams of arbitrarily high order across $K$ time layers, we must show that molecules containing dangerous recollision cycles carry extra smallness factors in $\varepsilon$ (or $L^{-1}$) that more than compensate for their combinatorial multiplicity. We establish this by designing a **cutting algorithm** that systematically decomposes any arbitrary molecule into elementary building blocks while tracking degrees of freedom.
   - Interestingly, the difficulty here is inverted between the two problems: the cutting algorithm is simpler in the wave kinetic case, whereas in the hard-sphere Boltzmann case it requires a delicate multi-stage surgery to handle overlapping recollisions and exclusion conditions.

Combining the analytical integral bounds with the combinatorial cutting algorithm shows that the cumulants $E_H(t_m)$ remain inductively controlled across arbitrarily many time layers $m = 1, \dots, K$, completing the long-time derivation of both the wave kinetic equation and the Boltzmann equation.
