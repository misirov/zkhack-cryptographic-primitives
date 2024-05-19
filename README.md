# SSS

# Cryptographic Primitives Implementation on O1.js

This repository contains two cryptographic primitives which can be further developed for the o1.js library.

## BLS

...

## Shamir Secret Sharing Proofs

Shamir's Secret Sharing is a cryptographic technique for dividing a $secret$ into $shares$ distributed among participants. The $secret$ can only be reconstructed when at least a threshold $k$ of these $shares$ are combined.

The main idea resides in the construction of a polynomial of degree $k-1$ where the secret is encoded as the 0th coefficient

$$
f(x) = a_0 + a_1 x + a_2 x^2 + \cdots + a_{k-1} x^{k-1}
$$

and shares are created by computing $(i, f(i)$. The secret (0th coeffient) can be reconstructed given $k$ shares by using Lagrange Interpolation

$$
f(0) = \sum_{j=0}^{k-1} y_j \prod_{\substack{m=0 \\ m \ne j}}^{k-1} \frac{x_m}{x_m - x_j}
$$

Using `O1.js`, a zero-knowledge proof can be generated during the creation of each share, allowing share holders to prove their ownership without reconstructing the secret. This is particularly useful for verifying the authenticity of shares, especially for users with significant roles or influence, and therefore prevent fake share ownership claims.

