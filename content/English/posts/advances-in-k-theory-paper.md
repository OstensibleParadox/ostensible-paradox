+++
title = 'Advances in K-theory paper'
date = '2026-08-20T16:52:35-07:00'
draft = false
categories = ['Maths']
tags = ['K-theory', 'Operator Algebras', 'Cyclic Homology', 'Hochschild Homology', 'C*-algebras']
translationKey = 'advances-in-k-theory-paper'
math = true
+++

Take $M_n = 2^{n-2}$ positive words $g$ and construct two-sided backtracking cycles
$$ z_n = \sum_g \Big[(x, x^{-1}w_g) + (x^{-1}, w_g x)\Big], \qquad w_g = gvg^{-1}. $$

Then
$$ b_{\mathrm{Hoch}}z_n = 0, \qquad \|\rho(\gamma_{z_n})\| \ge M_n, $$

whereas for any fixed $k$,
$$ \|D^k T_{z_n} D^k\|_{S_1} \le 2^{k+1}(2n+4)^k \sqrt{M_n}. $$

At the same time, every gauge vanishes identically:
$$ \sum z_{ab}\,[\Phi(ab) - \Phi(ba)] = \langle \Phi, b_{\mathrm{Hoch}}z_n \rangle = 0. $$

Consequently, no choice of $\Phi, k, C$ can make the proposed weighted $B(\ell^2 F \otimes \mathbb{C}^3)$ kernel hold. The standard channel also yields the same counterexample independently on an in-phase $\rho(g)$-fibre containing at least $M_n / 6$ legs.

What is even more interesting, however, is that this does not refute full $(PU\text{-}CM)^\circ$: in fact,
$$ (\omega_x \otimes \varepsilon)(z_n) = M_n, $$

so the maximal projective topology detects precisely the aligned mass missed by the regular id-$S_1$ norm. Therefore, one needs the full maximal-CM cycle-dual estimate on each output block $f$; neither a fixed $S_3$ resolvent nor a single id-kernel suffices to deduce full $(PU\text{-}CM)^\circ$.

On the pure $q_0^m = C^*_{\max}$ carrier, cycle density is not merely closable—all completed cycles are limits of algebraic $2$-boundaries, covering all finite-image blocks as well. The proof converts a Hahn–Banach separator into a bounded cyclic $1$-cocycle and then rewrites it as a coboundary via $C^*$-algebra weak amenability.

