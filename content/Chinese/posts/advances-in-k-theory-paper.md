+++
title = 'Advances in K-theory paper'
date = '2026-08-20T16:52:35-07:00'
draft = false
categories = ['Maths']
tags = ['K-theory', 'Operator Algebras', 'Cyclic Homology', 'Hochschild Homology', 'C*-algebras']
translationKey = 'advances-in-k-theory-paper'
math = true
+++

取 $M_n=2^{n-2}$ 个正词 $g$，构造二边回溯 cycles
$$ z_n=\sum_g\Big[(x,x^{-1}w_g)+(x^{-1},w_gx)\Big], \qquad w_g=gvg^{-1}. $$

则
$$ b_{\mathrm{Hoch}}z_n=0,\qquad \|\rho(\gamma_{z_n})\|\ge M_n, $$

但对任意固定 $k$，
$$ \|D^kT_{z_n}D^k\|_{S_1} \le 2^{k+1}(2n+4)^k\sqrt{M_n}. $$

同时任意 gauge 都严格消失：
$$ \sum z_{ab}\,[\Phi(ab)-\Phi(ba)] =\langle\Phi,b_{\mathrm{Hoch}}z_n\rangle=0. $$

因此不存在任何 $\Phi,k,C$ 使 proposed weighted $B(\ell^2F\otimes\mathbb C^3)$ kernel 成立。standard channel 也可在一个至少含 $M_n/6$ 条腿的同相 $\rho(g)$-fibre 上独立得到相同反例。

然而更有趣的是，这不反证 full $(PU\text{-}CM)^\circ$：事实上
$$ (\omega_x\otimes\varepsilon)(z_n)=M_n, $$

所以 maximal projective topology 正好看得到 regular id-$S_1$ 漏掉的 aligned mass。因此，每个输出 block $f$ 的 full maximal-CM cycle-dual estimate；固定 $S_3$ resolvent 或单一 id-kernel 都不足以推出完整 $(PU\text{-}CM)^\circ$。

在纯 $q_0^m=C^*_{\max}$ 载体上，cycle density 不只是可闭，而且所有 completed cycles 都是 algebraic $2$-boundaries 的极限；同样覆盖所有 finite-image blocks。证明由 Hahn–Banach separator 转成 bounded cyclic $1$-cocycle，再用 $C^*$-algebra weak amenability 将其写成 coboundary。
